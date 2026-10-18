import { createHmac, timingSafeEqual } from "node:crypto";
import type { Rupiah } from "@/lib/money";
import type {
  PaymentAdapter,
  PaymentRequest,
  PaymentStatus,
  ProviderStatus,
  VerifiedEvent,
} from "@/domain/payments/types";

interface MockEventBody {
  eventId: string;
  reference: string;
  status: PaymentStatus;
  amountIdr: string;
  currency: "IDR";
  occurredAt: string;
}

export class MockPaymentAdapter implements PaymentAdapter {
  readonly id = "mock" as const;
  readonly mode = "mock" as const;
  readonly capabilities = { dynamicQr: true, refund: false, expiry: true, webhook: true };
  private readonly statuses = new Map<string, ProviderStatus>();

  constructor(private readonly webhookSecret: string) {}

  async createPaymentRequest(input: {
    reference: string;
    amountIdr: Rupiah;
    expiresAt: Date;
  }): Promise<PaymentRequest> {
    const status: ProviderStatus = {
      reference: input.reference,
      status: "awaiting_customer",
      amountIdr: input.amountIdr,
      currency: "IDR",
    };
    this.statuses.set(input.reference, status);
    return { ...input, mode: this.mode, displayPayload: `MOCK://PAY/${input.reference}` };
  }

  setStatus(status: ProviderStatus): void {
    this.statuses.set(status.reference, status);
  }

  async getPaymentStatus(reference: string): Promise<ProviderStatus> {
    const status = this.statuses.get(reference);
    if (!status) throw new Error(`Referensi MOCK tidak ditemukan: ${reference}`);
    return status;
  }

  async verifyWebhook(headers: Headers, rawBody: string): Promise<VerifiedEvent | null> {
    const supplied = headers.get("x-mock-signature");
    if (!supplied || !this.sign(rawBody, supplied)) return null;
    try {
      const parsed: unknown = JSON.parse(rawBody);
      if (!isMockEventBody(parsed)) return null;
      return {
        eventId: parsed.eventId,
        reference: parsed.reference,
        status: parsed.status,
        amountIdr: BigInt(parsed.amountIdr),
        currency: parsed.currency,
        occurredAt: new Date(parsed.occurredAt),
      };
    } catch {
      return null;
    }
  }

  async expirePaymentRequest(reference: string): Promise<void> {
    const status = await this.getPaymentStatus(reference);
    this.statuses.set(reference, { ...status, status: "expired" });
  }

  async reconcilePayment(reference: string): Promise<ProviderStatus> {
    return this.getPaymentStatus(reference);
  }

  signWebhookBody(rawBody: string): string {
    return createHmac("sha256", this.webhookSecret).update(rawBody).digest("hex");
  }

  private sign(rawBody: string, supplied: string): boolean {
    const expected = Buffer.from(this.signWebhookBody(rawBody), "hex");
    let candidate: Buffer;
    try {
      candidate = Buffer.from(supplied, "hex");
    } catch {
      return false;
    }
    return candidate.length === expected.length && timingSafeEqual(expected, candidate);
  }
}

function isMockEventBody(value: unknown): value is MockEventBody {
  if (typeof value !== "object" || value === null) return false;
  const event = value as Record<string, unknown>;
  return (
    typeof event.eventId === "string" &&
    typeof event.reference === "string" &&
    typeof event.status === "string" &&
    typeof event.amountIdr === "string" &&
    event.currency === "IDR" &&
    typeof event.occurredAt === "string"
  );
}
