import type { PaymentAdapter, PaymentMethod } from "./types";
import { PaymentMethodDisabledError } from "./types";

export interface PaymentFeatureFlags {
  FEATURE_QRIS_LIVE: boolean;
  FEATURE_CRYPTO_TESTNET: boolean;
  FEATURE_CRYPTO_LIVE: boolean;
}

export class PaymentAdapterRegistry {
  private readonly adapters = new Map<PaymentMethod, PaymentAdapter>();

  constructor(private readonly flags: PaymentFeatureFlags) {}

  register(adapter: PaymentAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  getEnabled(method: PaymentMethod, shopEnabledMethods: ReadonlySet<PaymentMethod>): PaymentAdapter {
    const adapter = this.adapters.get(method);
    if (!adapter || !shopEnabledMethods.has(method) || !this.isFeatureEnabled(method)) {
      throw new PaymentMethodDisabledError(method);
    }
    return adapter;
  }

  private isFeatureEnabled(method: PaymentMethod): boolean {
    if (method === "qris_live") return this.flags.FEATURE_QRIS_LIVE;
    if (method === "testnet_crypto") {
      return this.flags.FEATURE_CRYPTO_TESTNET && !this.flags.FEATURE_CRYPTO_LIVE;
    }
    return true;
  }
}
