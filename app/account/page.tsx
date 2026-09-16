import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { listOrdersByUser } from "@/lib/db/queries";
import { formatPrice } from "@/lib/products";

export const metadata: Metadata = {
  title: "Your account — Lumina",
  description: "Your Lumina orders and receipts.",
};

const ORDER_STATUS_BADGE: Record<string, string> = {
  pending: "bg-zinc-100 text-zinc-600",
  paid: "bg-emerald-50 text-emerald-700",
};

function noUser() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-white text-4xl ring-1 ring-hairline">
        👤
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">Your account</h1>
      <p className="mt-3 max-w-sm leading-7 text-zinc-600">
        Sign in to see your orders, receipts, and shipping details.
      </p>
      <Link href="/login" className="btn-primary mt-8 hover:bg-zinc-700 active:scale-[0.99]">
        Sign in
      </Link>
    </div>
  );
}

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) return noUser();

  // When the user is hard-redirected from checkout, keep them here.
  const orders = await listOrdersByUser(user.id);
  const admin = await isAdmin(user);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-700">Account</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">
            Hi, {user.name || "there"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {admin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700"
            >
              ⚙️ Manage products
            </Link>
          )}
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900">Orders</h2>
        {orders.length === 0 ? (
          <div className="card mt-4 p-6 text-center">
            <p className="text-sm text-zinc-600">No orders yet.</p>
            <Link href="/products" className="btn-secondary mt-4 inline-flex hover:border-zinc-300">
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="card flex flex-col gap-3 p-5 transition-all hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-zinc-900">#{order.id}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                          ORDER_STATUS_BADGE[order.status] ?? "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {" · "}
                      {order.items.reduce((sum, i) => sum + i.qty, 0)} item(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-zinc-900">{formatPrice(order.total)}</p>
                    <p className="mt-0.5 text-xs text-indigo-700">View receipt →</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}