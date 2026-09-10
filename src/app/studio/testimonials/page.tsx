import type { Metadata } from "next";
import { getStudioTestimonials, getBooksForSelect } from "@/lib/studio/queries";
import { TestimonialManager } from "@/components/studio/TestimonialManager";
import { PageHeading } from "@/components/studio/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Testimonials — Studio" },
  robots: { index: false, follow: false },
};

export default async function StudioTestimonialsPage() {
  const [testimonials, books] = await Promise.all([
    getStudioTestimonials(),
    getBooksForSelect(),
  ]);
  return (
    <div>
      <PageHeading title="Testimonials">
        Reader submissions arrive unpublished. Review, then publish the ones you
        want to show.
      </PageHeading>
      <TestimonialManager testimonials={testimonials} books={books} />
    </div>
  );
}
