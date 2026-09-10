import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { START_READING_HREF } from "@/lib/nav";

/** The homepage hero leads with the reading room's purpose, in the serif
    voice — not a generic headline-and-two-buttons block. */
export function Hero({ description }: { description: string }) {
  return (
    <section className="border-b border-line">
      <Container className="max-w-3xl py-24 sm:py-32">
        <h1 className="font-serif text-4xl leading-[1.15] text-ink sm:text-5xl">
          Stories about people, memory, love, and loss — and the things we
          struggle to say aloud.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
          {description}
        </p>
        <div className="mt-10">
          <Button href={START_READING_HREF}>Start Reading</Button>
        </div>
      </Container>
    </section>
  );
}
