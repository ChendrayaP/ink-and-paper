import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getPublishedBooks } from "@/lib/data/books";
import { getBookSequence } from "@/lib/data/reader";

// Revalidate on the same cadence as the public pages, so newly published
// books/sections appear without a redeploy. Reads only — no DB writes.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/library`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/testimonials`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Only PUBLISHED books are returned by the data layer, and getBookSequence
  // reads through the cookieless public client (RLS hides drafts), so no draft
  // book or draft section can ever be listed here.
  const books = await getPublishedBooks();

  const bookEntries: MetadataRoute.Sitemap = [];
  await Promise.all(
    books.map(async (book) => {
      const lastModified = book.updated_at
        ? new Date(book.updated_at)
        : undefined;

      bookEntries.push({
        url: `${base}/books/${book.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });

      const sequence = await getBookSequence(book.id);
      for (const section of sequence) {
        bookEntries.push({
          url: `${base}/books/${book.slug}/${section.path_segment}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }),
  );

  return [...staticRoutes, ...bookEntries];
}
