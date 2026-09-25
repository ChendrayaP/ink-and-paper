import { NextResponse } from "next/server";
import { classifyPath } from "@/lib/analytics/paths";
import { checkTrackRateLimit } from "@/lib/analytics/rate-limit";
import { devFixturesEnabled } from "@/lib/data/fixtures";
import { isSupabaseConfigured } from "@/lib/env";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 2 * 1024; // a path is tiny; reject anything larger

// Common crawler/bot markers. The User-Agent is used ONLY here, transiently,
// to skip obvious bots — it is never stored.
const BOT_UA =
  /(bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|discord|preview|monitor|lighthouse|headless|axios|curl|wget|python-requests|node-fetch|go-http)/i;

/** Always answer 204 so the fire-and-forget beacon never surfaces an error to
    the page. Recording is best-effort. */
function noContent() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: Request) {
  try {
    // Skip obvious bots (UA read transiently; not stored).
    const ua = req.headers.get("user-agent") ?? "";
    if (BOT_UA.test(ua)) return noContent();

    // Rate limit (IP read transiently; not stored).
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkTrackRateLimit(ip)) return noContent();

    // Size guard, then parse.
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) return noContent();

    let rawPath = "";
    try {
      const body = await req.json();
      rawPath = typeof body?.path === "string" ? body.path : "";
    } catch {
      return noContent();
    }

    const classified = classifyPath(rawPath);
    if (!classified) return noContent(); // ignores /studio, /auth, /api, assets, junk

    // Development preview / unconfigured: never persist.
    if (devFixturesEnabled() || !isSupabaseConfigured()) return noContent();

    // Insert via the server-only admin client (RLS-bypass). Imported lazily so
    // the "server-only" module is never pulled toward the client graph.
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    await supabase.from("page_views").insert({
      path: classified.path,
      kind: classified.kind,
      book_slug: classified.bookSlug,
      section_path_segment: classified.sectionPathSegment,
    });

    return noContent();
  } catch {
    // Analytics must never affect the visitor; swallow all errors.
    return noContent();
  }
}
