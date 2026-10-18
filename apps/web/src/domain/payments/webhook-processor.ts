import { assertPaymentTransition, assertSaleTransition } from "./state-machine";
import type {
  PaymentAdapter,
  PaymentAttempt,
  PaymentRepository,
  ProviderStatus,
  VerifiedEvent,
  WebhookResult,
} from "./types";

export class WebhookProcessor {
  constructor(private readonly repository: PaymentRepository) {}

  async process(
    adapter: PaymentAdapter,
    headers: Headers,
    rawBody: string,
  ): Promise<WebhookResult> {
    const event = await adapter.verifyWebhook(headers, rawBody);
    if (!event) return "rejected";
    return this.processVerifiedEvent(adapter, event);
  }

  async processReconciliation(
    adapter: PaymentAdapter,
    status: ProviderStatus,
  ): Promise<WebhookResult> {
    const event: VerifiedEvent = {
      ...status,
      eventId:
        status.eventId ??
        `reconcile:${status.reference}:${status.status}:${status.occurredAt?.toISOString() ?? "none"}`,
    };
    return this.processVerifiedEvent(adapter, event);
  }

  private async processVerifiedEvent(
    adapter: PaymentAdapter,
    event: VerifiedEvent,
  ): Promise<WebhookResult> {
    if (!(await this.repository.recordProviderEvent(adapter.id, event.eventId))) return "duplicate";

    const attempt = await this.repository.findAttempt(event.reference);
    if (!attempt || attempt.adapterId !== adapter.id) return "under_review";
    if (attempt.amountIdr !== event.amountIdr || event.currency !== attempt.currency) {
      return this.markUnderReview(attempt);
    }
    if (event.status === "paid" && attempt.expiresAt <= new Date()) {
      return this.markUnderReview(attempt);
    }

    try {
      assertPaymentTransition(attempt.paymentStatus, event.status);
      const saleStatus =
        event.status === "paid"
          ? "completed"
          : event.status === "expired"
            ? "cancelled"
            : attempt.saleStatus;
      if (saleStatus !== attempt.saleStatus) assertSaleTransition(attempt.saleStatus, saleStatus);
      await this.repository.saveAttempt({ ...attempt, paymentStatus: event.status, saleStatus });
      return "applied";
    } catch {
      return this.markUnderReview(attempt);
    }
  }

  private async markUnderReview(attempt: PaymentAttempt): Promise<WebhookResult> {
    try {
      assertPaymentTransition(attempt.paymentStatus, "under_review");
      await this.repository.saveAttempt({ ...attempt, paymentStatus: "under_review" });
    } catch {
      // The event is retained for a manual investigation even when the attempt cannot move further.
    }
    return "under_review";
  }
}
