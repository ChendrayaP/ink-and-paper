import Link from "next/link";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: "published" | "draft" }) {
  return (
    <span
      className={cn(
        "inline-block rounded-[2px] px-2 py-0.5 font-sans text-xs font-medium tracking-wide",
        status === "published"
          ? "bg-ink text-paper"
          : "border border-line text-ink-soft",
      )}
    >
      {status === "published" ? "PUBLISHED" : "DRAFT"}
    </span>
  );
}

export function SourceBadge({ source }: { source: "author" | "reader_submission" }) {
  return (
    <span
      className={cn(
        "inline-block rounded-[2px] px-2 py-0.5 font-sans text-xs font-medium tracking-wide",
        source === "reader_submission"
          ? "bg-accent/10 text-accent"
          : "border border-line text-ink-soft",
      )}
    >
      {source === "reader_submission" ? "READER SUBMISSION" : "AUTHOR"}
    </span>
  );
}

export function PageHeading({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl leading-tight text-ink">{title}</h1>
        {children ? (
          <p className="mt-1 font-sans text-sm text-ink-soft">{children}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-sans text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-ink"
    >
      ← {children}
    </Link>
  );
}
