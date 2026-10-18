import type { Rupiah } from "@/lib/money";
import type { PaymentAdapter, PaymentRequest, ProviderStatus, VerifiedEvent } from "@/domain/payments/types";

export interface CashPaymentRequest extends PaymentRequest {
  receivedIdr: Rupiah;
  changeIdr: Rupiah;
  paymentStatus: "paid";
}

export class CashAdapter implements PaymentAdapter {
  readonly id = "cash" as const;
  readonly mode = "live" as const;
  readonly capabilities = { dynamicQr: false, refund: false, expiry: false, webhook: false };

  async createPaymentRequest(input: { reference: string; amountIdr: Rupiah; expiresAt: Date }): Promise<PaymentRequest> {
    return { ...input, mode: this.mode };
  }

  async acceptCash(input: { reference: string; amountIdr: Rupiah; receivedIdr: Rupiah; expiresAt: Date }): Promise<CashPaymentRequest> {
    if (input.receivedIdr < input.amountIdr) throw new RangeError("Uang diterima kurang dari total belanja.");
    return { ...input, changeIdr: input.receivedIdr - input.amountIdr, mode: this.mode, paymentStatus: "paid" };
  }

  async getPaymentStatus(reference: string): Promise<ProviderStatus> {
    throw new Error(`Tunai untuk ${reference} harus dikonfirmasi saat kasir menerima uang.`);
  }

  async verifyWebhook(_headers: Headers, _rawBody: string): Promise<VerifiedEvent | null> {
    return null;
  }

  async expirePaymentRequest(_reference: string): Promise<void> {}

  async reconcilePayment(reference: string): Promise<ProviderStatus> {
    return this.getPaymentStatus(reference);
  }
}
