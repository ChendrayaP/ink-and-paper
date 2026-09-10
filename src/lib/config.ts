import { env } from "./env";

/*
  Brand-level constants. Content that changes over time (the Instagram URL,
  the author bio, etc.) lives in the `site_settings` table from Phase 2 —
  it is not hard-coded here.
*/
export const siteConfig = {
  brand: "INK & PAPER",
  author: "P Chendraya Perumal",
  description:
    "Stories about people, memory, love, loss, and hope — free to read online.",
  url: env.NEXT_PUBLIC_SITE_URL,
} as const;

export type SiteConfig = typeof siteConfig;
