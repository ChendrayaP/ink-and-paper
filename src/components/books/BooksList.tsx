import Link from "next/link";
import type { Book } from "@/lib/types";
import { BookCover } from "@/components/books/BookCover";

function ReadLink({ slug }: { slug: string }) {
  return (
    <Link
      href={`/books/${slug}`}
      className="inline-flex items-center justify-center rounded-[2px] bg-ink px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Read
    </Link>
  );
}

/** Detailed, editorial list for the Library page. */
export function BooksList({ books }: { books: Book[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {books.map((book) => (
        <li key={book.id}>
          <article className="flex flex-col gap-6 py-10 sm:flex-row sm:gap-10">
            <div className="flex h-64 shrink-0 items-start justify-center sm:h-72 sm:w-44 sm:justify-start">
              <BookCover src={book.cover_url} alt={book.title} className="h-full" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-2xl leading-tight text-ink">
                {book.title}
              </h2>
              {book.subtitle ? (
                <p className="mt-1 font-serif text-lg italic text-ink-soft">
                  {book.subtitle}
                </p>
              ) : null}
              {book.genre ? (
                <p className="mt-3 font-sans text-sm text-ink-soft">
                  {book.genre}
                </p>
              ) : null}
              {book.description ? (
                <p className="mt-4 max-w-prose text-base leading-relaxed text-ink">
                  {book.description}
                </p>
              ) : null}
              <div className="mt-6">
                <ReadLink slug={book.slug} />
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

/** Compact covers row for the homepage. */
export function BookCoversRow({ books }: { books: Book[] }) {
  return (
    <ul className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
      {books.map((book) => (
        <li key={book.id}>
          <Link href={`/books/${book.slug}`} className="group block">
            <div className="flex h-56 items-end justify-center sm:h-64">
              <BookCover src={book.cover_url} alt={book.title} className="h-full" />
            </div>
            <h3 className="mt-4 font-serif text-lg leading-snug text-ink">
              {book.title}
            </h3>
            {book.genre ? (
              <p className="mt-1 font-sans text-sm text-ink-soft">
                {book.genre}
              </p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
