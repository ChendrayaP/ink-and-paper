import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { START_READING_HREF } from "@/lib/nav";

/** The homepage hero leads with the reading room's purpose, in the serif
    voice — not a generic headline-and-two-buttons block. */
export function Hero({ description }: { description: string }) {
  return (
    <section className="border-b border-line">
      <Container className="flex min-h-[62svh] max-w-3xl flex-col justify-center py-16 sm:py-20">
        <h1 className="font-display font-medium tracking-tight text-[clamp(2.5rem,4.6vw,4.25rem)] text-ink">
          Stories about people, memory, love, and loss — and the things we
          struggle to say aloud.
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.75] text-ink-soft sm:text-lg">
          {description}
        </p>
        <div className="mt-10">
          <Button href={START_READING_HREF}>Start Reading</Button>
        </div>
      </Container>
    </section>
  );
}
