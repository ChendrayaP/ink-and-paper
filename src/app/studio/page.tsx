import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardStats } from "@/lib/studio/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Studio — INK & PAPER" },
  robots: { index: false, follow: false },
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line bg-paper-raised p-5">
      <div className="font-serif text-3xl text-ink">{value}</div>
      <div className="mt-1 font-sans text-sm text-ink-soft">{label}</div>
    </div>
  );
}

export default async function StudioHome() {
  const s = await getDashboardStats();
  return (
    <div>
      <h1 className="font-serif text-3xl leading-tight text-ink">Welcome back.</h1>
      <p className="mt-2 font-sans text-sm text-ink-soft">
        Your private control center for INK &amp; PAPER.
      </p>

      {s.pendingSubmissions > 0 ? (
        <Link
          href="/studio/testimonials"
          className="mt-8 flex items-center justify-between gap-4 border-l-2 border-accent bg-accent/5 px-5 py-4 transition-colors hover:bg-accent/10"
        >
          <span className="font-sans text-sm text-ink">
            {s.pendingSubmissions}{" "}
            {s.pendingSubmissions === 1 ? "reader note" : "reader notes"} awaiting
            review
          </span>
          <span className="font-sans text-sm text-accent">Review →</span>
        </Link>
      ) : null}

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Stat label="Total books" value={s.totalBooks} />
        <Stat label="Published" value={s.publishedBooks} />
        <Stat label="Drafts" value={s.draftBooks} />
        <Stat label="Testimonials" value={s.totalTestimonials} />
        <Stat label="Pending submissions" value={s.pendingSubmissions} />
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/studio/books"
          className="inline-flex items-center justify-center rounded-[2px] bg-ink px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:opacity-90"
        >
          Manage books
        </Link>
        <Link
          href="/studio/testimonials"
          className="inline-flex items-center justify-center rounded-[2px] border border-line px-5 py-2.5 font-sans text-sm text-ink transition-colors hover:border-ink"
        >
          Testimonials
        </Link>
        <Link
          href="/studio/settings"
          className="inline-flex items-center justify-center rounded-[2px] border border-line px-5 py-2.5 font-sans text-sm text-ink transition-colors hover:border-ink"
        >
          Site settings
        </Link>
      </div>
    </div>
  );
}
