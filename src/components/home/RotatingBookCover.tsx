"use client";

import { useEffect, useState } from "react";
import type { Book } from "@/lib/types";

type Props = {
  books: Book[];
  siteName: string;
  authorName: string;
};

function getBookValue(book: Book, key: string) {
  return (book as unknown as Record<string, unknown>)[key];
}

function getBookTitle(book: Book) {
  return (
    (getBookValue(book, "title") as string | undefined) ??
    (getBookValue(book, "name") as string | undefined) ??
    "Untitled"
  );
}

function getBookCover(book: Book) {
  return (
    (getBookValue(book, "cover_url") as string | undefined) ??
    (getBookValue(book, "cover_image_url") as string | undefined) ??
    (getBookValue(book, "coverImageUrl") as string | undefined) ??
    (getBookValue(book, "cover") as string | undefined) ??
    ""
  );
}

export function RotatingBookCover({
  books,
  siteName,
  authorName,
}: Props) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  useEffect(() => {
    const booksWithCovers = books.filter((book) => Boolean(getBookCover(book)));

    if (booksWithCovers.length === 0) {
      setSelectedBook(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * booksWithCovers.length);
    setSelectedBook(booksWithCovers[randomIndex]);
  }, [books]);

  const cover = selectedBook ? getBookCover(selectedBook) : "";
  const title = selectedBook ? getBookTitle(selectedBook) : "";

  return (
    <div className="relative mx-auto w-full max-w-[285px] lg:max-w-[300px]">
      <div
        aria-hidden="true"
        className="absolute -inset-5 rotate-[2.5deg] border border-ink/10"
      />

      <div
        aria-hidden="true"
        className="absolute -inset-2 rotate-[1.5deg] border border-accent/20"
      />

      <div className="relative aspect-[2/3] overflow-hidden bg-ink/5 shadow-[0_35px_80px_rgba(44,33,26,0.18)]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col justify-between bg-ink p-7 text-paper">
            <span className="font-sans text-[0.5rem] uppercase tracking-[0.25em] text-paper/50">
              {siteName}
            </span>

            <span className="font-display text-4xl leading-[0.92]">
              Stories for the things we never say.
            </span>

            <span className="font-sans text-[0.5rem] uppercase tracking-[0.2em] text-paper/45">
              {authorName}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/45 to-transparent p-5">
          <p className="font-sans text-[0.5rem] uppercase tracking-[0.22em] text-paper/80">
            The first page
          </p>
        </div>
      </div>

      <p className="mt-5 text-center font-display text-lg italic text-ink-soft">
        Open slowly.
      </p>
    </div>
  );
}
