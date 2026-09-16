import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Careers — Lumina",
  description: "Open roles, what it's like to work at Lumina, and how to apply.",
};

const ROLES = [
  {
    title: "Senior Product Designer",
    team: "Product",
    location: "Portland, OR · Hybrid",
    type: "Full-time",
  },
  {
    title: "Full-stack Engineer",
    team: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Supply Chain & Operations Lead",
    team: "Operations",
    location: "Portland, OR · Hybrid",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <InfoPage
      eyebrow="Company"
      title="Careers"
      intro="We're a small team that moves deliberately — a dozen people, a dozen products. If you like working on things built to last, you'll fit right in."
      sections={[
        {
          id: "open-roles",
          title: "Open roles",
          body: (
            <div className="flex flex-col gap-3">
              {ROLES.map((role) => (
                <Link
                  key={role.title}
                  href="/help/contact"
                  className="group flex flex-col gap-1 rounded-xl border border-hairline bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 group-hover:text-accent">
                      {role.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {role.team} · {role.location} · {role.type}
                    </p>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent sm:mt-0">
                    Apply <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
              <p className="text-xs text-zinc-400">
                Applications via the contact form — reference the role title in your message.
              </p>
            </div>
          ),
        },
        {
          id: "no-role-your-fit",
          title: "No role your fit?",
          body: (
            <p>
              We like meeting curious people before we have a job for them. Send a short note with
              what you&apos;d want to work on and a couple of examples of your work — we keep
              great candidates in mind when roles open.
            </p>
          ),
        },
        {
          id: "perks",
          title: "What you get",
          body: (
            <ul className="list-none space-y-2">
              <li>• Competitive salary and meaningful equity for every role</li>
              <li>• 5 weeks PTO, fully paid parental leave, and a genuine &ldquo;no email after 6pm&rdquo; norm</li>
              <li>• Anything we make, free — plus an annual $500 &ldquo;buy better&rdquo; stipend</li>
              <li>• Home-office budget and hybrid-first tools for remote teammates</li>
            </ul>
          ),
        },
      ]}
    />
  );
}