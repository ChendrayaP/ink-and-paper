import { Fragment } from "react";

/*
  Renders manuscript text EXACTLY as stored — no rewriting, summarising, or
  Markdown interpretation. Blank lines separate paragraphs; single line breaks
  within a paragraph are preserved (so poetry and deliberate breaks survive).
  React escapes all text, so content is shown literally and safely.
*/
export function ManuscriptContent({ content }: { content: string }) {
  const paragraphs = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-6 font-serif text-[1.15rem] leading-[1.85] text-ink">
      {paragraphs.map((block, i) => (
        <p key={i}>
          {block.split("\n").map((line, j, arr) => (
            <Fragment key={j}>
              {line}
              {j < arr.length - 1 ? <br /> : null}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
