import "server-only";
import { createClient } from "@/lib/supabase/server";
import { devFixturesEnabled } from "@/lib/data/fixtures";
import {
  devStudioBooks,
  devStudioChapters,
  devStudioTestimonials,
  devStudioSettings,
} from "@/lib/studio/fixtures";
import type { Book, Chapter, Testimonial, ChapterKind } from "@/lib/types";

export type StudioBookRow = Book & { chapter_count: number };

export type DashboardStats = {
  totalBooks: number;
  publishedBooks: number;
  draftBooks: number;
  totalTestimonials: number;
  pendingSubmissions: number;
};

export type SectionRow = {
  id: string;
  kind: ChapterKind;
  title: string;
  display_order: number;
  chapter_number: number | null;
  label: string;
  path_segment: string;
};

export type StudioTestimonialRow = Testimonial & { book_title: string | null };

export async function getDashboardStats(): Promise<DashboardStats> {
  if (devFixturesEnabled()) {
    const books = devStudioBooks;
    const t = devStudioTestimonials;
    return {
      totalBooks: books.length,
      publishedBooks: books.filter((b) => b.status === "published").length,
      draftBooks: books.filter((b) => b.status === "draft").length,
      totalTestimonials: t.length,
      pendingSubmissions: t.filter(
        (x) => x.source === "reader_submission" && !x.published,
      ).length,
    };
  }
  const supabase = await createClient();
  const [books, testimonials] = await Promise.all([
    supabase.from("books").select("status"),
    supabase.from("testimonials").select("source, published"),
  ]);
  const b = books.data ?? [];
  const t = testimonials.data ?? [];
  return {
    totalBooks: b.length,
    publishedBooks: b.filter((x) => x.status === "published").length,
    draftBooks: b.filter((x) => x.status === "draft").length,
    totalTestimonials: t.length,
    pendingSubmissions: t.filter(
      (x) => x.source === "reader_submission" && !x.published,
    ).length,
  };
}

export async function getStudioBooks(): Promise<StudioBookRow[]> {
  if (devFixturesEnabled()) {
    return devStudioBooks.map((b) => ({
      ...b,
      chapter_count: devStudioChapters(b.id).filter((c) => c.kind === "chapter")
        .length,
    }));
  }
  const supabase = await createClient();
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  const { data: chapters } = await supabase
    .from("chapters")
    .select("book_id, kind");
  const counts = new Map<string, number>();
  for (const c of chapters ?? []) {
    if (c.kind === "chapter")
      counts.set(c.book_id, (counts.get(c.book_id) ?? 0) + 1);
  }
  return (books ?? []).map((b) => ({
    ...b,
    chapter_count: counts.get(b.id) ?? 0,
  }));
}

export async function getStudioBook(id: string): Promise<Book | null> {
  if (devFixturesEnabled()) {
    return devStudioBooks.find((b) => b.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase.from("books").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

/** Sections (front matter + chapters) in reading order, from the view. */
export async function getBookSections(bookId: string): Promise<SectionRow[]> {
  if (devFixturesEnabled()) {
    return devStudioChapters(bookId).map((c, i, arr) => {
      const chapters = arr.filter((x) => x.kind === "chapter");
      const chapterNumber =
        c.kind === "chapter" ? chapters.indexOf(c) + 1 : null;
      return {
        id: c.id,
        kind: c.kind,
        title: c.title,
        display_order: c.display_order,
        chapter_number: chapterNumber,
        label:
          c.kind === "chapter"
            ? `Chapter ${chapterNumber}`
            : c.kind === "introduction"
              ? "Introduction"
              : "Contents",
        path_segment:
          c.kind === "chapter" ? `chapter-${chapterNumber}` : c.kind,
      };
    });
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("reading_sequence")
    .select("id, kind, title, display_order, chapter_number, label, path_segment")
    .eq("book_id", bookId)
    .order("sequence_position", { ascending: true });
  return (data ?? []) as SectionRow[];
}

export async function getSection(id: string): Promise<Chapter | null> {
  if (devFixturesEnabled()) {
    for (const b of devStudioBooks) {
      const found = devStudioChapters(b.id).find((c) => c.id === id);
      if (found) return found;
    }
    return null;
  }
  const supabase = await createClient();
  const { data } = await supabase.from("chapters").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function getStudioTestimonials(): Promise<StudioTestimonialRow[]> {
  if (devFixturesEnabled()) return devStudioTestimonials;
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*, books(title)")
    .order("created_at", { ascending: false });
  return (data ?? []).map((t) => {
    const { books, ...rest } = t as Testimonial & { books: { title: string } | null };
    return { ...rest, book_title: books?.title ?? null };
  });
}

export async function getBooksForSelect(): Promise<{ id: string; title: string }[]> {
  if (devFixturesEnabled())
    return devStudioBooks.map((b) => ({ id: b.id, title: b.title }));
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("id, title")
    .order("title", { ascending: true });
  return data ?? [];
}

export async function getSiteSettingsRow() {
  if (devFixturesEnabled()) return devStudioSettings;
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return data;
}
