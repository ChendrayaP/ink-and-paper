import { cn } from "@/lib/utils";

/** Serif section heading with an optional lead-in. No all-caps eyebrow. */
export function SectionHeading({
  title,
  intro,
  className,
}: {
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-prose", className)}>
      <h2 className="font-serif text-2xl leading-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-3 text-base leading-relaxed text-ink-soft">{intro}</p>
      ) : null}
    </div>
  );
}
