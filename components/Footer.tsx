import Link from "next/link";
import { CATEGORIES, FREE_SHIPPING_THRESHOLD } from "@/lib/products";
import NewsletterForm from "@/components/NewsletterForm";

const SHOP_LINKS = [
  ...CATEGORIES.map((category) => ({
    href: `/products?category=${category.slug}`,
    label: category.label,
  })),
  { href: "/products", label: "All products" },
];

const HELP_LINKS = [
  { href: "/help/shipping-returns", label: "Shipping & returns" },
  { href: "/help/faqs", label: "FAQs" },
  { href: "/help/track-order", label: "Track your order" },
  { href: "/help/contact", label: "Contact support" },
];

const COMPANY_LINKS = [
  { href: "/company/about", label: "About us" },
  { href: "/company/careers", label: "Careers" },
  { href: "/company/sustainability", label: "Sustainability" },
  { href: "/company/press", label: "Press" },
];

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PAYMENT_METHODS = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-white">
      {/* Main columns */}
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Brand + newsletter */}
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Lumina — home">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-700 text-[15px] text-white">
              ✦
            </span>
            <span className="text-lg font-semibold tracking-tight text-zinc-900">Lumina</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            Everyday essentials for home, desk, and beyond — designed to last and priced
            honestly.
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Get 10% off your first order
          </p>
          <div className="mt-3">
            <NewsletterForm />
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            New drops, restock alerts, and private offers. Unsubscribe anytime.
          </p>
        </div>

        <FooterCol title="Shop" links={SHOP_LINKS} />
        <FooterCol title="Help" links={HELP_LINKS} />
        <FooterCol title="Company" links={COMPANY_LINKS} />
      </div>

      {/* Payments + legal */}
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row">
          <p className="text-xs text-zinc-400">
            We accept{" "}
            {PAYMENT_METHODS.map((method, i) => (
              <span key={method}>
                <span className="font-medium text-zinc-500">{method}</span>
                {i < PAYMENT_METHODS.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
          <p className="text-xs text-zinc-400">
            Free shipping in the US over ${FREE_SHIPPING_THRESHOLD}.
          </p>
        </div>
        <div className="border-t border-hairline">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-400 sm:px-6">
            <p>© {new Date().getFullYear()} Lumina Inc. All rights reserved.</p>
            <div className="flex items-center gap-5">
              {["Privacy", "Terms", "Cookies"].map((label) => (
                <Link key={label} href="/" className="transition-colors hover:text-zinc-800">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}