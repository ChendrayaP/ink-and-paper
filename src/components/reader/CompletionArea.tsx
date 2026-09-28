import Link from "next/link";
import { LeaveANote } from "@/components/reader/LeaveANote";

/*
  Shown at the end of the final chapter. Quiet and literary. The Leave-a-Note
  form (client) posts to the server route; moderation lives in the Studio (Phase 7).
*/
export function CompletionArea({ slug }: { slug: string }) {
  return (
    <section
      aria-label="You've reached the end"
      className="mt-24 border-t border-line pt-16"
    >
      <p className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-ink-soft">
        The end
      </p>
      <h2 className="mt-5 font-display text-3xl leading-tight text-ink sm:text-4xl">
        Did this story leave something with you?
      </h2>
      <p className="mt-4 max-w-prose font-serif text-lg italic leading-relaxed text-ink-soft">
        I’d love to hear it.
      </p>

      <LeaveANote slug={slug} />

      <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-10">
        <Link
          href="/library"
          className="font-sans text-sm text-ink underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:decoration-ink"
        >
          Discover another book in the Library
        </Link>
        <Link
          href={`/books/${slug}`}
          className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink"
        >
          Return to the beginning
        </Link>
      </div>
    </section>
  );
}
