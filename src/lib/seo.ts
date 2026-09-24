import type { Metadata } from "next";
import { getSiteSettings, type ResolvedSiteSettings } from "@/lib/data/site";
import { siteConfig } from "@/lib/config";

/** Default branded social image (static asset in /public). Resolved to an
    absolute URL by Next via metadataBase. */
export const OG_IMAGE_DEFAULT = "/og-default.png";
export const OG_IMAGE_DIMENSIONS = { width: 1200, height: 630 };

/** Absolute URL from a path (or a pass-through for already-absolute URLs). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Builds per-page metadata (title, description, canonical, Open Graph, Twitter)
    from site settings + a canonical path, with the shared default OG image. */
export async function pageMetadata(opts: {
  absoluteTitle: (s: ResolvedSiteSettings) => string;
  path: string;
  description?: string;
}): Promise<Metadata> {
  const s = await getSiteSettings();
  const title = opts.absoluteTitle(s);
  const description = opts.description ?? s.siteDescription;
  const images = [
    { url: OG_IMAGE_DEFAULT, ...OG_IMAGE_DIMENSIONS, alt: s.siteName },
  ];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: opts.path },
    openGraph: {
      type: "website",
      siteName: s.siteName,
      title,
      description,
      url: opts.path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_DEFAULT],
    },
  };
}
