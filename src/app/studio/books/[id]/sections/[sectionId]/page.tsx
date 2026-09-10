import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStudioBook, getSection } from "@/lib/studio/queries";
import { SectionEditor } from "@/components/studio/SectionEditor";
import { PageHeading, BackLink } from "@/components/studio/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Edit section — Studio" },
  robots: { index: false, follow: false },
};

export default async function SectionEditorPage({
  params,
}: {
  params: Promise<{ id: string; sectionId: string }>;
}) {
  const { id, sectionId } = await params;
  const [book, section] = await Promise.all([
    getStudioBook(id),
    getSection(sectionId),
  ]);
  if (!book || !section || section.book_id !== id) notFound();
  if (section.kind === "contents") notFound(); // Contents is generated, not edited

  const LABELS: Record<string, string> = {
    acknowledgments: "Acknowledgments",
    introduction: "Introduction",
    chapter: "Chapter",
    epilogue: "Epilogue",
  };
  const label = LABELS[section.kind] ?? "Section";
  const isChapter = section.kind === "chapter";

  return (
    <div>
      <div className="mb-6">
        <BackLink href={`/studio/books/${id}`}>{book.title}</BackLink>
      </div>
      <PageHeading title={`Edit ${label}`}>
        {isChapter
          ? "The chapter number is set by its position in the book."
          : "This section is never numbered as a chapter."}
      </PageHeading>
      <SectionEditor
        bookId={id}
        section={{
          id: section.id,
          kind: section.kind,
          title: section.title,
          content: section.content ?? "",
          updatedAt: section.updated_at,
        }}
      />
    </div>
  );
}
