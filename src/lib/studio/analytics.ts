import "server-only";
import { createClient } from "@/lib/supabase/server";
import { devFixturesEnabled } from "@/lib/data/fixtures";
import { devAnalytics } from "@/lib/studio/fixtures";

export type AnalyticsSummary = {
  total: number;
  today: number;
  last7: number;
  last30: number;
};
export type DailyPoint = { day: string; views: number };
export type TopPage = { path: string; kind: string; views: number };
export type BookViewRow = { bookSlug: string; title: string; views: number };

export type AnalyticsData = {
  summary: AnalyticsSummary;
  daily: DailyPoint[]; // last 30 calendar days (UTC), zero-filled, ascending
  topPages: TopPage[];
  bookViews: BookViewRow[];
};

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}
function startOfTodayUTC(): string {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)}T00:00:00.000Z`;
}
/** Zero-filled list of the last 30 UTC dates (ascending), merged with counts. */
function buildDaily(counts: Map<string, number>): DailyPoint[] {
  const out: DailyPoint[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: key, views: counts.get(key) ?? 0 });
  }
  return out;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  if (devFixturesEnabled()) return devAnalytics();

  const supabase = await createClient();

  const [totalRes, todayRes, last7Res, last30Res, dailyRes, topRes, bookRes, booksRes] =
    await Promise.all([
      supabase.from("page_views").select("*", { count: "exact", head: true }),
      supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("viewed_at", startOfTodayUTC()),
      supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("viewed_at", isoDaysAgo(7)),
      supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("viewed_at", isoDaysAgo(30)),
      supabase
        .from("analytics_daily")
        .select("day, views")
        .gte("day", isoDaysAgo(30).slice(0, 10)),
      supabase
        .from("analytics_top_paths")
        .select("path, kind, views")
        .order("views", { ascending: false })
        .limit(10),
      supabase
        .from("analytics_book_views")
        .select("book_slug, views")
        .order("views", { ascending: false })
        .limit(20),
      supabase.from("books").select("slug, title"),
    ]);

  const dailyCounts = new Map<string, number>();
  for (const r of dailyRes.data ?? []) {
    if (r.day) dailyCounts.set(r.day, Number(r.views ?? 0));
  }

  const titleBySlug = new Map<string, string>();
  for (const b of booksRes.data ?? []) titleBySlug.set(b.slug, b.title);

  const bookViews: BookViewRow[] = (bookRes.data ?? [])
    .filter((r) => r.book_slug)
    .map((r) => ({
      bookSlug: r.book_slug as string,
      title: titleBySlug.get(r.book_slug as string) ?? (r.book_slug as string),
      views: Number(r.views ?? 0),
    }));

  const topPages: TopPage[] = (topRes.data ?? []).map((r) => ({
    path: r.path ?? "",
    kind: r.kind ?? "",
    views: Number(r.views ?? 0),
  }));

  return {
    summary: {
      total: totalRes.count ?? 0,
      today: todayRes.count ?? 0,
      last7: last7Res.count ?? 0,
      last30: last30Res.count ?? 0,
    },
    daily: buildDaily(dailyCounts),
    topPages,
    bookViews,
  };
}
