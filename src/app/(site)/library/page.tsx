import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { BooksList } from "@/components/books/BooksList";
import { getPublishedBooks } from "@/lib/data/books";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    absoluteTitle: (s) => `${s.siteName} Library`,
    path: "/library",
    description: "Browse and read the books, freely and at your own pace.",
  });
}

export default async function LibraryPage() {
  const books = await getPublishedBooks();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <header className="max-w-prose">
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
            The Library
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Every book here is free to read online. Take your time.
          </p>
        </header>

        <div className="mt-12">
          {books.length > 0 ? (
            <BooksList books={books} />
          ) : (
            <EmptyState>
              The shelves are being prepared. The first books will appear here
              soon.
            </EmptyState>
          )}
        </div>
      </Container>
    </section>
  );
}
