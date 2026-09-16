"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CATEGORIES } from "@/lib/products";

export default function Header({ userName }: { userName?: string | null }) {
  const { count, loaded } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [shopOpen, setShopOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close the dropdown on outside click and on Escape.
  useEffect(() => {
    if (!shopOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) setShopOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setShopOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [shopOpen]);

  const shopActive = pathname.startsWith("/products");

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Lumina — home"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-700 text-[15px] text-white transition-colors hover:bg-indigo-800">
            ✦
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-900">Lumina</span>
        </Link>

        {/* Nav */}
        <nav aria-label="Main">
          <ul className="flex items-center gap-1 text-sm font-medium">
            <li>
              <Link
                href="/"
                className={`rounded-lg px-3.5 py-1.5 transition-colors ${
                  pathname === "/"
                    ? "text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                Home
              </Link>
            </li>

            {/* Shop dropdown */}
            <li ref={dropdownRef} className="relative list-none">
              <button
                type="button"
                onClick={() => setShopOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={shopOpen}
                className={`flex items-center gap-1 rounded-lg px-3.5 py-1.5 transition-colors ${
                  shopActive
                    ? "text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                Shop
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-3.5 w-3.5 transition-transform ${shopOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {shopOpen && (
                <div
                  role="menu"
                  className="animate-dropdown-in absolute left-0 top-full mt-2 w-56 rounded-xl bg-white p-2 shadow-xl shadow-zinc-900/8 outline-1 outline-hairline"
                >
                  <Link
                    href="/products"
                    role="menuitem"
                    onClick={() => setShopOpen(false)}
                    style={{ ["--i" as string]: 0 }}
                    className="animate-dropdown-item-in block rounded-lg px-3.5 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
                  >
                    All products
                  </Link>
                  <div className="my-1 h-px bg-hairline" />
                  {CATEGORIES.map((category, i) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      role="menuitem"
                      onClick={() => setShopOpen(false)}
                      style={{ ["--i" as string]: i + 1 }}
                      className="animate-dropdown-item-in block rounded-lg px-3.5 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Auth + Cart */}
        <div className="flex items-center gap-2">
          {userName ? (
            <div className="flex items-center gap-1">
              <Link
                href="/account"
                className="flex h-10 items-center gap-2 rounded-lg border border-hairline bg-white px-3.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
                aria-label="Your account and orders"
              >
                <span
                  className="grid h-5 w-5 place-items-center rounded-full bg-indigo-700 text-[11px] font-semibold text-white"
                  aria-hidden="true"
                >
                  {(userName.trim()[0] ?? "U").toUpperCase()}
                </span>
                <span className="hidden sm:block">Account</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.refresh();
                }}
                className="h-10 rounded-lg px-2 text-sm text-zinc-400 transition-colors hover:text-zinc-700"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="h-10 rounded-lg px-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Sign in
            </Link>
          )}

          <Link
            href="/cart"
            className="relative flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-hairline bg-white px-3.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <path d="M6 7h12l1.2 12.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7Z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
            </svg>
            <span className="hidden sm:block">Cart</span>
            {loaded && count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-indigo-700 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white ring-2 ring-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}