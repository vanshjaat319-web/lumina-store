"use client";

import { useState } from "react";

const SAMPLE_NUMBERS = ["LMN-88214", "LMN-11930", "LMN-45071"];

export default function TrackOrderForm() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const tracking = submitted && SAMPLE_NUMBERS.includes(submitted.trim().toUpperCase());

  return (
    <div>
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(value);
        }}
      >
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="e.g. LMN-88214"
          aria-label="Tracking number"
          className="h-11 w-full flex-1 rounded-lg border border-hairline bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
        />
        <button
          type="submit"
          className="btn-primary h-11 shrink-0 hover:bg-zinc-700 active:scale-[0.99]"
        >
          Track order
        </button>
      </form>
      <div className="mt-2 flex flex-wrap gap-2">
        {SAMPLE_NUMBERS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setSubmitted(n)}
            className="rounded-full border border-hairline bg-white px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-800"
          >
            Try {n}
          </button>
        ))}
      </div>

      {tracking ? (
        <div className="mt-6">
          <div className="flex items-center justify-between rounded-t-xl bg-accent-soft px-4 py-3">
            <p className="text-sm font-semibold text-accent">
              Order #{submitted} — in transit
            </p>
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              Est. 3–6 business days
            </span>
          </div>
          <ol className="divide-y divide-hairline rounded-b-xl border border-t-0 border-hairline bg-white px-4">
            {[
              { label: "Order placed", time: "Today · 10:12am" },
              { label: "Preparing for shipment", time: "Today · 4:37pm" },
              { label: "Out for delivery", time: "In 2–5 business days" },
            ].map((step, i) => (
              <li key={step.time} className="flex items-start gap-3 py-3.5">
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                    i === 0
                      ? "bg-accent text-white"
                      : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    {i === 0 ? <path d="M20 6 9 17l-5-5" /> : <path d="M12 4v16" />}
                  </svg>
                </span>
                <div>
                  <p className={`text-sm font-medium ${i === 0 ? "text-zinc-900" : "text-zinc-500"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-zinc-400">{step.time}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-zinc-400">
            Demo tracking — enter any sample number above to preview the status view.
          </p>
        </div>
      ) : submitted ? (
        <p className="mt-4 text-sm text-zinc-500">
          We couldn&apos;t find that number. Try one of the sample numbers above.
        </p>
      ) : null}
    </div>
  );
}