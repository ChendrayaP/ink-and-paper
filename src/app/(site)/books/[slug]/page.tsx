import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BookCover } from "@/components/books/BookCover";
import { getReaderBook, getBookSequence } from "@/lib/data/reader";
import { getSiteSettings } from "@/lib/data/site";
import { OG_IMAGE_DEFAULT, OG_IMAGE_DIMENSIONS, absoluteUrl } from "@/lib/seo";
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
  const ogImage = book.cover_url
    ? [{ url: absoluteUrl(book.cover_url), alt: book.title }]
    : [{ url: OG_IMAGE_DEFAULT, ...OG_IMAGE_DIMENSIONS, alt: settings.siteName }];
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

        <div className="mt-14 border-t border-line pt-8">
          <Link
            href="/library"
            className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink"
          >
            Back to the Library
          </Link>
        </div>
      </div>
    </Container>
  );
}
