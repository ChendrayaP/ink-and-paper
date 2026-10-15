import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { getSiteSettings } from "@/lib/data/site";
import { PUBLIC_NAV, START_READING_HREF } from "@/lib/nav";

export async function SiteHeader() {
  const { instagramUrl } = await getSiteSettings();

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-4 py-4 sm:px-6 sm:py-5">
        {/* Brand — complete logo, top-left */}
        <div className="shrink-0">
          <Link
            href="/"
            aria-label="Ink & Paper — Stories for a Brighter You"
            className="inline-block rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/ink-and-paper-glossy-transparent.png"
              alt="Ink & Paper — Stories for a Brighter You"
              width={1774}
              height={887}
              className="h-20 w-auto sm:h-24 lg:h-32"
            />
          </Link>
        </div>

        {/* Right side — desktop navigation + CTA, mobile menu */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Desktop navigation */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 md:flex"
          >
            {PUBLIC_NAV.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap font-sans text-[0.8rem] uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap font-sans text-[0.8rem] uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              ),
            )}

            {instagramUrl ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap font-sans text-[0.78rem] uppercase tracking-[0.12em] text-ink-soft transition-colors hover:text-ink"
              >
                Instagram
              </a>
            ) : null}
          </nav>

          {/* Desktop CTA */}
          <a
            href={START_READING_HREF}
            className="hidden min-w-[118px] items-center justify-center whitespace-nowrap rounded-[2px] bg-ink px-5 py-3 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:inline-flex"
          >
            Start Reading
          </a>

          {/* Mobile */}
          <div className="md:hidden">
            <MobileNav
              items={PUBLIC_NAV}
              instagramUrl={instagramUrl}
              startReadingHref={START_READING_HREF}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
