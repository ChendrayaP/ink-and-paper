"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const MIN_LENGTH = 8;
type Status = "checking" | "ready" | "success" | "invalid";

const inputCls =
  "mt-2 block w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2.5 font-sans text-base text-ink outline-none focus:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const primaryBtn =
  "mt-8 inline-flex w-full items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60";

export function UpdatePasswordForm() {
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // "request another link" (shown only when the link is invalid/expired)
  const [resendEmail, setResendEmail] = useState("");
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resendBusy, setResendBusy] = useState(false);

  // Establish a valid recovery session from Supabase's PKCE code.
  useEffect(() => {
    const supabase = createClient();
    let settled = false;

    const finish = (s: Status) => {
      if (!settled) {
        settled = true;
        setStatus(s);
      }
    };

    const establishRecoverySession = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          finish("invalid");
          return;
        }

        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.hash,
        );

        finish("ready");
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        finish("ready");
      } else {
        finish("invalid");
      }
    };

    establishRecoverySession();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) finish("ready");
      },
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!password || !confirm) {
      setError("Please fill in both password fields.");
      return;
    }
    if (password.length < MIN_LENGTH) {
      setError(`Use at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don’t match.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: upErr } = await supabase.auth.updateUser({ password });
      if (upErr) {
        // Most often the recovery session has expired.
        setStatus("invalid");
        return;
      }
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  async function onResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResendMsg(null);
    if (!resendEmail.trim()) {
      setResendMsg("Please enter your email.");
      return;
    }
    setResendBusy(true);
    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(resendEmail.trim(), {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
    } catch {
      /* fall through to the same neutral message */
    } finally {
      // Never reveal whether an account exists for the address.
      setResendMsg(
        "If an account exists for that email, a new reset link is on its way.",
      );
      setResendBusy(false);
    }
  }

  if (status === "checking") {
    return (
      <p className="mt-6 font-serif text-lg italic text-ink-soft">
        Verifying your reset link…
      </p>
    );
  }

  if (status === "success") {
    return (
      <div className="mt-6">
        <h1 className="font-serif text-3xl leading-tight text-ink">
          Password updated
        </h1>
        <p className="mt-3 font-sans text-sm text-ink-soft">
          Your password has been changed. You can now go to the Studio.
        </p>
        <Link href="/studio" className={primaryBtn}>
          Go to the Studio
        </Link>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="mt-6">
        <h1 className="font-serif text-3xl leading-tight text-ink">
          This reset link has expired
        </h1>
        <p className="mt-3 font-sans text-sm text-ink-soft">
          The link is invalid or has already been used. Request a new one below.
        </p>
        <form onSubmit={onResend} noValidate className="mt-8">
          <label htmlFor="resend-email" className="block font-sans text-sm text-ink">
            Email
          </label>
          <input
            id="resend-email"
            name="email"
            type="email"
            autoComplete="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            className={inputCls}
          />
          <button type="submit" disabled={resendBusy} className={primaryBtn}>
            {resendBusy ? "Sending…" : "Send a new reset link"}
          </button>
          {resendMsg ? (
            <p role="status" className="mt-4 font-sans text-sm text-ink-soft">
              {resendMsg}
            </p>
          ) : null}
        </form>
        <div className="mt-8">
          <Link
            href="/auth"
            className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  // status === "ready"
  return (
    <div className="mt-6">
      <h1 className="font-serif text-3xl leading-tight text-ink">
        Choose a new password
      </h1>
      <p className="mt-3 font-sans text-sm text-ink-soft">
        Set a new password for your author account.
      </p>
      <form onSubmit={onSubmit} noValidate className="mt-8">
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
            <label htmlFor="new-password" className="block font-sans text-sm text-ink">
              New password
            </label>
            <input
              id="new-password"
              name="new-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1.5 font-sans text-xs text-ink-soft">
              At least {MIN_LENGTH} characters.
            </p>
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block font-sans text-sm text-ink"
            >
              Confirm new password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
