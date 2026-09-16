import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  decrementStock,
  getOrderById,
  markOrderPaid,
} from "@/lib/db/queries";
import { formatPrice } from "@/lib/products";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { ProductTile } from "@/components/ProductBits";

export const metadata: Metadata = {
  title: "Order receipt — Lumina",
  description: "Your Lumina order receipt.",
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;
  if (!user) redirect(`/login?redirect=/account/orders/${id}`);

  let order = await getOrderById(id);
  if (!order) notFound();
  if (order.userId !== user.id) redirect("/account");

  // If we just landed back from Stripe Checkout, confirm the session so the
  // receipt reflects "paid" even before the webhook fires.
  const { session_id } = await searchParams;
  if (session_id && order.status === "pending" && stripeConfigured()) {
    try {
      const session = await getStripe()!.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        await markOrderPaid(order.id);
        await Promise.all(order.items.map((i) => decrementStock(i.productId, i.qty)));
        order = (await getOrderById(id))!;
      }
    } catch {
      // Invalid/wrong session id — show the pending receipt as-is.
    }
  }

  const paid = order.status === "paid";
  const dateLabel = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-700">Receipt</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">
            Order {order.id}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{dateLabel}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            paid ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {paid ? "Paid" : "Pending payment"}
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Line items */}
        <div className="card divide-y divide-hairline p-6">
          <h2 className="pb-4 text-lg font-semibold text-zinc-900">Items</h2>
          <ul className="flex flex-col">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 py-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-50">
                  <ProductTile
                    product={{
                      id: item.productId,
                      name: item.name,
                      price: item.price,
                      rating: 0,
                      reviews: 0,
                      shortDescription: "",
                      description: "",
                      image: "",
                      emoji: "🛍️",
                      gradient: "from-zinc-200 to-zinc-300",
                      stock: 0,
                      category: "audio",
                    }}
                    className="h-full w-full rounded-none"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
                  <p className="text-xs text-zinc-500">Qty {item.qty}</p>
                </div>
                <span className="text-sm font-medium text-zinc-900">
                  {formatPrice(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary + shipping */}
        <aside className="flex flex-col gap-6">
          <div className="card p-6">
            <h2 className="text-base font-semibold text-zinc-900">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-600">Subtotal</dt>
                <dd className="font-medium text-zinc-900">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-600">Shipping</dt>
                <dd className="font-medium text-zinc-900">
                  {order.shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(order.shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-600">Tax (est.)</dt>
                <dd className="font-medium text-zinc-900">{formatPrice(order.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-hairline pt-3 text-base">
                <dt className="font-semibold text-zinc-900">Total</dt>
                <dd className="font-bold text-zinc-900">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="text-base font-semibold text-zinc-900">Ship to</h2>
            <dl className="mt-3 space-y-1 text-sm text-zinc-600">
              <dt className="font-medium text-zinc-900">{order.shippingName}</dt>
              <dd>{order.address}</dd>
              <dd>
                {order.city}, {order.state} {order.zip}
              </dd>
              <dd>{order.country}</dd>
              <dd className="pt-2">{order.email}</dd>
            </dl>
          </div>
        </aside>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/account" className="btn-secondary inline-flex hover:border-zinc-300">
          ← Back to orders
        </Link>
        <Link href="/products" className="btn-primary hover:bg-zinc-700 active:scale-[0.99]">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}