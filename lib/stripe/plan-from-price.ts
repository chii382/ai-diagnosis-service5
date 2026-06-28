import { normalizeUserPlan, type UserPlan } from "@/lib/plan";

/** Stripe Price ID からアプリ内プランを判定する */
export function resolvePlanFromStripePriceId(priceId: string | null | undefined): UserPlan {
  const standardPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
  const premiumPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM;

  if (priceId && premiumPriceId && priceId === premiumPriceId) {
    return "premium";
  }
  if (priceId && standardPriceId && priceId === standardPriceId) {
    return "standard";
  }

  return "standard";
}

/** Checkout metadata 等からプランを安全に解決する */
export function resolvePlanFromCheckoutMetadata(metadata: Record<string, string> | null | undefined): UserPlan {
  if (metadata?.plan) {
    return normalizeUserPlan(metadata.plan);
  }
  return resolvePlanFromStripePriceId(metadata?.priceId);
}
