import Link from "next/link";

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

/**
 * Shared shell for the footer's informational pages (Help + Company).
 * Renders a back link, an eyebrow, a title + intro, then the content
 * sections as stacked hairline cards.
 */
export default function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M19 12H5m7-7-7 7 7 7" />
        </svg>
        Back to home
      </Link>

      <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
        {eyebrow}
      </span>
      <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tighter text-zinc-900 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-xl text-[15px] leading-7 text-zinc-600">{intro}</p>

      <div className="mt-12 flex flex-col gap-5">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="card p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-zinc-600">
              {section.body}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}