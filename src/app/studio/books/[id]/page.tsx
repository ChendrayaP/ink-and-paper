import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStudioBook, getBookSections } from "@/lib/studio/queries";
import { BookDetailsForm } from "@/components/studio/BookDetailsForm";
import { CoverManager } from "@/components/studio/CoverManager";
import { ChapterManager } from "@/components/studio/ChapterManager";
import { PublishPanel } from "@/components/studio/PublishPanel";
import { PageHeading, BackLink, StatusBadge } from "@/components/studio/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Edit book — Studio" },
  robots: { index: false, follow: false },
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-10">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      {description ? (
        <p className="mt-1 font-sans text-sm text-ink-soft">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function BookEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getStudioBook(id);
  if (!book) notFound();

  const sections = await getBookSections(id);
  const acknowledgments = sections.find((s) => s.kind === "acknowledgments") ?? null;
  const intro = sections.find((s) => s.kind === "introduction") ?? null;
  const hasContents = sections.some((s) => s.kind === "contents");
  const chapters = sections.filter((s) => s.kind === "chapter");
  const epilogue = sections.find((s) => s.kind === "epilogue") ?? null;

  return (
    <div>
      <div className="mb-6">
        <BackLink href="/studio/books">Books</BackLink>
      </div>
      <PageHeading
        title={book.title}
        action={<StatusBadge status={book.status} />}
      >
        {book.status === "published"
          ? "Live on the site."
          : "Draft — not visible to readers yet."}
      </PageHeading>

      <Section title="Book details">
        <BookDetailsForm
          id={book.id}
          initial={{
            title: book.title,
            subtitle: book.subtitle ?? "",
            genre: book.genre ?? "",
            description: book.description ?? "",
            updatedAt: book.updated_at,
          }}
        />
      </Section>

      <Section
        title="Cover"
        description="The entire cover is always shown to readers — never cropped."
      >
        <CoverManager bookId={book.id} initialCoverUrl={book.cover_url} />
      </Section>

      <Section
        title="Front matter & chapters"
        description="Introduction and Contents are front matter. Chapters are numbered by their order."
      >
        <ChapterManager
          bookId={book.id}
          acknowledgments={acknowledgments}
          intro={intro}
          hasContents={hasContents}
          chapters={chapters}
          epilogue={epilogue}
        />
      </Section>

      <Section title="Publishing">
        <PublishPanel id={book.id} status={book.status} />
      </Section>
    </div>
  );
}
