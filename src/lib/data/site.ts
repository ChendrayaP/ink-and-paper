import { siteConfig } from "@/lib/config";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import { devFixturesEnabled, devSettings } from "@/lib/data/fixtures";

export type ResolvedSiteSettings = {
  siteName: string;
  authorName: string;
  siteDescription: string;
  instagramUrl: string | null;
};

const fallback: ResolvedSiteSettings = {
  siteName: siteConfig.brand,
  authorName: siteConfig.author,
  siteDescription: siteConfig.description,
  instagramUrl: null,
};

/** Public site settings, always resolved to a usable object (falls back to
    brand constants if the database is unavailable). */
export async function getSiteSettings(): Promise<ResolvedSiteSettings> {
  if (devFixturesEnabled()) return devSettings;
  if (!isSupabaseConfigured()) return fallback;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("site_name, author_name, site_description, instagram_url")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return fallback;
    return {
      siteName: data.site_name,
      authorName: data.author_name,
      siteDescription: data.site_description,
      instagramUrl: data.instagram_url,
    };
  } catch (err) {
    console.error("getSiteSettings failed:", err);
    return fallback;
  }
}
