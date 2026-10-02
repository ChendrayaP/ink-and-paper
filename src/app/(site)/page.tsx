import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { websiteJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomepageBooks, getPublishedBooks } from "@/lib/data/books";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { getSiteSettings } from "@/lib/data/site";
import { LivingManuscript } from "@/components/home/LivingManuscript";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    absoluteTitle: (s) => `${s.siteName} â€” ${s.authorName}`,
    path: "/",
  });
}

export default async function HomePage() {
  const [books, allBooks, testimonials, settings] = await Promise.all([
  getHomepageBooks(3),
  getPublishedBooks(),
  getPublishedTestimonials(),
  getSiteSettings(),
]);

  const readerThoughts = testimonials.slice(0, 3);

  return (
    <>
      <JsonLd data={websiteJsonLd(settings)} />

      <LivingManuscript
  books={allBooks}
  readerThoughts={readerThoughts}
  settings={settings}
/>
    </>
  );
}



