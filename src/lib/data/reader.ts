import { cache } from "react";
import type { Book, ReadingSequenceItem } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import { devFixturesEnabled, devBooks, devReaderSequence } from "@/lib/data/fixtures";

/** Minimal book shape needed by the reader. */
export type ReaderBook = Pick<
  Book,
  "id" | "title" | "slug" | "subtitle" | "cover_url"
>;

/** A lightweight sequence row (no manuscript content) used to build the map,
    the contents list, and Previous/Next — all straight from the view. */
export type ReaderMapRow = Pick<
  ReadingSequenceItem,
  | "title"
  | "kind"
  | "path_segment"
  | "label"
  | "chapter_number"
  | "total_chapters"
  | "sequence_position"
  | "prev_path_segment"
  | "prev_label"
  | "next_path_segment"
  | "next_label"
>;

const MAP_COLUMNS =
  "title, kind, path_segment, label, chapter_number, total_chapters, sequence_position, prev_path_segment, prev_label, next_path_segment, next_label";

/** A published book by slug, or null (drafts are invisible via RLS). */
export const getReaderBook = cache(
  async (slug: string): Promise<ReaderBook | null> => {
    if (devFixturesEnabled()) {
      const b = devBooks.find(
        (x) => x.slug === slug && x.status === "published",
      );
      return b
        ? { id: b.id, title: b.title, slug: b.slug, subtitle: b.subtitle, cover_url: b.cover_url }
        : null;
    }
    if (!isSupabaseConfigured()) return null;
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("books")
        .select("id, title, slug, subtitle, cover_url")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    } catch (err) {
      console.error("getReaderBook failed:", err);
      return null;
    }
  },
);

/** The whole reading sequence for a book (light rows), in reading order.
    This is the map the reader navigates by — every value comes from the view. */
export const getBookSequence = cache(
  async (bookId: string): Promise<ReaderMapRow[]> => {
    if (devFixturesEnabled()) {
      return devReaderSequence(bookId).map((r) => ({
        title: r.title,
        kind: r.kind,
        path_segment: r.path_segment,
        label: r.label,
        chapter_number: r.chapter_number,
        total_chapters: r.total_chapters,
        sequence_position: r.sequence_position,
        prev_path_segment: r.prev_path_segment,
        prev_label: r.prev_label,
        next_path_segment: r.next_path_segment,
        next_label: r.next_label,
      }));
    }
    if (!isSupabaseConfigured()) return [];
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("reading_sequence")
        .select(MAP_COLUMNS)
        .eq("book_id", bookId)
        .order("sequence_position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ReaderMapRow[];
    } catch (err) {
      console.error("getBookSequence failed:", err);
      return [];
    }
  },
);

/** The manuscript for a single section (fetched only when a section is opened,
    so a chapter page never pulls the whole book). */
export const getSectionContent = cache(
  async (
    bookId: string,
    pathSegment: string,
  ): Promise<{ title: string; content: string | null } | null> => {
    if (devFixturesEnabled()) {
      const row = devReaderSequence(bookId).find(
        (r) => r.path_segment === pathSegment,
      );
      return row ? { title: row.title, content: row.content } : null;
    }
    if (!isSupabaseConfigured()) return null;
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("reading_sequence")
        .select("title, content")
        .eq("book_id", bookId)
        .eq("path_segment", pathSegment)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    } catch (err) {
      console.error("getSectionContent failed:", err);
      return null;
    }
  },
);
