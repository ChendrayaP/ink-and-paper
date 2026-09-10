import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/layout/Wordmark";
import { MobileNav } from "@/components/layout/MobileNav";
import { getSiteSettings } from "@/lib/data/site";
import { PUBLIC_NAV, START_READING_HREF } from "@/lib/nav";

export async function SiteHeader() {
  const { siteName, authorName, instagramUrl } = await getSiteSettings();

  return (
    <header className="border-b border-line">
      <Container className="flex items-center justify-between gap-4 py-5">
        <Wordmark siteName={siteName} authorName={authorName} />

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-ink-soft transition-colors hover:text-ink"
            >
              Instagram
            </a>
          ) : null}
          <Link
            href={START_READING_HREF}
            className="inline-flex items-center justify-center rounded-[2px] bg-ink px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Start Reading
          </Link>
        </nav>

        <MobileNav
          items={PUBLIC_NAV}
          instagramUrl={instagramUrl}
          startReadingHref={START_READING_HREF}
        />
      </Container>
    </header>
  );
}
