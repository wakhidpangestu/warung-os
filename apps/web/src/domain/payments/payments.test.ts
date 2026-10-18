import { describe, expect, it, vi } from "vitest";
import { CashAdapter } from "@/adapters/payments/cash-adapter";
import { MockPaymentAdapter } from "@/adapters/payments/mock-adapter";
import { TestnetCryptoAdapter } from "@/adapters/payments/testnet-crypto-adapter";
import { InMemoryPaymentRepository } from "./repository";
import { reconcilePaymentAttempt } from "./reconciliation";
import { PaymentAdapterRegistry } from "./registry";
import {
  PAYMENT_TRANSITIONS,
  SALE_TRANSITIONS,
  assertPaymentTransition,
  assertSaleTransition,
} from "./state-machine";
import type { PaymentAttempt, ProviderStatus } from "./types";
import { PAYMENT_STATUSES, PaymentMethodDisabledError, SALE_STATUSES } from "./types";
import { WebhookProcessor } from "./webhook-processor";

const now = new Date("2026-10-18T00:00:00.000Z");

function attempt(overrides: Partial<PaymentAttempt> = {}): PaymentAttempt {
  return {
    reference: "pay-001",
    adapterId: "mock",
    amountIdr: 10_000n,
    currency: "IDR",
    expiresAt: new Date("2099-10-18T00:05:00.000Z"),
    paymentStatus: "awaiting_customer",
    saleStatus: "pending_payment",
    ...overrides,
  };
}

function mockBody(overrides: Partial<Record<string, string>> = {}): string {
  return JSON.stringify({
    eventId: "evt-001",
    reference: "pay-001",
    status: "paid",
    amountIdr: "10000",
    currency: "IDR",
    occurredAt: now.toISOString(),
    ...overrides,
  });
}

function signedHeaders(adapter: MockPaymentAdapter, body: string): Headers {
  return new Headers({ "x-mock-signature": adapter.signWebhookBody(body) });
}

describe("payment state machines", () => {
  it("menerapkan seluruh tabel transisi payment dan menolak pasangan lain", () => {
    for (const from of PAYMENT_STATUSES) {
      for (const to of PAYMENT_STATUSES) {
        const allowed = PAYMENT_TRANSITIONS[from].includes(to);
        const assertion = () => assertPaymentTransition(from, to);
        if (allowed) expect(assertion).not.toThrow();
        else expect(assertion).toThrow();
      }
    }
  });

  it("menerapkan seluruh tabel transisi sale dan menolak pasangan lain", () => {
    for (const from of SALE_STATUSES) {
      for (const to of SALE_STATUSES) {
        const allowed = SALE_TRANSITIONS[from].includes(to);
        const assertion = () => assertSaleTransition(from, to);
        if (allowed) expect(assertion).not.toThrow();
        else expect(assertion).toThrow();
      }
    }
  });
});

describe("adapter pembayaran", () => {
  it("cash langsung paid, menghitung kembalian, dan menolak uang kurang", async () => {
    const adapter = new CashAdapter();
    await expect(
      adapter.acceptCash({
        reference: "cash-1",
        amountIdr: 10_000n,
        receivedIdr: 9_999n,
        expiresAt: now,
      }),
    ).rejects.toThrow();
    await expect(
      adapter.acceptCash({
        reference: "cash-1",
        amountIdr: 10_000n,
        receivedIdr: 12_000n,
        expiresAt: now,
      }),
    ).resolves.toMatchObject({
      paymentStatus: "paid",
      changeIdr: 2_000n,
    });
  });

  it("mock memakai label MOCK dan signature HMAC", async () => {
    const adapter = new MockPaymentAdapter("mock-secret");
    const request = await adapter.createPaymentRequest({
      reference: "pay-001",
      amountIdr: 10_000n,
      expiresAt: now,
    });
    expect(request.mode).toBe("mock");
    expect(request.displayPayload).toContain("MOCK://");
    const body = mockBody();
    await expect(adapter.verifyWebhook(signedHeaders(adapter, body), body)).resolves.toMatchObject({
      status: "paid",
    });
  });

  it("registry menolak metode yang tidak aktif dari request buatan", () => {
    const registry = new PaymentAdapterRegistry({
      FEATURE_QRIS_LIVE: false,
      FEATURE_CRYPTO_TESTNET: false,
      FEATURE_CRYPTO_LIVE: false,
    });
    registry.register(new MockPaymentAdapter("mock-secret"));
    registry.register(new TestnetCryptoAdapter());
    expect(() => registry.getEnabled("mock", new Set())).toThrow(PaymentMethodDisabledError);
    expect(() => registry.getEnabled("testnet_crypto", new Set(["testnet_crypto"]))).toThrow(
      PaymentMethodDisabledError,
    );
  });
});

describe("WebhookProcessor", () => {
  async function setup(initial = attempt()) {
    const repository = new InMemoryPaymentRepository();
    await repository.saveAttempt(initial);
    const adapter = new MockPaymentAdapter("mock-secret");
    return { repository, adapter, processor: new WebhookProcessor(repository) };
  }

  it("menolak signature salah dan signature yang tidak ada", async () => {
    const { adapter, processor } = await setup();
    const body = mockBody();
    await expect(
      processor.process(adapter, new Headers({ "x-mock-signature": "00" }), body),
    ).resolves.toBe("rejected");
    await expect(processor.process(adapter, new Headers(), body)).resolves.toBe("rejected");
  });

  it("idempoten untuk replay dan event duplikat", async () => {
    const { adapter, processor, repository } = await setup();
    const body = mockBody();
    await expect(processor.process(adapter, signedHeaders(adapter, body), body)).resolves.toBe(
      "applied",
    );
    await expect(processor.process(adapter, signedHeaders(adapter, body), body)).resolves.toBe(
      "duplicate",
    );
    await expect(repository.findAttempt("pay-001")).resolves.toMatchObject({
      paymentStatus: "paid",
      saleStatus: "completed",
    });
  });

  it("mengirim nominal atau mata uang salah ke under_review", async () => {
    const { adapter, processor, repository } = await setup();
    const body = mockBody({ amountIdr: "9999" });
    await expect(processor.process(adapter, signedHeaders(adapter, body), body)).resolves.toBe(
      "under_review",
    );
    await expect(repository.findAttempt("pay-001")).resolves.toMatchObject({
      paymentStatus: "under_review",
    });
  });

  it("mengirim referensi tak dikenal ke under_review", async () => {
    const { adapter, processor } = await setup();
    const body = mockBody({ reference: "missing-reference" });
    await expect(processor.process(adapter, signedHeaders(adapter, body), body)).resolves.toBe(
      "under_review",
    );
  });

  it("menangani urutan event terbalik tanpa melunaskan kembali", async () => {
    const { adapter, processor, repository } = await setup();
    const paid = mockBody();
    const reversed = mockBody({ eventId: "evt-002", status: "awaiting_customer" });
    await expect(processor.process(adapter, signedHeaders(adapter, paid), paid)).resolves.toBe(
      "applied",
    );
    await expect(
      processor.process(adapter, signedHeaders(adapter, reversed), reversed),
    ).resolves.toBe("under_review");
    await expect(repository.findAttempt("pay-001")).resolves.toMatchObject({
      paymentStatus: "under_review",
      saleStatus: "completed",
    });
  });

  it("meninjau pembayaran terlambat pada attempt expired", async () => {
    const { adapter, processor } = await setup(
      attempt({ expiresAt: new Date("2020-01-01T00:00:00.000Z") }),
    );
    const body = mockBody();
    await expect(processor.process(adapter, signedHeaders(adapter, body), body)).resolves.toBe(
      "under_review",
    );
  });

  it("rekonsiliasi memakai jalur yang sama dan timeout membiarkan attempt pending", async () => {
    const { adapter, repository } = await setup(attempt({ paymentStatus: "pending" }));
    const providerStatus: ProviderStatus = {
      reference: "pay-001",
      status: "awaiting_customer",
      amountIdr: 10_000n,
      currency: "IDR",
      eventId: "reconcile-1",
    };
    adapter.setStatus(providerStatus);
    await expect(reconcilePaymentAttempt(repository, adapter, "pay-001")).resolves.toBe("applied");
    vi.spyOn(adapter, "reconcilePayment").mockRejectedValueOnce(new Error("provider timeout"));
    await expect(reconcilePaymentAttempt(repository, adapter, "pay-001")).resolves.toBe("rejected");
    await expect(repository.findAttempt("pay-001")).resolves.toMatchObject({
      paymentStatus: "awaiting_customer",
    });
  });
});
