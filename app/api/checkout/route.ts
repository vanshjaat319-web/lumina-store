import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  createOrder,
  decrementStock,
  getProductsByIds,
  markOrderPaid,
  newOrderId,
  snapshotItems,
} from "@/lib/db/queries";
import { estimatedTax, shippingFor } from "@/lib/products";
import type { CartItem } from "@/lib/products";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { redirect } from "next/navigation";

type Address = {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/checkout");

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const items: CartItem[] = Array.isArray(body.items) ? body.items : [];
  const address: Address = body.address ?? {};

  const errors: Record<string, string> = {};
  if (items.length === 0) errors.items = "Cart is empty.";
  if (!address.email || !/.+@.+\..+/.test(address.email)) errors.email = "Enter a valid email.";
  for (const field of ["firstName", "lastName", "address", "city", "state", "zip", "country"]) {
    if (!address[field as keyof Address]?.trim()) errors[field] = "Required.";
  }
  if (!/^\d{5}(-\d{4})?$/.test(address.zip ?? "")) errors.zip = "Enter a 5-digit ZIP code.";
  if (Object.keys(errors).length > 0) return NextResponse.json({ errors }, { status: 422 });

  // Resolve prices + stock from the database — never trust client totals.
  const catalog = await getProductsByIds(items.map((i) => i.productId));
  const { items: snapshot, ready } = snapshotItems(items, catalog);
  if (!ready) {
    return NextResponse.json(
      { errors: { items: "One or more items are unavailable or out of stock." } },
      { status: 422 },
    );
  }

  const subtotal = snapshot.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = shippingFor(subtotal);
  const tax = estimatedTax(subtotal);
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const orderId = newOrderId();
  const shippingName = `${address.firstName!.trim()} ${address.lastName!.trim()}`;

  const orderData = {
    id: orderId,
    userId: user.id,
    email: address.email!.trim(),
    shippingName,
    address: address.address!.trim(),
    city: address.city!.trim(),
    state: address.state!.trim(),
    zip: address.zip!.trim(),
    country: address.country!.trim(),
    subtotal,
    shipping,
    tax,
    total,
  };

  const origin = new URL(request.url).origin;

  // ── Real Stripe path ─────────────────────────────────────────────
  if (stripeConfigured()) {
    const stripe = getStripe()!;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: snapshot.map((i) => ({
        quantity: i.qty,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(i.price * 100),
          product_data: { name: i.name },
        },
      })),
      customer_email: orderData.email,
      metadata: { orderId },
      success_url: `${origin}/account/orders/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    await createOrder({ ...orderData, stripeSessionId: session.id }, snapshot);
    return NextResponse.json({ url: session.url });
  }

  // ── Mock path (STRIPE_SECRET_KEY not set) ────────────────────────
  // Complete the order immediately so the full flow works without Stripe keys.
  await createOrder(orderData, snapshot);
  await markOrderPaid(orderId);
  await Promise.all(snapshot.map((i) => decrementStock(i.productId, i.qty)));
  return NextResponse.json({ orderId });
}