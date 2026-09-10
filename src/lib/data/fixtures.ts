/*
  DEVELOPMENT-ONLY fixtures.

  Returned by the data layer ONLY when NEXT_PUBLIC_USE_DEV_FIXTURES === "1"
  (off by default, never set in production). They let the pages render populated
  for design/behaviour review WITHOUT writing anything to the database.

  The reader fixtures reproduce the OUTPUT of the Phase 2 `reading_sequence`
  SQL view (path_segment, label, chapter_number, total_chapters, prev/next) so
  the reader UI can be exercised offline. This builder is a test double for the
  view; the real reader always consumes the database view, never this code.
*/
import type { Book, ChapterKind, ReadingSequenceItem } from "@/lib/types";
import type { ResolvedSiteSettings } from "@/lib/data/site";
import type { TestimonialView } from "@/lib/data/testimonials";

export function devFixturesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_DEV_FIXTURES === "1";
}

const now = "2025-01-01T00:00:00.000Z";

export const devSettings: ResolvedSiteSettings = {
  siteName: "INK & PAPER",
  authorName: "P Chendraya Perumal",
  siteDescription:
    "Stories about people, memory, love, loss, and hope — free to read online.",
  instagramUrl: "https://instagram.com/example",
};

export const devBooks: Book[] = [
  {
    id: "dev-1",
    title: "The First Long Evening",
    slug: "sample-first-long-evening",
    subtitle: "A sample cover (development preview)",
    genre: "Fiction",
    description:
      "A placeholder description used only in the development preview. The real books are added later through the proper import process.",
    cover_url: "/dev-covers/tall.svg",
    status: "published",
    featured: true,
    display_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "dev-2",
    title: "Letters We Never Sent",
    slug: "sample-letters-we-never-sent",
    subtitle: null,
    genre: "Short stories",
    description:
      "A placeholder description used only in the development preview. Covers of different shapes are shown to prove the whole cover always stays visible.",
    cover_url: "/dev-covers/square.svg",
    status: "published",
    featured: false,
    display_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: "dev-3",
    title: "A Quiet Kind of Weather",
    slug: "sample-a-quiet-kind-of-weather",
    subtitle: "Poems",
    genre: "Poetry",
    description:
      "A placeholder description used only in the development preview (this one has no front matter, to test a book that opens straight into Chapter 1).",
    cover_url: "/dev-covers/wide.svg",
    status: "published",
    featured: false,
    display_order: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: "dev-4",
    title: "The Long Year",
    slug: "sample-the-long-year",
    subtitle: "Twelve chapters (development preview)",
    genre: "Fiction",
    description:
      "A placeholder used only in the development preview, with twelve chapters, to verify the chapter counter reads 'Chapter 12 of 12'.",
    cover_url: "/dev-covers/tall.svg",
    status: "published",
    featured: false,
    display_order: 4,
    created_at: now,
    updated_at: now,
  },
];

type SectionDef = { kind: ChapterKind; title: string; content?: string };

function para(...lines: string[]): string {
  return lines.join("\n\n");
}

const SAMPLE_PROSE = para(
  "This is placeholder manuscript text used only in the development preview. It exists to show how a page of prose reads in the book column — the measure, the leading, and the spacing between paragraphs.",
  "The real manuscripts are imported later, exactly as written, and are never rewritten or summarised. Until then, these words simply hold the shape of a page.",
  "A second paragraph follows, so the rhythm of reading — the small pause between one thought and the next — can be felt the way it would in a printed book.",
);

const SAMPLE_INTRO = para(
  "This introduction is placeholder front matter for the development preview. It is not counted as a chapter.",
  "It sits before the contents and the first chapter, and the chapter counter ignores it entirely.",
);

/** Section definitions per book id (kind order within the builder mirrors the
    view: introduction → contents → chapters). */
const devSections: Record<string, SectionDef[]> = {
  "dev-1": [
    { kind: "introduction", title: "Introduction", content: SAMPLE_INTRO },
    { kind: "contents", title: "Contents" },
    { kind: "chapter", title: "The Arrival", content: SAMPLE_PROSE },
    { kind: "chapter", title: "What the Evening Held", content: SAMPLE_PROSE },
    { kind: "chapter", title: "Morning, After", content: SAMPLE_PROSE },
  ],
  "dev-2": [
    { kind: "introduction", title: "Introduction", content: SAMPLE_INTRO },
    { kind: "contents", title: "Contents" },
    { kind: "chapter", title: "A Letter Begun", content: SAMPLE_PROSE },
    { kind: "chapter", title: "A Letter Ended", content: SAMPLE_PROSE },
  ],
  // No front matter — opens straight into Chapter 1.
  "dev-3": [
    { kind: "chapter", title: "Weather I", content: SAMPLE_PROSE },
    { kind: "chapter", title: "Weather II", content: SAMPLE_PROSE },
  ],
  // Twelve chapters for the counter test.
  "dev-4": [
    { kind: "introduction", title: "Introduction", content: SAMPLE_INTRO },
    { kind: "contents", title: "Contents" },
    ...Array.from({ length: 12 }, (_, i) => ({
      kind: "chapter" as const,
      title: `The ${
        [
          "First",
          "Second",
          "Third",
          "Fourth",
          "Fifth",
          "Sixth",
          "Seventh",
          "Eighth",
          "Ninth",
          "Tenth",
          "Eleventh",
          "Twelfth",
        ][i]
      } Month`,
      content: SAMPLE_PROSE,
    })),
  ],
};

const KIND_RANK: Record<ChapterKind, number> = {
  acknowledgments: 0,
  introduction: 1,
  contents: 2,
  chapter: 3,
  epilogue: 4,
};

/** Builds rows identical in shape and semantics to the reading_sequence view. */
function buildSequence(bookId: string, defs: SectionDef[]): ReadingSequenceItem[] {
  const ordered = defs
    .map((d, i) => ({ ...d, _i: i }))
    .sort((a, b) => KIND_RANK[a.kind] - KIND_RANK[b.kind] || a._i - b._i);

  const total = ordered.filter((d) => d.kind === "chapter").length;
  let chapterCount = 0;

  const partial = ordered.map((d) => {
    const chapterNumber = d.kind === "chapter" ? ++chapterCount : null;
    const pathSegment =
      d.kind === "chapter" ? `chapter-${chapterNumber}` : d.kind;
    const LABELS: Record<ChapterKind, string> = {
      acknowledgments: "Acknowledgments",
      introduction: "Introduction",
      contents: "Contents",
      chapter: `Chapter ${chapterNumber}`,
      epilogue: "Epilogue",
    };
    const label = LABELS[d.kind];
    return { d, chapterNumber, pathSegment, label };
  });

  return partial.map((p, idx) => ({
    id: `${bookId}-${p.pathSegment}`,
    book_id: bookId,
    title: p.d.title,
    content: p.d.content ?? null,
    kind: p.d.kind,
    display_order: idx,
    audio_url: null,
    audio_duration: null,
    audio_status: null,
    created_at: now,
    updated_at: now,
    sequence_position: idx + 1,
    chapter_number: p.chapterNumber,
    total_chapters: total,
    path_segment: p.pathSegment,
    label: p.label,
    prev_path_segment: idx > 0 ? partial[idx - 1].pathSegment : null,
    prev_label: idx > 0 ? partial[idx - 1].label : null,
    next_path_segment:
      idx < partial.length - 1 ? partial[idx + 1].pathSegment : null,
    next_label: idx < partial.length - 1 ? partial[idx + 1].label : null,
  }));
}

/** Full reading sequence for a fixture book (empty if unknown). */
export function devReaderSequence(bookId: string): ReadingSequenceItem[] {
  const defs = devSections[bookId];
  return defs ? buildSequence(bookId, defs) : [];
}

export const devTestimonials: TestimonialView[] = [
  {
    id: "dev-t1",
    name: "A Reader",
    message:
      "I finished it on the train and had to sit for a while before I could stand up. Some of these sentences said the thing I could never quite say.",
    location: "Chennai",
    photoUrl: null,
    featured: true,
    bookTitle: "The First Long Evening",
  },
  {
    id: "dev-t2",
    name: "Another Reader",
    message:
      "Quiet, and then suddenly not. I have already started reading it a second time.",
    location: null,
    photoUrl: null,
    featured: false,
    bookTitle: "Letters We Never Sent",
  },
  {
    id: "dev-t3",
    name: "A Reader",
    message: "It felt like a letter meant for me. Thank you for writing it.",
    location: "Bengaluru",
    photoUrl: null,
    featured: false,
    bookTitle: null,
  },
];
