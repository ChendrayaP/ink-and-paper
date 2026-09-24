/**
 * Renders one or more JSON-LD objects as a <script type="application/ld+json">.
 * `<` is escaped so a value can never break out of the script element.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
