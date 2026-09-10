"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/lib/nav";

/** Accessible mobile menu: opens a full-panel overlay, traps focus lightly,
    closes on Escape, on navigation, and on backdrop click. */
export function MobileNav({
  items,
  instagramUrl,
  startReadingHref,
}: {
  items: readonly NavItem[];
  instagramUrl: string | null;
  startReadingHref: string;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="rounded-[2px] px-2 py-1 font-sans text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Menu
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div
            className="absolute inset-0 bg-ink/20"
            onClick={close}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            ref={panelRef}
            tabIndex={-1}
            className="absolute inset-x-0 top-0 max-h-full overflow-y-auto bg-paper px-6 pb-10 pt-5 shadow-sm outline-none"
          >
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={close}
                className="rounded-[2px] px-2 py-1 font-sans text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Close
              </button>
            </div>
            <nav aria-label="Primary" className="mt-6">
              <ul className="flex flex-col gap-5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="font-serif text-2xl text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {instagramUrl ? (
                  <li>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      className="font-serif text-2xl text-ink"
                    >
                      Instagram
                    </a>
                  </li>
                ) : null}
              </ul>
            </nav>
            <div className="mt-10 border-t border-line pt-8">
              <Link
                href={startReadingHref}
                onClick={close}
                className="inline-flex items-center justify-center rounded-[2px] bg-ink px-6 py-3 font-sans text-sm font-medium text-paper"
              >
                Start Reading
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
