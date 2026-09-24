import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import type { ResolvedSiteSettings } from "@/lib/data/site";

/*
  JSON-LD builders. Only fields that are genuinely available from site settings
  and the database are emitted — no invented dates, ISBNs, publishers, or ratings.
*/

export function websiteJsonLd(s: ResolvedSiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: s.siteName,
    url: siteConfig.url,
    description: s.siteDescription,
    inLanguage: "en",
  };
}

export function personJsonLd(s: ResolvedSiteSettings) {
  const sameAs = s.instagramUrl ? [s.instagramUrl] : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: s.authorName,
    url: absoluteUrl("/about"),
    ...(sameAs ? { sameAs } : {}),
  };
}

export function bookJsonLd(opts: {
  title: string;
  subtitle: string | null;
  coverUrl: string | null;
  slug: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: opts.title,
    ...(opts.subtitle ? { description: opts.subtitle } : {}),
    ...(opts.coverUrl ? { image: absoluteUrl(opts.coverUrl) } : {}),
    url: absoluteUrl(`/books/${opts.slug}`),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: opts.authorName,
      url: absoluteUrl("/about"),
    },
  };
}

export function articleJsonLd(opts: {
  headline: string;
  slug: string;
  pathSegment: string;
  bookTitle: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    url: absoluteUrl(`/books/${opts.slug}/${opts.pathSegment}`),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: opts.authorName,
      url: absoluteUrl("/about"),
    },
    isPartOf: {
      "@type": "Book",
      name: opts.bookTitle,
      url: absoluteUrl(`/books/${opts.slug}`),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
