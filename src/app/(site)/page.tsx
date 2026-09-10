import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Hero } from "@/components/home/Hero";
import { AuthorNote } from "@/components/home/AuthorNote";
import { BookCoversRow } from "@/components/books/BooksList";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { getHomepageBooks } from "@/lib/data/books";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { getSiteSettings } from "@/lib/data/site";
import { START_READING_HREF } from "@/lib/nav";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: { absolute: `${s.siteName} — ${s.authorName}` },
    description: s.siteDescription,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: s.siteName,
      title: `${s.siteName} — ${s.authorName}`,
      description: s.siteDescription,
      url: "/",
    },
  };
}

export default async function HomePage() {
  const [books, testimonials, settings] = await Promise.all([
    getHomepageBooks(3),
    getPublishedTestimonials(),
    getSiteSettings(),
  ]);
  const readerThoughts = testimonials.slice(0, 2);

  return (
    <>
      <Hero description={settings.siteDescription} />

      {/* Featured / latest books */}
      <section className="py-20">
        <Container>
          <SectionHeading title="From the library" />
          <div className="mt-10">
            {books.length > 0 ? (
              <>
                <BookCoversRow books={books} />
                <div className="mt-12">
                  <Button href="/library" variant="quiet">
                    See all books in the Library
                  </Button>
                </div>
              </>
            ) : (
              <EmptyState>
                The first books are being prepared for the shelf. Please visit
                again soon.
              </EmptyState>
            )}
          </div>
        </Container>
      </section>

      {/* Author introduction */}
      <section className="border-t border-line py-20">
        <Container>
          <SectionHeading title="A note from the author" />
          <div className="mt-8">
            <AuthorNote />
            <div className="mt-8">
              <Button href="/about" variant="quiet">
                More about {settings.authorName}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Reader thoughts */}
      <section className="border-t border-line py-20">
        <Container>
          <SectionHeading title="What readers say" />
          <div className="mt-10">
            {readerThoughts.length > 0 ? (
              <>
                <TestimonialList items={readerThoughts} />
                <div className="mt-12">
                  <Button href="/testimonials" variant="quiet">
                    Read more reader notes
                  </Button>
                </div>
              </>
            ) : (
              <EmptyState>
                No reader notes have been shared yet. When readers write in,
                their words will live here.
              </EmptyState>
            )}
          </div>
        </Container>
      </section>

      {/* Invitation to explore + final CTA */}
      <section className="border-t border-line">
        <Container className="max-w-3xl py-24 text-balance">
          <p className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
            Find a book. Open it. Stay a while.
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Every story here is free to read, at your own pace, in your own
            quiet.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button href={START_READING_HREF}>Start Reading</Button>
            <Link
              href="/library"
              className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink"
            >
              Browse the Library
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
