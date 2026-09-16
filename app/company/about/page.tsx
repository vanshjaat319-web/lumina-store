import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "About us — Lumina",
  description: "The story, mission, and values behind Lumina.",
};

const VALUES = [
  {
    title: "Design with restraint",
    body: "Fewer, better things. If a product doesn't earn its place on a desk or shelf, we don't make it.",
  },
  {
    title: "Price honestly",
    body: "Flat, transparent pricing. No fake discounts, no bait-and-switch bundles.",
  },
  {
    title: "Built to be fixed",
    body: "Repairable parts, a 2-year warranty, and manuals that tell you how. We'd rather repair than replace.",
  },
  {
    title: "Ship responsibly",
    body: "Plastic-free packaging where possible and carbon-neutral delivery on every order.",
  },
];

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="Company"
      title="About Lumina"
      intro="Lumina is a small, design-led studio making everyday essentials for home, desk, and on the go — a deliberately small catalog of things we actually use."
      sections={[
        {
          id: "story",
          title: "Our story",
          body: (
            <p>
              Lumina started in 2019 in a Portland living room, frustrated by how quickly &ldquo;nice&rdquo;
              consumer products wore out or fell apart. We set out to make a tighter catalog —
              a dozen or so pieces, each designed for its place, built to be repaired, and priced
              without games. Every product you see on this store is one we&apos;ve lived with ourselves.
            </p>
          ),
        },
        {
          id: "mission",
          title: "What we're working toward",
          body: (
            <p>
              Buy fewer things, buy better things. We measure success in five- and ten-year
              horizons: how long our products last, how many are repaired instead of replaced, and
              whether the people who make them are fairly paid and safely supported.
            </p>
          ),
        },
        {
          id: "values",
          title: "How we work",
          body: (
            <ul className="grid gap-4 sm:grid-cols-2">
              {VALUES.map((value) => (
                <li key={value.title} className="rounded-xl bg-zinc-50 p-4 ring-1 ring-hairline">
                  <p className="text-sm font-semibold text-zinc-900">{value.title}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">{value.body}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "numbers",
          title: "Lumina in numbers",
          body: (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { k: "2019", v: "Founded" },
                { k: "12", v: "Products in catalog" },
                { k: "5,200+", v: "Customer reviews" },
                { k: "4.6/5", v: "Average rating" },
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