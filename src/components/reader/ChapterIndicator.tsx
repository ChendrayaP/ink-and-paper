import type { ReaderMapRow } from "@/lib/data/reader";

/*
  Only kind='chapter' shows "Chapter n of N". Every other section
  (acknowledgments, introduction, contents, epilogue) shows its own label
  from reading_sequence, so front/back matter is never counted as a chapter.
*/
export function ChapterIndicator({ row }: { row: ReaderMapRow }) {
  const text =
    row.kind === "chapter" && row.chapter_number != null
      ? `Chapter ${row.chapter_number} of ${row.total_chapters}`
      : row.label;
  return (
    <p className="font-sans text-sm tracking-[0.14em] text-ink-soft">{text}</p>
  );
}
