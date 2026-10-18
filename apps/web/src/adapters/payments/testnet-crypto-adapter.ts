import type { PaymentAdapter, PaymentRequest, ProviderStatus, VerifiedEvent } from "@/domain/payments/types";

/** Testnet-only typed placeholder. It intentionally has no crypto or money-processing behavior. */
export class TestnetCryptoAdapter implements PaymentAdapter {
  readonly id = "testnet_crypto" as const;
  readonly mode = "testnet" as const;
  readonly capabilities = { dynamicQr: false, refund: false, expiry: false, webhook: false };

  async createPaymentRequest(_input: { reference: string; amountIdr: bigint; expiresAt: Date }): Promise<PaymentRequest> {
    throw new Error("Adapter kripto testnet belum diimplementasikan.");
  }

  async getPaymentStatus(_reference: string): Promise<ProviderStatus> {
    throw new Error("Adapter kripto testnet belum diimplementasikan.");
  }

  async verifyWebhook(_headers: Headers, _rawBody: string): Promise<VerifiedEvent | null> {
    return null;
  }

  async expirePaymentRequest(_reference: string): Promise<void> {}

  async reconcilePayment(reference: string): Promise<ProviderStatus> {
    return this.getPaymentStatus(reference);
  }
}
