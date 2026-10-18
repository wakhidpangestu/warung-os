import type { PaymentAttempt, PaymentMethod, PaymentRepository } from "./types";

export class InMemoryPaymentRepository implements PaymentRepository {
  private readonly attempts = new Map<string, PaymentAttempt>();
  private readonly eventKeys = new Set<string>();

  async findAttempt(reference: string): Promise<PaymentAttempt | null> {
    return this.attempts.get(reference) ?? null;
  }

  async saveAttempt(attempt: PaymentAttempt): Promise<void> {
    this.attempts.set(attempt.reference, { ...attempt });
  }

  async recordProviderEvent(adapterId: PaymentMethod, eventId: string): Promise<boolean> {
    const key = `${adapterId}:${eventId}`;
    if (this.eventKeys.has(key)) return false;
    this.eventKeys.add(key);
    return true;
  }
}
