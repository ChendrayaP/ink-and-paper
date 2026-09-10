import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AuthorNote } from "@/components/home/AuthorNote";
import { getSiteSettings } from "@/lib/data/site";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    absoluteTitle: (s) => `About ${s.authorName} — ${s.siteName}`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const { authorName } = await getSiteSettings();

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <p className="font-sans text-sm tracking-[0.18em] text-ink-soft">
          About the Author
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          {authorName}
        </h1>

        <div className="mt-12">
          <AuthorNote size="large" />
        </div>

        <div className="mt-16 border-t border-line pt-10">
          <p className="max-w-prose text-base leading-relaxed text-ink-soft">
            New books are added to the Library as they are ready. If a story
            stays with you, you are always welcome to leave a note for the
            author from the last page of any book.
          </p>
        </div>
      </Container>
    </section>
  );
}
