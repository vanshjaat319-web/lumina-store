import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Press — Lumina",
  description: "Press kit, recent coverage, and media contacts for Lumina.",
};

const PRESS_ITEMS = [
  {
    outlet: "The Productist",
    headline: "The quiet overhaul of the everyday essentials market",
    date: "August 2026",
  },
  {
    outlet: "Modern Home Journal",
    headline: "Why 5,000 reviewers keep coming back to this 12-product store",
    date: "June 2026",
  },
  {
    outlet: "Weekend Desk",
    headline: "The best desk setups, according to people who type all day",
    date: "March 2026",
  },
];

export default function PressPage() {
  return (
    <InfoPage
      eyebrow="Company"
      title="Press"
      intro="Coverage, a digital press kit, and media contact. For time-sensitive requests, use the address below and we'll reply same-day."
      sections={[
        {
          id: "coverage",
          title: "Recent coverage",
          body: (
            <ul className="flex flex-col gap-3">
              {PRESS_ITEMS.map((item) => (
                <li
                  key={item.headline}
                  className="flex flex-col gap-0.5 rounded-xl border border-hairline bg-white p-4"
                >
                  <p className="text-sm font-semibold text-zinc-900">{item.headline}</p>
                  <p className="text-xs text-zinc-500">
                    {item.outlet} · {item.date}
                  </p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "press-kit",
          title: "Press kit",
          body: (
            <ul className="list-none space-y-2">
              <li>• Brand guidelines (logo, wordmark, color tokens) — PDF, 2.1MB</li>
              <li>• Product photography for the current catalog — ZIP, 48MB</li>
              <li>• Founder interviews and biography — DOCX</li>
              <li>• 2025 impact note (sustainability report) — PDF, 1.4MB</li>
            </ul>
          ),
        },
        {
          id: "media-contact",
          title: "Media contact",
          body: (
            <p>
              Press@lumina.example — managed by the brand team, replies within one business day.
              For urgent stories, mention &ldquo;PRESS-UPDATE&rdquo; in the subject line.
            </p>
          ),
        },
      ]}
    />
  );
}