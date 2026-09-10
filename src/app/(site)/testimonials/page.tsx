import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { pageMetadata } from "@/lib/seo";
import { TESTIMONIALS_HEADING, TESTIMONIALS_SUBHEADING } from "@/lib/content";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    absoluteTitle: (s) => `${TESTIMONIALS_HEADING} — ${s.siteName}`,
    path: "/testimonials",
    description: TESTIMONIALS_SUBHEADING,
  });
}

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <header className="max-w-prose">
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {TESTIMONIALS_HEADING}
          </h1>
          <p className="mt-4 font-serif text-lg italic text-ink-soft">
            {TESTIMONIALS_SUBHEADING}
          </p>
        </header>

        <div className="mt-14">
          {testimonials.length > 0 ? (
            <TestimonialList items={testimonials} />
          ) : (
            <EmptyState>
              No reader notes have been shared yet. When readers write in, their
              words will appear here.
            </EmptyState>
          )}
        </div>
      </Container>
    </section>
  );
}
