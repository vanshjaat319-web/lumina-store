import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Shipping & Returns — Lumina",
  description:
    "Standard US shipping, delivery timeframes, and our 30-day hassle-free return policy.",
};

const SHIP_TIERS = [
  { label: "Standard (3–6 business days)", under: "$51+", price: "Free", time: "3–6 business days" },
  { label: "Standard (3–6 business days)", under: "$50 and under", price: "$5.99", time: "3–6 business days" },
  { label: "Express (2–3 business days)", under: "Any order", price: "$12.99", time: "2–3 business days" },
];

export default function ShippingReturnsPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Shipping & Returns"
      intro="How we get your order to you, what shipping costs, and how the 30-day return window works."
      sections={[
        {
          id: "shipping-options",
          title: "Shipping options",
          body: (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <th className="py-2 pr-4 font-semibold">Method</th>
                    <th className="py-2 pr-4 font-semibold">Order total</th>
                    <th className="py-2 pr-4 font-semibold">Price</th>
                    <th className="py-2 font-semibold">Est. delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {SHIP_TIERS.map((tier) => (
                    <tr key={tier.under + tier.price} className="border-b border-hairline last:border-0">
                      <td className="py-3 pr-4 font-medium text-zinc-800">{tier.label}</td>
                      <td className="py-3 pr-4 text-zinc-600">{tier.under}</td>
                      <td className="py-3 pr-4 font-medium text-zinc-800">{tier.price}</td>
                      <td className="py-3 text-zinc-600">{tier.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          id: "shipping-window",
          title: "Processing time",
          body: (
            <p>
              Orders placed before 2pm ET on a business day ship the same day; everything else
              ships the next business day. You&apos;ll receive a confirmation email with a tracking
              link as soon as your package leaves our warehouse.
            </p>
          ),
        },
        {
          id: "returns",
          title: "30-day returns",
          body: (
            <ul className="list-none space-y-2">
              <li>
                <span className="font-medium text-zinc-800">Window.</span> Start a return within 30
                days of delivery for a full refund to your original payment method.
              </li>
              <li>
                <span className="font-medium text-zinc-800">Condition.</span> Items should be unused
                and in their original packaging. A quick photo via the returns portal is all we need.
              </li>
              <li>
                <span className="font-medium text-zinc-800">Label.</span> We email a prepaid,
                tracked return label — no cost to you. Drop it at any USPS location.
              </li>
              <li>
                <span className="font-medium text-zinc-800">Refund timing.</span> Refunds process
                within 1–2 business days of the package arriving at our warehouse. Your card issuer
                may take a few more days to post it.
              </li>
            </ul>
          ),
        },
        {
          id: "warranty",
          title: "Warranty",
          body: (
            <p>
              Every product comes with a standard 2-year warranty covering parts and labour. If
              something fails on its own, we&apos;ll repair or replace it — shipping covered both
              ways.
            </p>
          ),
        },
      ]}
    />
  );
}