import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/data/site";
import { PUBLIC_NAV } from "@/lib/nav";

export async function SiteFooter() {
  const { siteName, authorName, instagramUrl } = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line">
      <Container className="flex flex-col gap-10 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-sans text-base font-semibold tracking-[0.08em] text-ink">
            {siteName}
          </p>
          <p className="mt-1.5 font-sans text-xs tracking-[0.22em] text-ink-soft">
            {authorName}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
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
        </nav>
      </Container>

      <Container className="border-t border-line py-6">
        <p className="font-sans text-xs text-ink-soft">
          © {year} {authorName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
