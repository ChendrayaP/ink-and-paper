import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BookCover } from "@/components/books/BookCover";
import { getReaderBook, getBookSequence } from "@/lib/data/reader";
import { getSiteSettings } from "@/lib/data/site";
import { absoluteUrl } from "@/lib/seo";
import { bookJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [book, settings] = await Promise.all([
    getReaderBook(slug),
    getSiteSettings(),
  ]);
  if (!book) return { title: { absolute: `Not found — ${settings.siteName}` } };
  const title = `${book.title} — ${settings.authorName}`;
  const description = book.subtitle ?? settings.siteDescription;
  const ogImage = [
    {
      url: absoluteUrl(`/api/og-image/${book.slug}`),
      width: 1200,
      height: 630,
      alt: book.title,
    },
  ];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/books/${book.slug}` },
    openGraph: {
      type: "book",
      siteName: settings.siteName,
      title,
      description,
      url: `/books/${book.slug}`,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage.map((i) => i.url),
    },
  };
}

export default async function BookRootPage({ params }: Params) {
  const { slug } = await params;
  const book = await getReaderBook(slug);
  if (!book) notFound();

  const [sequence, settings] = await Promise.all([
    getBookSequence(book.id),
    getSiteSettings(),
  ]);

  const first = sequence[0] ?? null;
  const total = first?.total_chapters ?? 0;
  const hasIntro = sequence.some((s) => s.kind === "introduction");
  const hasContents = sequence.some((s) => s.kind === "contents");
  const orientation = [
    hasIntro ? "Introduction" : null,
    hasContents ? "Contents" : null,
    total > 0 ? `${total} ${total === 1 ? "chapter" : "chapters"}` : null,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <>
    <Container className="py-16 sm:py-24">
      <JsonLd
        data={[
          bookJsonLd({
            title: book.title,
            subtitle: book.subtitle,
            coverUrl: book.cover_url,
            slug: book.slug,
            authorName: settings.authorName,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Library", path: "/library" },
            { name: book.title, path: `/books/${book.slug}` },
          ]),
        ]}
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="flex h-[26rem] items-center justify-center">
          <BookCover src={book.cover_url} alt={book.title} className="h-full" />
        </div>

        <h1 className="mt-12 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          {book.title}
        </h1>
        {book.subtitle ? (
          <p className="mt-3 font-serif text-xl italic text-ink-soft">
            {book.subtitle}
          </p>
        ) : null}
        <p className="mt-4 font-sans text-sm tracking-[0.14em] text-ink-soft">
          {settings.authorName}
        </p>

        {first ? (
          <div className="mt-10">
            <Link
              href={`/books/${book.slug}/${first.path_segment}`}
              className="inline-flex items-center justify-center rounded-[2px] bg-ink px-8 py-3.5 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Begin reading
            </Link>
          </div>
        ) : (
          <p className="mt-10 font-serif text-lg italic text-ink-soft">
            This book’s pages are being prepared.
          </p>
        )}

        {orientation ? (
          <p className="mt-8 font-sans text-sm text-ink-soft">{orientation}</p>
        ) : null}
      </div>
    </Container>

    {book.slug === "i-knew-you-before-we-met" ? (
      <>
        {/* Section 1 */}
        <section className="border-t border-line">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-2xl">
              <h2 className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
                Some people feel familiar before they become known.
              </h2>
              <div className="mt-6 space-y-5 font-serif text-lg leading-relaxed text-ink-soft">
                <p>
                  What if the person you meet for the first time is someone your
                  heart has somehow known forever?
                </p>
                <p>
                  <em className="text-ink">I Knew You Before We Met</em> is a story
                  about love, longing, connection and the strange feeling that some
                  encounters are not beginnings at all—but reunions.
                </p>
                <p>
                  It explores the invisible threads that draw two people toward each
                  other, the memories we cannot explain, and the possibility that
                  some bonds can cross the boundaries of time.
                </p>
                <p>Because sometimes, love doesn’t begin when two people meet.</p>
                <p>Sometimes, meeting is simply when we remember.</p>
              </div>
              <div className="mt-8">
                <Link
                  href={`/books/${book.slug}/chapter-1`}
                  className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  Start Chapter 1 <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Section 2 */}
        <section className="border-t border-line">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-2xl">
              <h2 className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
                Enter the story
              </h2>
              <div className="mt-6 space-y-5 font-serif text-lg leading-relaxed text-ink-soft">
                <p>A story meant to be read slowly.</p>
                <p>To wonder about.</p>
                <p>To feel.</p>
                <p>
                  From the first chapter to the final page, follow a journey where
                  love is not simply about finding someone—but about discovering why
                  they feel so familiar.
                </p>
              </div>
              <p className="mt-6 font-sans text-sm tracking-[0.12em] text-ink-soft">
                12 Chapters · Introduction · Epilogue
              </p>
              <div className="mt-8">
                <Link
                  href={`/books/${book.slug}/contents`}
                  className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  Explore the Contents <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Section 3 */}
        <section className="border-t border-line">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-2xl">
              <h2 className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
                About the Author
              </h2>
              <p className="mt-2 font-sans text-sm tracking-[0.14em] text-ink-soft">
                P Chendraya Perumal
              </p>
              <div className="mt-6 space-y-5 font-serif text-lg leading-relaxed text-ink-soft">
                <p>
                  A writer drawn to stories that explore the emotions people carry
                  quietly—their memories, relationships, choices, hopes and the
                  things they struggle to put into words.
                </p>
                <p>
                  Through his writing, P Chendraya Perumal seeks to create stories
                  that stay with the reader long after the final page.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  Meet the Author <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="border-t border-line">
          <Container className="py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
                Perhaps some stories are not meant to be discovered.
              </h2>
              <p className="mt-2 font-serif text-2xl leading-snug text-ink sm:text-3xl">
                Perhaps they are meant to be remembered.
              </p>
              <p className="mt-10 font-serif text-3xl italic leading-tight text-ink sm:text-4xl">
                I Knew You Before We Met
              </p>
              <p className="mt-3 font-serif text-lg italic text-ink-soft">
                Begin the journey.
              </p>
              <div className="mt-8">
                <Link
                  href={`/books/${book.slug}/chapter-1`}
                  className="inline-flex items-center justify-center rounded-[2px] bg-ink px-8 py-3.5 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Start Reading
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </>
    ) : null}

    <Container className="pb-16">
      <div className="mx-auto max-w-3xl border-t border-line pt-8 text-center">
        <Link
          href="/library"
          className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink"
        >
          Back to the Library
        </Link>
      </div>
    </Container>
    </>
  );
}
