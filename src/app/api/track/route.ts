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
    // [DIAG 1] request received
    console.log("[track] 1 request received");

    // Skip obvious bots (UA read transiently; not stored).
    const ua = req.headers.get("user-agent") ?? "";
    if (BOT_UA.test(ua)) {
      console.log("[track] skipped: bot user-agent");
      return noContent();
    }

    // Rate limit (IP read transiently; not stored).
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkTrackRateLimit(ip)) {
      console.log("[track] skipped: rate limited");
      return noContent();
    }

    // Size guard, then parse.
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      console.log("[track] skipped: body too large");
      return noContent();
    }

    let rawPath = "";
    try {
      const body = await req.json();
      rawPath = typeof body?.path === "string" ? body.path : "";
    } catch {
      console.log("[track] skipped: unparseable body");
      return noContent();
    }

    const classified = classifyPath(rawPath);
    if (!classified) {
      console.log("[track] skipped: path not trackable");
      return noContent(); // ignores /studio, /auth, /api, assets, junk
    }

    // Development preview / unconfigured: never persist.
    if (devFixturesEnabled() || !isSupabaseConfigured()) {
      console.log("[track] skipped: fixtures/unconfigured");
      return noContent();
    }

    // [DIAG 2] env presence — booleans ONLY, never values.
    console.log("[track] 2 env present:", {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });

    // Insert via the server-only admin client (RLS-bypass). Imported lazily so
    // the "server-only" module is never pulled toward the client graph.
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    // [DIAG 3] immediately before the insert
    console.log("[track] 3 before insert:", {
      path: classified.path,
      kind: classified.kind,
    });

    const { error } = await supabase.from("page_views").insert({
      path: classified.path,
      kind: classified.kind,
      book_slug: classified.bookSlug,
      section_path_segment: classified.sectionPathSegment,
    });

    // [DIAG 4] immediately after the insert
    if (error) {
      console.error("[track] 4 insert FAILED:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
    } else {
      console.log("[track] 4 insert SUCCESS");
    }

    return noContent();
  } catch (err) {
    // [DIAG 5] caught error before returning the existing 204
    console.error(
      "[track] 5 caught error:",
      err instanceof Error
        ? { name: err.name, message: err.message }
        : err,
    );
    return noContent();
  }
}
