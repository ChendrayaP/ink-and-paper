import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { getSiteSettings } from "@/lib/data/site";
import { PUBLIC_NAV, START_READING_HREF } from "@/lib/nav";

const navLinkClass =
  "relative whitespace-nowrap rounded-[2px] font-sans text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-ink after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent focus-visible:after:scale-x-100";

export async function SiteHeader() {
  const { instagramUrl } = await getSiteSettings();

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-4 py-3 sm:px-6">
        {/* Brand — complete logo, top-left */}
        <div className="flex shrink-0 flex-col items-center">
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
          <p className="mt-1 whitespace-nowrap text-center font-sans text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ink sm:mt-1.5 sm:text-[0.66rem] lg:mt-2 lg:text-[0.72rem]">
            P Chendraya Perumal
          </p>
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
                  className={navLinkClass}
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className={navLinkClass}
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
                className={navLinkClass}
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
