import { NextResponse } from "next/server";
import { getOrderByStripeSession, markOrderPaid, decrementStock } from "@/lib/db/queries";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe webhook — called by Stripe after checkout completes.
 * Verifies the signature against STRIPE_WEBHOOK_SECRET, then marks the
 * matching order as paid and decrements stock exactly once.
 *
 * Local dev: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret." }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const order = await getOrderByStripeSession(session.id);
    if (order && order.status !== "paid") {
      await markOrderPaid(order.id);
      await Promise.all(order.items.map((i) => decrementStock(i.productId, i.qty)));
    }
  }

  return NextResponse.json({ received: true });
}