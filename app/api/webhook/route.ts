import Stripe from "stripe";
import { NextResponse } from "next/server";
import { applyPlanFromCheckoutSession } from "@/lib/stripe/fulfill-checkout";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!signature || !webhookSecret || !secretKey) {
    console.error("[webhook] Missing signature, webhook secret, or secret key");
    return NextResponse.json({ error: "Webhook configuration error" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[webhook] Signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("[webhook] checkout.session.completed", {
        sessionId: session.id,
        email: session.customer_details?.email,
        userId: session.metadata?.userId ?? session.client_reference_id,
        paymentStatus: session.payment_status,
      });

      await applyPlanFromCheckoutSession(session);
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = String(subscription.customer);
      console.log("[webhook] customer.subscription.deleted", { customerId });

      const { getUsersCollection } = await import("@/lib/mongodb");
      const users = await getUsersCollection();
      await users.updateOne(
        { stripeCustomerId: customerId },
        {
          $set: {
            plan: "free",
            updatedAt: new Date(),
            stripeSubscriptionId: null,
          },
        },
      );
    } else {
      console.log("[webhook] Unhandled event type:", event.type);
    }
  } catch (error) {
    console.error("[webhook] Event handling failed:", error);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
