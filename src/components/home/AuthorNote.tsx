import { AUTHOR_NOTE_PARAGRAPHS } from "@/lib/content";

/** Renders the author's note. `size` lets the About page show it larger. */
export function AuthorNote({ size = "base" }: { size?: "base" | "large" }) {
  const cls =
    size === "large"
      ? "font-serif text-xl leading-relaxed text-ink sm:text-2xl"
      : "font-serif text-lg leading-relaxed text-ink";
  return (
    <div className="max-w-prose space-y-6">
      {AUTHOR_NOTE_PARAGRAPHS.map((para, i) => (
        <p key={i} className={cls} style={{ whiteSpace: "pre-line" }}>
          {para}
        </p>
      ))}
    </div>
  );
}
