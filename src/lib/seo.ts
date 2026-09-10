import type { Metadata } from "next";
import { getSiteSettings, type ResolvedSiteSettings } from "@/lib/data/site";

/** Builds per-page metadata from site settings + a canonical path. */
export async function pageMetadata(opts: {
  absoluteTitle: (s: ResolvedSiteSettings) => string;
  path: string;
  description?: string;
}): Promise<Metadata> {
  const s = await getSiteSettings();
  const title = opts.absoluteTitle(s);
  const description = opts.description ?? s.siteDescription;
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
    },
  };
}
