import type { Book } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import { devBooks, devFixturesEnabled } from "@/lib/data/fixtures";

/** All published books, in reading-room order (display_order, then oldest first). */
export async function getPublishedBooks(): Promise<Book[]> {
  if (devFixturesEnabled()) return devBooks;
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getPublishedBooks failed:", err);
    return [];
  }
}

/** Books to feature on the homepage: featured ones first, then the most
    recent others, up to `limit`. */
export async function getHomepageBooks(limit = 3): Promise<Book[]> {
  const all = await getPublishedBooks();
  const featured = all.filter((b) => b.featured);
  const rest = all.filter((b) => !b.featured);
  return [...featured, ...rest].slice(0, limit);
}
