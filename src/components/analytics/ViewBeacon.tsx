"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/*
  Fire-and-forget page-view beacon for public pages. Sends only the current
  pathname to /api/track (no PII, no cookies). It renders nothing and never
  blocks or affects rendering: failures are swallowed. Because it only runs an
  effect after hydration, it does NOT make public pages dynamic — they stay
  static/ISR and fully indexable.

  Deduplication: a ref tracks the last path actually sent, so React StrictMode's
  double-mount in development does not produce two events for one view, and a
  re-render for the same path does not re-send.
*/
export function ViewBeacon() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    const body = JSON.stringify({ path: pathname });
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.sendBeacon === "function"
      ) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/track", blob);
      } else {
        void fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* never let analytics affect the page */
    }
  }, [pathname]);

  return null;
}
