import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-24 sm:py-32">
          <Container className="max-w-xl">
            <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
              This page seems to have wandered off.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              The page you were looking for isn’t here. Let’s find you something
              to read instead.
            </p>
            <div className="mt-8">
              <Button href="/library">Go to the Library</Button>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
