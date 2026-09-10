import Link from "next/link";
import type { ReaderMapRow } from "@/lib/data/reader";

/*
  Navigation is driven entirely by the view's prev/next fields. When prev is
  null the section is the first, so Previous points back to the cover (book
  root). When next is null the book has ended, so no Next is shown — the
  completion area handles the ending instead.
*/
export function ReaderNav({
  slug,
  row,
}: {
  slug: string;
  row: ReaderMapRow;
}) {
  const prevHref = row.prev_path_segment
    ? `/books/${slug}/${row.prev_path_segment}`
    : `/books/${slug}`;
  const prevLabel = row.prev_path_segment ? row.prev_label : "Cover";

  return (
    <nav
      aria-label="Reading navigation"
      className="mt-16 flex items-center justify-between gap-4 border-t border-line pt-8"
    >
      <Link
        href={prevHref}
        rel="prev"
        className="group max-w-[45%] font-sans text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <span className="block text-xs text-ink-soft">Previous</span>
        <span className="mt-1 block truncate text-ink">← {prevLabel}</span>
      </Link>

      {row.next_path_segment ? (
        <Link
          href={`/books/${slug}/${row.next_path_segment}`}
          rel="next"
          className="group max-w-[45%] text-right font-sans text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <span className="block text-xs text-ink-soft">Next</span>
          <span className="mt-1 block truncate text-ink">
            {row.next_label} →
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
