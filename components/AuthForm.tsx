"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  mode: "login" | "register";
};

const fieldClasses =
  "h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 border-hairline";

/** Only allow safe internal redirects (e.g. back to /checkout after login). */
function safeRedirect(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/account";
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    const form = new FormData(e.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    const clientErrors: Record<string, string> = {};
    if (!values.email || !/.+@.+\..+/.test(values.email)) clientErrors.email = "Enter a valid email.";
    if (!values.password || values.password.length < 8) clientErrors.password = "Password must be at least 8 characters.";
    if (mode === "register" && !values.name?.trim()) clientErrors.name = "Name is required.";
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          ...(mode === "register" ? { name: values.name } : {}),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setServerError("Something went wrong. Try again.");
      }
    } catch {
      setServerError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
        {mode === "login" ? "Sign in" : "Create an account"}
      </h2>
      <p className="mt-2 text-sm text-zinc-500">
        {mode === "login"
          ? "Welcome back. Sign in to access your orders."
          : "Join Lumina to place orders and track receipts."}
      </p>

      {serverError && (
        <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20">
          {serverError}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {mode === "register" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">Name</span>
            <input name="name" autoComplete="name" placeholder="Your name" className={fieldClasses} />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">Email</span>
          <input
            type="email"
            name="email"
            autoComplete={mode === "login" ? "username" : "email"}
            placeholder="you@example.com"
            className={fieldClasses}
          />
          {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">Password</span>
          <input
            type="password"
            name="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="At least 8 characters"
            className={fieldClasses}
          />
          {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-6 w-full hover:bg-zinc-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}