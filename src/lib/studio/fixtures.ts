/*
  DEVELOPMENT-ONLY Studio fixtures (flag-gated via NEXT_PUBLIC_USE_DEV_FIXTURES).
  Let the Studio render populated for design/responsive review WITHOUT auth or a
  database. Never used in production; actions never persist in preview mode.
*/
import type { Book, Chapter, Testimonial } from "@/lib/types";
import type { StudioTestimonialRow } from "@/lib/studio/queries";

const now = "2025-01-01T00:00:00.000Z";

export const devStudioBooks: Book[] = [
  {
    id: "dev-1",
    title: "The First Long Evening",
    slug: "sample-first-long-evening",
    subtitle: "A sample cover (development preview)",
    genre: "Fiction",
    description: "A placeholder description used only in the development preview.",
    cover_url: "/dev-covers/tall.svg",
    status: "published",
    featured: true,
    display_order: 1,
    created_at: now,
    updated_at: "2025-02-10T09:00:00.000Z",
  },
  {
    id: "dev-4",
    title: "The Long Year",
    slug: "sample-the-long-year",
    subtitle: "Twelve chapters (development preview)",
    genre: "Fiction",
    description: "A placeholder used only in the development preview.",
    cover_url: "/dev-covers/tall.svg",
    status: "published",
    featured: false,
    display_order: 2,
    created_at: now,
    updated_at: "2025-02-08T09:00:00.000Z",
  },
  {
    id: "dev-draft",
    title: "Something Still Being Written",
    slug: "sample-draft",
    subtitle: null,
    genre: "Fiction",
    description: "A draft in progress — no cover yet.",
    cover_url: null,
    status: "draft",
    featured: false,
    display_order: 3,
    created_at: now,
    updated_at: "2025-02-12T09:00:00.000Z",
  },
];

function chap(
  id: string,
  bookId: string,
  kind: Chapter["kind"],
  title: string,
  order: number,
): Chapter {
  return {
    id,
    book_id: bookId,
    title,
    content:
      kind === "chapter"
        ? "Placeholder manuscript text for the development preview. The real books are imported later, exactly as written."
        : kind === "introduction"
          ? "Placeholder introduction (front matter). Never numbered as a chapter."
          : null,
    kind,
    display_order: order,
    audio_url: null,
    audio_duration: null,
    audio_status: null,
    created_at: now,
    updated_at: now,
  };
}

const SECTIONS: Record<string, Chapter[]> = {
  "dev-1": [
    chap("dev-1-intro", "dev-1", "introduction", "Introduction", 0),
    chap("dev-1-contents", "dev-1", "contents", "Contents", 0),
    chap("dev-1-c1", "dev-1", "chapter", "The Arrival", 1),
    chap("dev-1-c2", "dev-1", "chapter", "What the Evening Held", 2),
    chap("dev-1-c3", "dev-1", "chapter", "Morning, After", 3),
  ],
  "dev-4": [
    chap("dev-4-intro", "dev-4", "introduction", "Introduction", 0),
    chap("dev-4-contents", "dev-4", "contents", "Contents", 0),
    ...Array.from({ length: 12 }, (_, i) =>
      chap(`dev-4-c${i + 1}`, "dev-4", "chapter", `Month ${i + 1}`, i + 1),
    ),
  ],
  "dev-draft": [
    chap("dev-draft-c1", "dev-draft", "chapter", "An opening", 1),
  ],
};

export function devStudioChapters(bookId: string): Chapter[] {
  return SECTIONS[bookId] ?? [];
}

export const devStudioTestimonials: StudioTestimonialRow[] = [
  {
    id: "dev-t1",
    name: "A Reader",
    message: "I finished it on the train and had to sit for a while before I could stand up.",
    designation_or_location: "Chennai",
    photo_url: null,
    book_id: "dev-1",
    published: true,
    featured: true,
    source: "author",
    created_at: now,
    updated_at: now,
    book_title: "The First Long Evening",
  },
  {
    id: "dev-t2",
    name: "Another Reader",
    message: "Quiet, and then suddenly not. I have already started reading it a second time.",
    designation_or_location: null,
    photo_url: null,
    book_id: "dev-4",
    published: false,
    featured: false,
    source: "reader_submission",
    created_at: "2025-02-14T10:00:00.000Z",
    updated_at: "2025-02-14T10:00:00.000Z",
    book_title: "The Long Year",
  },
  {
    id: "dev-t3",
    name: "S.",
    message: "It felt like a letter meant for me. Thank you for writing it.",
    designation_or_location: "Bengaluru",
    photo_url: null,
    book_id: "dev-1",
    published: false,
    featured: false,
    source: "reader_submission",
    created_at: "2025-02-13T10:00:00.000Z",
    updated_at: "2025-02-13T10:00:00.000Z",
    book_title: "The First Long Evening",
  },
];

export const devStudioSettings = {
  id: 1,
  site_name: "INK & PAPER",
  author_name: "P Chendraya Perumal",
  site_description:
    "Stories about people, memory, love, loss, and hope — free to read online.",
  instagram_url: "https://instagram.com/example",
  contact_email: null as string | null,
  updated_at: now,
};

// Development-only analytics preview data (never used in production).
export function devAnalytics() {
  const daily: { day: string; views: number }[] = [];
  const today = new Date();
  const sample = [3,5,2,8,6,4,7,9,5,6,10,8,7,11,9,6,4,5,8,12,10,9,7,6,8,11,13,9,7,5];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    daily.push({ day: d.toISOString().slice(0, 10), views: sample[29 - i] ?? 0 });
  }
  const total = daily.reduce((a, b) => a + b.views, 0);
  return {
    summary: {
      total,
      today: daily[daily.length - 1].views,
      last7: daily.slice(-7).reduce((a, b) => a + b.views, 0),
      last30: total,
    },
    daily,
    topPages: [
      { path: "/", kind: "home", views: 42 },
      { path: "/books/sample-first-long-evening", kind: "book", views: 31 },
      { path: "/books/sample-first-long-evening/chapter-1", kind: "reader", views: 24 },
      { path: "/library", kind: "library", views: 18 },
      { path: "/books/sample-first-long-evening/epilogue", kind: "reader", views: 9 },
    ],
    bookViews: [
      { bookSlug: "sample-first-long-evening", title: "The First Long Evening", views: 64 },
      { bookSlug: "sample-the-long-year", title: "The Long Year", views: 21 },
    ],
  };
}
