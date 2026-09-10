import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { ChapterIndicator } from "@/components/reader/ChapterIndicator";
import { ManuscriptContent } from "@/components/reader/ManuscriptContent";
import { ReaderNav } from "@/components/reader/ReaderNav";
import { CompletionArea } from "@/components/reader/CompletionArea";
import {
  getReaderBook,
  getBookSequence,
  getSectionContent,
  type ReaderMapRow,
} from "@/lib/data/reader";
import { getSiteSettings } from "@/lib/data/site";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string; section: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, section } = await params;
  const [book, settings] = await Promise.all([
    getReaderBook(slug),
    getSiteSettings(),
  ]);
  if (!book) return { title: { absolute: `Not found â€” ${settings.siteName}` } };
  const sequence = await getBookSequence(book.id);
  const current = sequence.find((r) => r.path_segment === section);
  if (!current) return { title: { absolute: `Not found â€” ${settings.siteName}` } };

  const title = `${current.label} â€” ${book.title} â€” ${settings.siteName}`;
  return {
    title: { absolute: title },
    description: `${current.label} of ${book.title} by ${settings.authorName}.`,
    alternates: { canonical: `/books/${book.slug}/${current.path_segment}` },
    openGraph: {
      type: "article",
      siteName: settings.siteName,
      title,
      url: `/books/${book.slug}/${current.path_segment}`,
    },
  };
}

/** The generated Contents page: a linked list of the actual chapters, taken
    from the view (never independently numbered). */
function ContentsView({
  slug,
  sequence,
}: {
  slug: string;
  sequence: ReaderMapRow[];
}) {
  const chapters = sequence.filter((r) => r.kind === "chapter");
  return (
    <ol className="mt-10 divide-y divide-line border-y border-line">
      {chapters.map((c) => (
        <li key={c.path_segment}>
          <Link
            href={`/books/${slug}/${c.path_segment}`}
            className="flex items-baseline gap-4 py-4 transition-colors hover:text-ink"
          >
            <span className="w-16 shrink-0 font-sans text-sm text-ink-soft">
              {c.chapter_number}
            </span>
            <span className="font-serif text-lg text-ink">{c.title}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export default async function SectionPage({ params }: Params) {
  const { slug, section } = await params;
  const book = await getReaderBook(slug);
  if (!book) notFound();

  const sequence = await getBookSequence(book.id);
  const current = sequence.find((r) => r.path_segment === section);
  if (!current) notFound();

  const isContents = current.kind === "contents";
  const sectionData = isContents ? null : await getSectionContent(book.id, section);
  if (!isContents && !sectionData) notFound();

  const isEndOfBook = current.next_path_segment === null;

  return (
    <ReaderShell slug={book.slug} title={book.title} coverUrl={book.cover_url}>
      <article>
        <header>
          <Link
            href={`/books/${book.slug}`}
            className="font-sans text-sm text-ink-soft underline decoration-ink-soft/30 underline-offset-4 transition-colors hover:text-ink"
          >
            {book.title}
          </Link>
          <div className="mt-6">
            <ChapterIndicator row={current} />
            <h1 className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl">
              {sectionData?.title ?? current.label}
            </h1>
          </div>
        </header>

        <div className="mt-10">
          {isContents ? (
            <ContentsView slug={book.slug} sequence={sequence} />
          ) : sectionData?.content ? (
            <ManuscriptContent content={sectionData.content} />
          ) : (
            <p className="font-serif text-lg italic text-ink-soft">
              This section has no text yet.
            </p>
          )}
        </div>

        <ReaderNav slug={book.slug} row={current} />

        {isEndOfBook &&
        (current.kind === "chapter" || current.kind === "epilogue") ? (
          <CompletionArea slug={book.slug} />
        ) : null}
      </article>
    </ReaderShell>
  );
}
