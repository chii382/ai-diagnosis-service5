import Stripe from "stripe";
import type { UserPlan } from "@/lib/plan";
import {
  resolvePlanFromCheckoutMetadata,
  resolvePlanFromStripePriceId,
} from "@/lib/stripe/plan-from-price";
import {
  updateUserPlanByEmail,
  updateUserPlanById,
} from "@/lib/user/server";

function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY が設定されていません");
  }
  return new Stripe(secretKey);
}

function isCheckoutSessionPaid(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === "paid" || session.status === "complete";
}

async function resolvePlanFromSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<UserPlan> {
  const fromMetadata = resolvePlanFromCheckoutMetadata(session.metadata ?? undefined);
  if (session.metadata?.plan || session.metadata?.priceId) {
    return fromMetadata;
  }

  const lineItems = session.line_items?.data;
  const embeddedPriceId = lineItems?.[0]?.price?.id;
  if (typeof embeddedPriceId === "string") {
    return resolvePlanFromStripePriceId(embeddedPriceId);
  }

  const expanded = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price"],
  });
  const retrievedPriceId = expanded.line_items?.data?.[0]?.price?.id;
  if (typeof retrievedPriceId === "string") {
    return resolvePlanFromStripePriceId(retrievedPriceId);
  }

  return fromMetadata;
}

/** Checkout Session の内容から MongoDB の plan を更新する */
export async function applyPlanFromCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  if (!isCheckoutSessionPaid(session)) {
    console.warn("[checkout] Session is not paid yet", {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      status: session.status,
    });
    return false;
  }

  const stripe = getStripeClient();
  const plan = await resolvePlanFromSession(stripe, session);
  const stripeFields = {
    stripeCustomerId: session.customer ? String(session.customer) : null,
    stripeSubscriptionId: session.subscription ? String(session.subscription) : null,
  };

  const userId = session.metadata?.userId ?? session.client_reference_id;
  if (userId) {
    const updated = await updateUserPlanById(userId, plan, stripeFields);
    if (updated) {
      console.log("[checkout] Updated plan by userId", { userId, plan });
      return true;
    }
    console.warn("[checkout] userId lookup failed", { userId, sessionId: session.id });
  }

  const email = session.customer_details?.email ?? session.customer_email;
  if (email) {
    const updated = await updateUserPlanByEmail(email, plan, stripeFields);
    console.log("[checkout] Updated plan by email", { email, plan, updated });
    return updated;
  }

  console.warn("[checkout] Could not identify user", { sessionId: session.id });
  return false;
}

/** success 画面などから Checkout Session ID で plan 反映する */
export async function fulfillCheckoutSessionById(
  checkoutSessionId: string,
  expectedUserId?: string,
): Promise<{ ok: boolean; plan?: UserPlan }> {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
    expand: ["line_items.data.price"],
  });

  const sessionUserId = session.metadata?.userId ?? session.client_reference_id;
  if (expectedUserId && sessionUserId && sessionUserId !== expectedUserId) {
    console.warn("[checkout] Session user mismatch", {
      expectedUserId,
      sessionUserId,
      checkoutSessionId,
    });
    return { ok: false };
  }

  const plan = await resolvePlanFromSession(stripe, session);
  const ok = await applyPlanFromCheckoutSession(session);
  return { ok, plan: ok ? plan : undefined };
}
