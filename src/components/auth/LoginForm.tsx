"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [resetting, setResetting] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

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

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        setError(
          "We couldn't sign you in. Please check your email and password.",
        );
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

  async function onSendReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResetMessage(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
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

  function openResetMode() {
    setError(null);
    setResetMessage(null);
    setResetting(true);
  }

  function backToSignIn() {
    setError(null);
    setResetMessage(null);
    setResetting(false);
  }

  if (resetting) {
    return (
      <form
        onSubmit={onSendReset}
        noValidate
        className="mt-10"
      >
        <div className="space-y-5">
          <div>
            <p className="font-sans text-xs tracking-[0.28em] text-ink-soft">
              ACCOUNT RECOVERY
            </p>

            <h2 className="mt-3 font-serif text-2xl leading-tight text-ink">
              Reset your password
            </h2>

            <p className="mt-3 font-sans text-sm leading-6 text-ink-soft">
              Enter your email address and we'll send you a secure password
              reset link.
            </p>
          </div>

          {error ? (
            <p
              role="alert"
              className="border-l-2 border-accent pl-4 font-sans text-sm text-ink"
            >
              {error}
            </p>
          ) : null}

          {resetMessage ? (
            <p
              role="status"
              className="border-l-2 border-accent pl-4 font-sans text-sm leading-6 text-ink"
            >
              {resetMessage}
            </p>
          ) : null}

          <div>
            <label
              htmlFor="reset-email"
              className="block font-sans text-sm text-ink"
            >
              Email
            </label>

            <input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-sans text-base text-ink outline-none focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </div>

          <button
            type="submit"
            disabled={resetBusy}
            className="inline-flex w-full items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          >
            {resetBusy ? "Sending…" : "Send reset link"}
          </button>

          <button
            type="button"
            onClick={backToSignIn}
            className="w-full font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            ← Back to sign in
          </button>
        </div>
      </form>
    );
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
          <label
            htmlFor="email"
            className="block font-sans text-sm text-ink"
          >
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
            className="mt-2 block w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-sans text-base text-ink outline-none focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block font-sans text-sm text-ink"
          >
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
            className="mt-2 block w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-sans text-base text-ink outline-none focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={openResetMode}
            className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Forgot your password?
          </button>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </form>
  );
}