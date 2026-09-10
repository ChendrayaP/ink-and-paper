import type { Metadata } from "next";
import Link from "next/link";
import { getStudioBooks } from "@/lib/studio/queries";
import { BookCover } from "@/components/books/BookCover";
import { BookRowActions } from "@/components/studio/BookRowActions";
import { PageHeading, StatusBadge } from "@/components/studio/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Books — Studio" },
  robots: { index: false, follow: false },
};

function fmtDate(iso: string) {
  return iso.slice(0, 10);
}

export default async function StudioBooksPage() {
  const books = await getStudioBooks();
  return (
    <div>
      <PageHeading
        title="Books"
        action={
          <Link
            href="/studio/books/new"
            className="inline-flex items-center justify-center rounded-[2px] bg-ink px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90"
          >
            Add new book
          </Link>
        }
      >
        {books.length} {books.length === 1 ? "book" : "books"}
      </PageHeading>

      {books.length === 0 ? (
        <p className="border-t border-line pt-8 font-serif text-lg italic text-ink-soft">
          No books yet. Add your first one to begin.
        </p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {books.map((b) => (
            <li key={b.id} className="py-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
                <Link
                  href={`/studio/books/${b.id}`}
                  className="flex h-40 w-28 shrink-0 items-start justify-start"
                >
                  <BookCover src={b.cover_url} alt={b.title} className="h-full" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/studio/books/${b.id}`}
                      className="font-serif text-xl text-ink hover:underline"
                    >
                      {b.title}
                    </Link>
                    <StatusBadge status={b.status} />
                  </div>
                  {b.subtitle ? (
                    <p className="mt-1 font-serif text-base italic text-ink-soft">
                      {b.subtitle}
                    </p>
                  ) : null}
                  <p className="mt-2 font-sans text-sm text-ink-soft">
                    {[b.genre, `${b.chapter_count} ${b.chapter_count === 1 ? "chapter" : "chapters"}`, `updated ${fmtDate(b.updated_at)}`]
                      .filter(Boolean)
                      .join("  ·  ")}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/studio/books/${b.id}`}
                      className="rounded-[2px] border border-line px-3 py-1.5 font-sans text-sm text-ink transition-colors hover:border-ink"
                    >
                      Edit
                    </Link>
                    <BookRowActions id={b.id} status={b.status} title={b.title} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
