import Link from "next/link";
import { BookCover } from "@/components/books/BookCover";

/*
  A small, secondary reminder of the current book's cover, shown ONLY on
  large screens (hidden below lg). It is sticky, never overlaps the manuscript,
  and links back to the book's beginning. The manuscript keeps its comfortable
  measure regardless.
*/
export function DesktopCoverSidebar({
  slug,
  title,
  coverUrl,
}: {
  slug: string;
  title: string;
  coverUrl: string | null;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-10">
        <Link
          href={`/books/${slug}`}
          className="group block"
          aria-label={`Back to the beginning of ${title}`}
        >
          <div className="flex h-52 items-start justify-start">
            <BookCover src={coverUrl} alt={title} className="h-full" />
          </div>
          <span className="mt-3 block font-sans text-xs text-ink-soft transition-colors group-hover:text-ink">
            {title}
          </span>
        </Link>
      </div>
    </aside>
  );
}
