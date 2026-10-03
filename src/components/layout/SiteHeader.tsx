import { MobileNav } from "@/components/layout/MobileNav";
import { Wordmark } from "@/components/layout/Wordmark";
import { getSiteSettings } from "@/lib/data/site";
import { PUBLIC_NAV, START_READING_HREF } from "@/lib/nav";

export async function SiteHeader() {
  const { siteName, authorName, instagramUrl } = await getSiteSettings();

  return (
    <header className="border-b border-line">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-7 sm:px-6 sm:py-8">
        {/* Brand */}
        <div className="shrink-0">
          <Wordmark siteName={siteName} authorName={authorName} />
        </div>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center justify-center gap-8 md:flex"
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
    </header>
  );
}
