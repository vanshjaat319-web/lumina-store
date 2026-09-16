"use client";

import { useState } from "react";

const TOPICS = [
  "Order status or tracking",
  "Returns & refunds",
  "Warranty claim",
  "Product question",
  "Something else",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Name
            </span>
            <input
              required
              type="text"
              placeholder="Ada Lovelace"
              className="h-11 w-full rounded-lg border border-hairline bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Email
            </span>
            <input
              required
              type="email"
              placeholder="you@example.com"
              className="h-11 w-full rounded-lg border border-hairline bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Topic
          </span>
          <select
            className="h-11 w-full rounded-lg border border-hairline bg-white px-3.5 text-sm text-zinc-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
            defaultValue={TOPICS[0]}
          >
            {TOPICS.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Message
          </span>
          <textarea
            required
            rows={4}
            placeholder="How can we help?"
            className="w-full resize-y rounded-lg border border-hairline bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
          />
        </label>
        <button type="submit" className="btn-primary self-start hover:bg-zinc-700 active:scale-[0.99]">
          Send message
        </button>
      </form>

      {sent && (
        <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800 ring-1 ring-emerald-200">
          <span className="font-semibold">Message sent ✓</span> — a real human replies within one
          business day. (Demo form: nothing is transmitted.)
        </div>
      )}
    </div>
  );
}