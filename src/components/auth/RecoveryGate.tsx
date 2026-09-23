"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/*
  Supabase password-reset links land on the site root with the recovery token in
  the URL hash (e.g. /#access_token=...&type=recovery). The public landing page
  never instantiates the Supabase client, so nothing would process it. This gate
  runs on the client, detects the PASSWORD_RECOVERY session, strips the token
  from the URL, and forwards to the dedicated reset page. It renders nothing
  unless a recovery hash is present.
*/
export function RecoveryGate() {
  const router = useRouter();
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!/[#&]type=recovery/i.test(window.location.hash)) return;

    setRecovering(true);
    const supabase = createClient();
    let done = false;

    const go = () => {
      if (done) return;
      done = true;
      // Remove the token-bearing hash from the address bar before navigating,
      // so the access token is never left visible in the URL.
      try {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      } catch {
        /* ignore */
      }
      router.replace("/auth/update-password");
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "PASSWORD_RECOVERY" ||
        (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION"))
      ) {
        go();
      }
    });

    // Kick client initialization so the hash is parsed even if no event fires.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) go();
    });

    // Fallback: forward to the reset page regardless; it shows an "expired link"
    // state if the session could not be established.
    const timer = setTimeout(go, 4000);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [router]);

  if (!recovering) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper">
      <p className="font-serif text-lg italic text-ink-soft">
        Preparing your password reset…
      </p>
    </div>
  );
}
