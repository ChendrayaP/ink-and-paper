import { Fragment } from "react";

/*
  Renders manuscript text EXACTLY as stored — no rewriting, summarising, or
  Markdown interpretation. Blank lines separate paragraphs; single line breaks
  within a paragraph are preserved (so poetry and deliberate breaks survive).
  React escapes all text, so content is shown literally and safely.
*/
export function ManuscriptContent({ content }: { content: string }) {
  const paragraphs = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  // Presentation-only: hide standalone divider lines that consist solely of
  // hyphens (the manuscript's chapter/epilogue rule, e.g. a run of "-----").
  // Stored content is never modified; the epigraph, ❤️, and all other prose,
  // punctuation, and line breaks are rendered exactly as stored.
  const isDivider = (line: string) => /^-{3,}$/.test(line.trim());
  return (
    <div className="space-y-6 font-serif text-[1.15rem] leading-[1.85] text-ink">
      {paragraphs.map((block, i) => {
        const lines = block.split("\n").filter((line) => !isDivider(line));
        if (lines.length === 0) return null;
        return (
          <p key={i}>
            {lines.map((line, j, arr) => (
              <Fragment key={j}>
                {line}
                {j < arr.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
