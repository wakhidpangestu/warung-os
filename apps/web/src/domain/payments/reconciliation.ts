import type { PaymentAdapter, PaymentRepository, WebhookResult } from "./types";
import { WebhookProcessor } from "./webhook-processor";

export async function reconcilePaymentAttempt(
  repository: PaymentRepository,
  adapter: PaymentAdapter,
  reference: string
): Promise<WebhookResult> {
  const attempt = await repository.findAttempt(reference);
  if (!attempt) return "under_review";
  try {
    const status = await adapter.reconcilePayment(reference);
    return new WebhookProcessor(repository).processReconciliation(adapter, status);
  } catch {
    // A provider timeout does not change a pending attempt. A later job can retry safely.
    return "rejected";
  }
}
