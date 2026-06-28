import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { resolvePlanFromStripePriceId } from "@/lib/stripe/plan-from-price";

export const runtime = "nodejs";

function getAppUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    if (!secretKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY が設定されていません" },
        { status: 500 },
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_STRIPE_PRICE_ID が設定されていません" },
        { status: 500 },
      );
    }

    const stripe = new Stripe(secretKey);
    const appUrl = getAppUrl();
    const plan = resolvePlanFromStripePriceId(priceId);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      client_reference_id: session.user.id,
      customer_email: session.user.email ?? undefined,
      metadata: {
        userId: session.user.id,
        plan,
        priceId,
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Checkout URL の生成に失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[checkout] Failed to create session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Checkout Session の作成に失敗しました",
      },
      { status: 500 },
    );
  }
}
