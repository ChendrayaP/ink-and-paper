
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedBooks } from "@/lib/data/books";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    absoluteTitle: (s) => `${s.siteName} Library`,
    path: "/library",
    description: "Browse and read the books, freely and at your own pace.",
  });
}

function getBookValue(book: unknown, key: string) {
  return (book as Record<string, unknown>)[key];
}

function getBookTitle(book: unknown) {
  return (
    (getBookValue(book, "title") as string | undefined) ??
    (getBookValue(book, "name") as string | undefined) ??
    "Untitled"
  );
}

function getBookSlug(book: unknown) {
  return (getBookValue(book, "slug") as string | undefined) ?? "";
}

function getBookSubtitle(book: unknown) {
  return (
    (getBookValue(book, "subtitle") as string | undefined) ??
    ""
  );
}

function getBookCover(book: unknown) {
  return (
    (getBookValue(book, "cover_url") as string | undefined) ??
    (getBookValue(book, "cover_image_url") as string | undefined) ??
    (getBookValue(book, "coverImageUrl") as string | undefined) ??
    (getBookValue(book, "cover") as string | undefined) ??
    ""
  );
}

function isFeatured(book: unknown) {
  return Boolean(getBookValue(book, "featured"));
}

export default async function LibraryPage() {
  const books = await getPublishedBooks();

  if (books.length === 0) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full min-w-0 max-w-6xl px-5 sm:px-6 lg:px-8">
          <header className="max-w-prose">
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-accent">
              The collection
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              The Library
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Every book here is free to read online. Take your time.
            </p>
          </header>

          <div className="mt-12">
            <EmptyState>
              The shelves are being prepared. The first books will appear here
              soon.
            </EmptyState>
          </div>
        </div>
      </section>
    );
  }

  const featuredBook = books.find(isFeatured) ?? books[0];
  const collection = books.filter((book) => book !== featuredBook);

  const featuredTitle = getBookTitle(featuredBook);
  const featuredSlug = getBookSlug(featuredBook);
  const featuredSubtitle = getBookSubtitle(featuredBook);
  const featuredCover = getBookCover(featuredBook);

  return (
    <main>
      <section className="border-b border-line py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full min-w-0 max-w-6xl px-5 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-3xl text-center">
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.28em] text-accent">
              The collection
            </p>
            <h1 className="mt-4 max-w-full break-words font-serif text-4xl leading-[1] text-ink sm:text-6xl lg:text-7xl">
              The Library
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-serif text-lg leading-relaxed text-ink-soft sm:text-xl">
              Stories written from the heart.
              <br />
              Free to read online. Take your time.
            </p>
          </header>
        </div>
      </section>

      <section className="border-b border-line bg-paper-raised py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full min-w-0 max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(360px,0.7fr)] lg:gap-20">
            <div className="order-2 min-w-0 lg:order-1">
              <p className="font-sans text-[0.68rem] uppercase tracking-[0.25em] text-accent">
                Featured story
              </p>

              <h2 className="mt-5 max-w-xl break-words font-serif text-4xl leading-[1.02] text-ink sm:text-5xl lg:text-6xl">
                {featuredTitle}
              </h2>

              {featuredSubtitle ? (
                <p className="mt-5 max-w-lg font-serif text-lg italic leading-relaxed text-ink-soft">
                  {featuredSubtitle}
                </p>
              ) : null}

              <p className="mt-7 max-w-lg text-base leading-8 text-ink-soft">
                Enter the story and take your time with every page.
              </p>

              {featuredSlug ? (
                <Link
                  href={`/books/${featuredSlug}`}
                  className="mt-8 inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 font-sans text-[0.72rem] font-medium uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90"
                >
                  Read the story
                </Link>
              ) : null}
            </div>

            <div className="order-1 flex min-w-0 justify-center lg:order-2 lg:justify-end">
              {featuredCover ? (
                <Link
                  href={featuredSlug ? `/books/${featuredSlug}` : "#"}
                  aria-label={`Read ${featuredTitle}`}
                  className="group block"
                >
                  <div className="relative">
                    <div className="absolute -right-4 top-6 h-full w-full border border-line bg-paper-dark/30" />
                    <div className="relative w-[min(78vw,250px)] overflow-hidden bg-paper shadow-[0_24px_60px_rgba(44,33,26,0.12)] sm:w-[290px] lg:w-[320px]">
                      <img
                        src={featuredCover}
                        alt={featuredTitle}
                        className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.015]"
                        decoding="sync"
                      />
                    </div>
                  </div>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {collection.length > 0 ? (
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full min-w-0 max-w-6xl px-5 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
              <div>
                <p className="font-sans text-[0.68rem] uppercase tracking-[0.25em] text-accent">
                  The collection
                </p>
                <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
                  More stories
                </h2>
              </div>
              <p className="hidden max-w-xs text-right text-sm leading-6 text-ink-soft sm:block">
                Every book is free to read online, whenever you are ready.
              </p>
            </div>

            <div className="mt-10 grid gap-x-8 gap-y-14 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
              {collection.map((book) => {
                const title = getBookTitle(book);
                const slug = getBookSlug(book);
                const subtitle = getBookSubtitle(book);
                const cover = getBookCover(book);

                return (
                  <article key={slug || title} className="group">
                    <Link href={`/books/${slug}`} className="block">
                      <div className="mx-auto w-full max-w-[300px] overflow-hidden bg-paper shadow-[0_18px_45px_rgba(44,33,26,0.08)] transition-transform duration-500 group-hover:-translate-y-1">
                        {cover ? (
                          <img
                            src={cover}
                            alt={title}
                            className="block h-auto w-full"
                            decoding="sync"
                          />
                        ) : (
                          <div className="flex aspect-[2/3] items-center justify-center border border-line bg-paper-dark/30 px-8 text-center font-serif text-xl text-ink-soft">
                            {title}
                          </div>
                        )}
                      </div>

                      <div className="mx-auto mt-5 max-w-[300px]">
                        <h3 className="font-serif text-2xl leading-tight text-ink">
                          {title}
                        </h3>
                        {subtitle ? (
                          <p className="mt-2 font-serif text-sm italic leading-6 text-ink-soft">
                            {subtitle}
                          </p>
                        ) : null}
                        <span className="mt-4 inline-block font-sans text-[0.66rem] uppercase tracking-[0.16em] text-accent">
                          Read the story →
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}