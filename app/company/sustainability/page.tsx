import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Sustainability — Lumina",
  description: "Materials, packaging, and carbon commitments behind every Lumina product.",
};

const COMMITMENTS = [
  {
    title: "Materials that last",
    body: "Aluminium, bamboo, stoneware, and canvas — materials chosen for longevity and repairability over novelty.",
  },
  {
    title: "Plastic-free packaging",
    body: "95% of our packaging is now paper-based and curbside recyclable. The remaining 5% is shipping tape we're phasing out.",
  },
  {
    title: "Carbon-neutral delivery",
    body: "Every order ships carbon-neutral via offsets for last-mile transport, with our in-town delivery already on electric bikes.",
  },
  {
    title: "Repair over replace",
    body: "The 2-year warranty is backed by a real repair program — spare parts, teardown guides, and reconditioned units sold at a discount.",
  },
];

export default function SustainabilityPage() {
  return (
    <InfoPage
      eyebrow="Company"
      title="Sustainability"
      intro="Buy fewer things, buy better things. Here's what we're actually doing — and where we're not there yet."
      sections={[
        {
          id: "commitments",
          title: "Our commitments",
          body: (
            <ul className="grid gap-4 sm:grid-cols-2">
              {COMMITMENTS.map((item) => (
                <li key={item.title} className="rounded-xl bg-zinc-50 p-4 ring-1 ring-hairline">
                  <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">{item.body}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "honest",
          title: "The honest part",
          body: (
            <p>
              We&apos;re early. Offsetting logistics isn&apos;t the same as eliminating emissions, and some
              of our electronics still contain conflict minerals we&apos;re working to trace to source.
              We publish a yearly impact note and treat targets as commitments, not marketing.
            </p>
          ),
        },
        {
          id: "report",
          title: "2025 impact at a glance",
          body: (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { k: "95%", v: "Paper-based packaging" },
                { k: "61%", v: "Catalogs shipped carbon-neutral" },
                { k: "1.4k", v: "Units repaired vs. replaced" },
                { k: "0", v: "Plastic in retail packaging" },
              ].map((stat) => (
                <li key={stat.v} className="text-center">
                  <p className="text-2xl font-semibold tracking-tight text-accent">{stat.k}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">{stat.v}</p>
                </li>
              ))}
            </ul>
          ),
        },
      ]}
    />
  );
}