"use client";

import { useState, type FormEvent } from "react";

/** Footer newsletter signup with an inline confirmation state. */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/.+@.+\..+/.test(email)) {
      setStatus("error");
      return;
    }
    // No backend — just acknowledge.
    setStatus("done");
    setEmail("");
  }

  if (status === "done") {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-emerald-600">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
        You&apos;re subscribed — welcome aboard.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex h-10 overflow-hidden rounded-lg border border-hairline bg-white focus-within:border-zinc-300">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@example.com"
          className="min-w-0 flex-1 bg-transparent px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          aria-invalid={status === "error"}
        />
        <button
          type="submit"
          className="shrink-0 bg-[#161618] px-4 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          Subscribe
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs text-rose-600">Please enter a valid email address.</p>
      )}
    </form>
  );
}