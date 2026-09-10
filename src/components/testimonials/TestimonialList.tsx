import { cn } from "@/lib/utils";
import type { TestimonialView } from "@/lib/data/testimonials";

function Attribution({ t }: { t: TestimonialView }) {
  const meta = [t.bookTitle ? `A reader of ${t.bookTitle}` : null, t.location]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="mt-5 flex items-center gap-4">
      {t.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={t.photoUrl}
          alt={t.name}
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
      ) : null}
      <div>
        <p className="font-sans text-sm font-medium text-ink">{t.name}</p>
        {meta ? (
          <p className="mt-0.5 font-sans text-sm text-ink-soft">{meta}</p>
        ) : null}
      </div>
    </div>
  );
}

/** One testimonial. Featured ones are larger and more prominent. */
export function Testimonial({ t }: { t: TestimonialView }) {
  return (
    <figure className={cn(t.featured ? "" : "")}>
      <blockquote
        className={cn(
          "font-serif leading-relaxed text-ink",
          t.featured ? "text-2xl sm:text-3xl" : "text-lg",
        )}
      >
        {t.message}
      </blockquote>
      <figcaption>
        <Attribution t={t} />
      </figcaption>
    </figure>
  );
}

/** Featured testimonials stacked prominently; the rest in a calm two-column
    layout on wider screens. No ratings, no boxed review cards. */
export function TestimonialList({ items }: { items: TestimonialView[] }) {
  const featured = items.filter((t) => t.featured);
  const regular = items.filter((t) => !t.featured);

  return (
    <div className="space-y-16">
      {featured.length > 0 ? (
        <div className="space-y-14 border-y border-line py-14">
          {featured.map((t) => (
            <Testimonial key={t.id} t={t} />
          ))}
        </div>
      ) : null}

      {regular.length > 0 ? (
        <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2">
          {regular.map((t) => (
            <Testimonial key={t.id} t={t} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
