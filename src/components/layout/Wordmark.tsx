import Link from "next/link";

/** The INK & PAPER lockup: site name over author name. Values come from
    site_settings so nothing brand-related is hard-coded. */
export function Wordmark({
  siteName,
  authorName,
  href = "/",
}: {
  siteName: string;
  authorName: string;
  href?: string;
}) {
  return (
    <Link href={href} className="group inline-block leading-none">
      <span className="block font-sans text-[1,05rem] font-medium uppercase tracking-[0.22em] text-ink">
        {siteName}
      </span>
      <span className="mt-1.5 block whitespace-nowrap font-sans text-[0.78rem] font-medium tracking-[0.12em] text-ink-soft">
  {authorName}
</span>
    </Link>
  );
}
