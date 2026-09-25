import Link from "next/link";
import { SignOutButton } from "@/components/studio/SignOutButton";

const NAV = [
  { label: "Dashboard", href: "/studio" },
  { label: "Books", href: "/studio/books" },
  { label: "Testimonials", href: "/studio/testimonials" },
  { label: "Analytics", href: "/studio/analytics" },
  { label: "Settings", href: "/studio/settings" },
];

export function StudioChrome({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line bg-paper-raised">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="flex items-center justify-between gap-4 py-4">
            <Link href="/studio" className="flex items-baseline gap-2">
              <span className="font-sans text-sm font-semibold tracking-[0.08em] text-ink">
                INK &amp; PAPER
              </span>
              <span className="font-sans text-sm text-ink-soft">· Studio</span>
            </Link>
            <div className="flex items-center gap-4">
              {email ? (
                <span className="hidden font-sans text-sm text-ink-soft md:inline">
                  {email}
                </span>
              ) : null}
              <Link
                href="/"
                className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink"
              >
                View site
              </Link>
              <SignOutButton />
            </div>
          </div>
          <nav
            aria-label="Studio"
            className="flex gap-6 overflow-x-auto border-t border-line py-3"
          >
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="whitespace-nowrap font-sans text-sm text-ink-soft transition-colors hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}
