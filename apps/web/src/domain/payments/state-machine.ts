import type { PaymentStatus, SaleStatus } from "./types";

const paymentTransitions: Readonly<Record<PaymentStatus, readonly PaymentStatus[]>> = {
  pending: ["awaiting_customer", "cancelled", "failed"],
  awaiting_customer: ["processing", "paid", "expired", "cancelled", "failed", "under_review"],
  processing: ["paid", "failed", "under_review"],
  paid: ["partially_refunded", "refunded", "under_review"],
  expired: ["under_review"],
  failed: ["under_review"],
  cancelled: ["under_review"],
  under_review: [],
  partially_refunded: ["refunded"],
  refunded: ["under_review"]
};

const saleTransitions: Readonly<Record<SaleStatus, readonly SaleStatus[]>> = {
  draft: ["pending_payment"],
  pending_payment: ["completed", "cancelled"],
  completed: ["voided"],
  cancelled: [],
  voided: []
};

function assertFromTable<T extends string>(
  table: Readonly<Record<T, readonly T[]>>,
  from: T,
  to: T,
  stateMachine: string
): void {
  if (!table[from].includes(to)) {
    throw new Error(`Transisi ${stateMachine} tidak valid: ${from} ke ${to}.`);
  }
}

export function assertPaymentTransition(from: PaymentStatus, to: PaymentStatus): void {
  assertFromTable(paymentTransitions, from, to, "payment");
}

export function assertSaleTransition(from: SaleStatus, to: SaleStatus): void {
  assertFromTable(saleTransitions, from, to, "sale");
}

export function assertTransition(from: PaymentStatus, to: PaymentStatus): void {
  assertPaymentTransition(from, to);
}

export const PAYMENT_TRANSITIONS = paymentTransitions;
export const SALE_TRANSITIONS = saleTransitions;
