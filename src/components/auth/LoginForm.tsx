"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/*
  Author sign-in. Uses the @supabase/ssr browser client, which stores the
  session in cookies (not localStorage), so the server can read it. On success
  we navigate to the Studio and refresh so server components see the session.
*/
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
const [resetBusy, setResetBusy] = useState(false);
const [resetMessage, setResetMessage] = useState<string | null>(null);

async function onForgotPassword() {
  setError(null);
  setResetMessage(null);

  if (!email.trim()) {
    setError("Please enter your email address first.");
    return;
  }

  setResetBusy(true);

  try {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/`,
      },
    );

    if (error) {
      setError("We couldn't send the reset email. Please try again.");
      return;
    }

    setResetMessage(
      "If an account exists for this email, a password reset link has been sent.",
    );
  } catch {
    setError("We couldn't send the reset email. Please try again.");
  } finally {
    setResetBusy(false);
  }
}

async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError("We couldn’t sign you in. Please check your email and password.");
        return;
      }
      router.replace("/studio");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-10">
      {error ? (
        <p
          role="alert"
          className="mb-6 border-l-2 border-accent pl-4 font-sans text-sm text-ink"
        >
          {error}
        </p>
      ) : null}

      <div className="space-y-5">
        <div>
          <label htmlFor="email" className="block font-sans text-sm text-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-sans text-base text-ink outline-none focus:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-sans text-sm text-ink">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-sans text-base text-ink outline-none focus:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>
<div className="flex justify-end">
  <button
    type="button"
    onClick={onForgotPassword}
    disabled={resetBusy}
    className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
  >
    {resetBusy ? "Sending…" : "Forgot your password?"}
  </button>
</div>

{resetMessage ? (
  <p className="border-l-2 border-accent pl-4 font-sans text-sm text-ink">
    {resetMessage}
  </p>
) : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-8 inline-flex w-full items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
