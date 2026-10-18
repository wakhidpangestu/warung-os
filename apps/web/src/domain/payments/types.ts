import type { Rupiah } from "@/lib/money";

export const PAYMENT_STATUSES = [
  "pending",
  "awaiting_customer",
  "processing",
  "paid",
  "expired",
  "failed",
  "cancelled",
  "under_review",
  "partially_refunded",
  "refunded"
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const SALE_STATUSES = ["draft", "pending_payment", "completed", "cancelled", "voided"] as const;
export type SaleStatus = (typeof SALE_STATUSES)[number];

export type PaymentMethod = "cash" | "mock" | "qris_live" | "testnet_crypto";
export type PaymentMode = "mock" | "sandbox" | "live" | "testnet";

export interface PaymentCapabilities {
  dynamicQr: boolean;
  refund: boolean;
  expiry: boolean;
  webhook: boolean;
}

export interface PaymentRequest {
  reference: string;
  amountIdr: Rupiah;
  expiresAt: Date;
  mode: PaymentMode;
  displayPayload?: string;
}

export interface ProviderStatus {
  reference: string;
  status: PaymentStatus;
  amountIdr: Rupiah;
  currency: "IDR";
  eventId?: string;
  occurredAt?: Date;
}

export interface VerifiedEvent extends ProviderStatus {
  eventId: string;
}

export interface RefundInput {
  reference: string;
  amountIdr: Rupiah;
  reason: string;
}

export interface RefundResult {
  refundReference: string;
  status: "pending" | "completed" | "failed";
}

export interface PaymentAdapter {
  readonly id: PaymentMethod;
  readonly mode: PaymentMode;
  readonly capabilities: PaymentCapabilities;
  createPaymentRequest(input: {
    reference: string;
    amountIdr: Rupiah;
    expiresAt: Date;
  }): Promise<PaymentRequest>;
  getPaymentStatus(reference: string): Promise<ProviderStatus>;
  verifyWebhook(headers: Headers, rawBody: string): Promise<VerifiedEvent | null>;
  expirePaymentRequest(reference: string): Promise<void>;
  reconcilePayment(reference: string): Promise<ProviderStatus>;
  refundPayment?(input: RefundInput): Promise<RefundResult>;
}

export interface PaymentAttempt {
  reference: string;
  adapterId: PaymentMethod;
  amountIdr: Rupiah;
  currency: "IDR";
  expiresAt: Date;
  paymentStatus: PaymentStatus;
  saleStatus: SaleStatus;
}

export interface PaymentRepository {
  findAttempt(reference: string): Promise<PaymentAttempt | null>;
  saveAttempt(attempt: PaymentAttempt): Promise<void>;
  recordProviderEvent(adapterId: PaymentMethod, eventId: string): Promise<boolean>;
}

export type WebhookResult = "applied" | "duplicate" | "rejected" | "under_review";

export class PaymentMethodDisabledError extends Error {
  constructor(method: PaymentMethod) {
    super(`Metode pembayaran ${method} tidak aktif.`);
    this.name = "PaymentMethodDisabledError";
  }
}
