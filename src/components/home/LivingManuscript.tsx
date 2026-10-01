import Link from "next/link";
import type { Book } from "@/lib/types";

type LivingTestimonial = {
  id?: string;
  message: string;
  featured?: boolean;
  authorName?: string | null;
  readerName?: string | null;
};

type SiteSettings = {
  siteName?: string | null;
  siteDescription?: string | null;
  authorName?: string | null;
};

type Props = {
  books: Book[];
  readerThoughts: LivingTestimonial[];
  settings: SiteSettings;
};

function getBookValue(book: Book, key: string) {
  return (book as unknown as Record<string, unknown>)[key];
}

function getBookTitle(book: Book) {
  return (
    (getBookValue(book, "title") as string | undefined) ??
    (getBookValue(book, "name") as string | undefined) ??
    "Untitled"
  );
}

function getBookSlug(book: Book) {
  return (getBookValue(book, "slug") as string | undefined) ?? "";
}

function getBookSubtitle(book: Book) {
  return (
    (getBookValue(book, "subtitle") as string | undefined) ??
    (getBookValue(book, "tagline") as string | undefined) ??
    ""
  );
}

function getBookCover(book: Book) {
  return (
    (getBookValue(book, "cover_url") as string | undefined) ??
    (getBookValue(book, "cover_image_url") as string | undefined) ??
    (getBookValue(book, "coverImageUrl") as string | undefined) ??
    (getBookValue(book, "cover") as string | undefined) ??
    ""
  );
}

function getReaderName(testimonial: LivingTestimonial) {
  return testimonial.authorName ?? testimonial.readerName ?? "A reader";
}

const unsaidLines = [
  "I MISS YOU.",
  "I FORGIVE YOU.",
  "I NEVER TOLD YOU.",
  "I STILL REMEMBER.",
];

export function LivingManuscript({ books, readerThoughts, settings }: Props) {
  const authorName = settings.authorName ?? "P Chendraya Perumal";
  const siteName = settings.siteName ?? "INK & PAPER";
  const description =
    settings.siteDescription ??
    "A collection of stories about memory, love, absence, becoming, and all the quiet things that live between people.";

  const featuredBook = books[0];
  const featuredTitle = featuredBook ? getBookTitle(featuredBook) : "";
  const featuredSlug = featuredBook ? getBookSlug(featuredBook) : "";
  const featuredSubtitle = featuredBook ? getBookSubtitle(featuredBook) : "";
  const featuredCover = featuredBook ? getBookCover(featuredBook) : "";

  return (
    <div className="overflow-hidden bg-paper text-ink">
      {/* ============================================================
01 / THE OPENING PAGE
============================================================ */}
<section className="relative min-h-[calc(100svh-97px)] overflow-hidden border-b border-ink/10 bg-paper py-16 sm:py-20 lg:py-24">
  {/* signature vertical ink line */}
  <div
    aria-hidden="true"
    className="absolute inset-y-0 left-[7.5%] w-px bg-accent/30"
  />

  {/* oversized folio number */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute right-[6%] top-[10%] select-none font-display text-[clamp(8rem,18vw,18rem)] font-medium leading-none tracking-[-0.08em] text-ink/[0.035]"
  >
    01
  </div>

  <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
    <div className="grid min-h-[calc(100svh-145px)] items-center gap-12 lg:grid-cols-[0.6fr_1.65fr_0.75fr] lg:gap-8">

      {/* LEFT — editorial information */}
      <div className="hidden self-center lg:block">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-accent" />
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.25em] text-accent">
            01 / The opening page
          </p>
        </div>

        <p className="mt-8 max-w-[190px] font-serif text-base leading-[1.75] text-ink-soft">
          Stories written for the moments that remain long after the page has been turned.
        </p>

        <div className="mt-12 space-y-2 font-sans text-[0.52rem] uppercase tracking-[0.2em] text-ink-soft/65">
          <p>Est. 2026</p>
          <p>Written by P Chendraya Perumal</p>
        </div>
      </div>

      {/* CENTRE — the statement */}
      <div className="relative">
        <p className="font-sans text-[0.62rem] uppercase tracking-[0.34em] text-accent">
          {siteName}
        </p>

        <h1 className="mt-7 max-w-[900px] font-display text-[clamp(4rem,8vw,8.9rem)] font-medium leading-[0.82] tracking-[-0.055em]">
          Stories for
          <br />
          the things
          <br />
          <span className="text-ink-soft">
            we never say.
          </span>
        </h1>

        <div className="mt-12 grid max-w-[760px] gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex gap-4">
            <span
              aria-hidden="true"
              className="mt-1 h-16 w-px shrink-0 bg-accent"
            />

            <p className="max-w-[470px] font-serif text-xl leading-[1.65] text-ink-soft sm:text-2xl">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-5 sm:pb-1">
            <Link
              href="/library"
              className="group inline-flex items-center gap-5 bg-ink px-7 py-4 font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-soft"
            >
              Enter the stories
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <span className="hidden font-sans text-[0.55rem] uppercase tracking-[0.2em] text-ink-soft/65 sm:inline">
              Scroll to begin
            </span>
          </div>
        </div>

        <div className="mt-14 flex items-center gap-4 font-sans text-[0.55rem] uppercase tracking-[0.22em] text-ink-soft/60">
          <span className="h-px w-12 bg-ink/20" />
          <span>A literary house</span>
          <span>•</span>
          <span>Books &amp; words</span>
        </div>
      </div>

      {/* RIGHT — the manuscript object */}
      <div
        aria-hidden="true"
        className="relative hidden h-[390px] lg:block"
      >
        {/* back page */}
        <div className="absolute right-2 top-10 h-[300px] w-[205px] rotate-[5deg] border border-ink/10 bg-paper-dark/30" />

        {/* middle page */}
        <div className="absolute right-7 top-5 h-[310px] w-[205px] rotate-[2deg] border border-ink/15 bg-paper" />

        {/* front manuscript page */}
        <div className="absolute right-12 top-0 h-[320px] w-[205px] -rotate-[2deg] border border-ink/15 bg-paper px-6 py-7 shadow-[0_24px_60px_rgba(0,0,0,0.07)]">
          <div className="flex items-center justify-between font-sans text-[0.42rem] uppercase tracking-[0.2em] text-ink-soft/55">
            <span>INK &amp; PAPER</span>
            <span>01</span>
          </div>

          <div className="mt-8 h-px bg-ink/10" />

          <div className="mt-8 space-y-3">
            <span className="block h-px w-12 bg-accent/60" />
            <span className="block h-px w-full bg-ink/10" />
            <span className="block h-px w-[88%] bg-ink/10" />
            <span className="block h-px w-[94%] bg-ink/10" />
            <span className="block h-px w-[72%] bg-ink/10" />
          </div>

          <p className="mt-12 font-display text-[1.45rem] leading-[0.95] tracking-[-0.03em] text-ink-soft">
            Some stories
            <br />
            refuse to
            <br />
            disappear.
          </p>

          <div className="absolute bottom-7 left-6 right-6 flex items-center justify-between font-sans text-[0.4rem] uppercase tracking-[0.18em] text-ink-soft/50">
            <span>P. Chendraya Perumal</span>
            <span>01</span>
          </div>
        </div>

        {/* small red manuscript mark */}
        <span className="absolute bottom-8 right-4 h-12 w-px bg-accent" />
      </div>
    </div>
  </div>

  {/* mobile folio */}
  <div
    aria-hidden="true"
    className="absolute bottom-5 right-6 font-sans text-[0.5rem] uppercase tracking-[0.25em] text-ink-soft/50 lg:hidden"
  >
    01 / 01
  </div>
</section>

      {/* ============================================================
          03 / THE STORIES
      ============================================================ */}
      <section className="relative border-b border-ink/10 py-24 sm:py-32 lg:py-36">
        <div aria-hidden="true" className="absolute inset-y-0 left-[7.5%] w-px bg-accent/25" />
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
          <div className="flex items-end justify-between gap-8 border-b border-ink/15 pb-8">
            <div>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-accent">03 / The stories</p>
              <h2 className="mt-4 font-display text-[clamp(3.4rem,6.5vw,7rem)] font-medium leading-[0.88] tracking-[-0.05em]">Enter a story.</h2>
            </div>
            <Link href="/library" className="hidden pb-2 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft underline decoration-ink-soft/40 underline-offset-8 hover:text-ink sm:block">View the library ↗</Link>
          </div>

          {featuredBook ? (
            <article className="group relative grid items-center gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:py-28">
              <div className="relative mx-auto w-full max-w-[440px] lg:mx-0">
                <div aria-hidden="true" className="absolute -inset-7 border border-ink/10 transition-transform duration-700 group-hover:rotate-[1deg] group-hover:scale-[1.015]" />
                <div aria-hidden="true" className="absolute -bottom-5 -right-5 h-16 w-16 border-b border-r border-accent/60" />
                <div className="relative aspect-[2/3] overflow-hidden bg-ink/5 shadow-[0_35px_90px_rgba(0,0,0,0.14)]">
                  {featuredCover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={featuredCover} alt={featuredTitle} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.025]" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-ink px-10 text-center text-paper"><span className="font-display text-4xl">{featuredTitle}</span></div>
                  )}
                  <span className="absolute left-5 top-5 bg-paper/90 px-3 py-2 font-sans text-[0.55rem] uppercase tracking-[0.2em]">01 / First edition</span>
                </div>
              </div>

              <div className="relative max-w-3xl lg:pb-4">
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.25em] text-accent">A story by {authorName}</p>
                <h3 className="mt-5 font-display text-[clamp(3.2rem,6vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em]">{featuredTitle}</h3>
                {featuredSubtitle ? <p className="mt-7 max-w-2xl font-serif text-xl leading-[1.7] text-ink-soft sm:text-2xl">{featuredSubtitle}</p> : null}
                {featuredSlug ? <Link href={`/books/${featuredSlug}`} className="mt-10 inline-flex items-center gap-4 border-b border-ink/30 pb-3 font-sans text-[0.62rem] uppercase tracking-[0.2em] transition-colors hover:border-ink">Open this story <span aria-hidden="true">↗</span></Link> : null}

                <div className="mt-14 grid grid-cols-2 gap-5 border-t border-ink/10 pt-6 text-[0.56rem] uppercase tracking-[0.18em] text-ink-soft/65 sm:grid-cols-3">
                  <div><span className="block text-accent">01</span><span className="mt-2 block">The beginning</span></div>
                  <div><span className="block text-accent">02</span><span className="mt-2 block">The feeling</span></div>
                  <div className="hidden sm:block"><span className="block text-accent">03</span><span className="mt-2 block">The memory</span></div>
                </div>
              </div>
            </article>
          ) : null}

          {books.length > 1 ? (
            <div className="grid gap-10 border-t border-ink/10 pt-12 md:grid-cols-2">
              {books.slice(1).map((book, index) => {
                const title = getBookTitle(book);
                const slug = getBookSlug(book);
                const subtitle = getBookSubtitle(book);
                const cover = getBookCover(book);
                return (
                  <article key={slug || `${title}-${index + 1}`} className="group grid gap-7 sm:grid-cols-[170px_1fr] sm:items-center">
                    <div className="relative mx-auto w-full max-w-[170px] sm:mx-0">
                      <div className="relative aspect-[2/3] overflow-hidden bg-ink/5 shadow-[0_20px_45px_rgba(0,0,0,0.1)]">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cover} alt={title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                        ) : <div className="flex h-full items-center justify-center bg-ink px-5 text-center text-paper"><span className="font-display text-xl">{title}</span></div>}
                      </div>
                    </div>
                    <div>
                      <p className="font-sans text-[0.56rem] uppercase tracking-[0.22em] text-accent">0{index + 2} / Another story</p>
                      <h3 className="mt-3 font-display text-3xl font-medium leading-[0.95] tracking-[-0.025em] sm:text-4xl">{title}</h3>
                      {subtitle ? <p className="mt-4 font-serif leading-relaxed text-ink-soft">{subtitle}</p> : null}
                      {slug ? <Link href={`/books/${slug}`} className="mt-6 inline-flex border-b border-ink/25 pb-2 font-sans text-[0.58rem] uppercase tracking-[0.18em] hover:border-ink">Open ↗</Link> : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          <div className="mt-12 sm:hidden"><Link href="/library" className="font-sans text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft underline underline-offset-8">View the complete library ↗</Link></div>
        </div>
      </section>

      {/* ============================================================
          04 / THE UNSAID
      ============================================================ */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-ink py-24 text-paper sm:py-32 lg:py-40">
        <div aria-hidden="true" className="absolute inset-y-0 left-[7.5%] w-px bg-accent/70" />
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
          <div className="flex items-start justify-between gap-10">
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-paper/45">04 / The unsaid</p>
            <p className="hidden max-w-[220px] font-serif text-sm leading-[1.65] text-paper/45 sm:block">Perhaps every reader arrives carrying a sentence of their own.</p>
          </div>

          <div className="mt-16 sm:mt-24">
            {unsaidLines.map((line, index) => (
              <div key={line} className="group grid grid-cols-[30px_1fr] items-baseline border-b border-paper/10 py-5 sm:grid-cols-[55px_1fr] sm:py-8">
                <span className="font-sans text-[0.55rem] tracking-[0.18em] text-accent">0{index + 1}</span>
                <p className="font-display text-[clamp(2.4rem,6.8vw,7.5rem)] font-medium leading-[0.86] tracking-[-0.045em] text-paper/90 transition-transform duration-500 group-hover:translate-x-3">{line}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-8 sm:mt-20 sm:grid-cols-[1fr_0.75fr] sm:items-end">
            <p className="max-w-3xl font-serif text-xl leading-[1.8] text-paper/65 sm:text-2xl">Every story begins somewhere. Sometimes with a person. Sometimes with a memory. Sometimes with the words we could never say aloud.</p>
            <p className="font-display text-2xl italic leading-tight text-paper/75 sm:text-3xl">What would you write in the margin?</p>
          </div>
        </div>
      </section>

      {/* ============================================================
05 / THE LETTER
============================================================ */}
<section className="relative border-b border-ink/10 bg-paper py-28 sm:py-36 lg:py-44">
  <div
    aria-hidden="true"
    className="absolute inset-y-0 left-[7.5%] w-px bg-accent/25"
  />

  <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
    <div className="grid gap-14 lg:grid-cols-[0.42fr_1.58fr] lg:gap-24">
      
      {/* Section marker */}
      <div className="relative">
        <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-accent">
          05 / The Letter
        </p>

        <div className="mt-8 hidden h-px w-16 bg-ink/20 lg:block" />

        <p className="mt-8 max-w-[220px] font-serif text-lg leading-[1.7] text-ink-soft">
          Some words are written for the page.
          <br />
          Some are written for the person
          <br />
          holding it.
        </p>

        <p className="mt-10 font-sans text-[0.55rem] uppercase tracking-[0.2em] text-ink-soft/70">
          A quiet note
        </p>
      </div>

      {/* Letter */}
      <div className="relative max-w-5xl">
        
        {/* Heading */}
        <div className="relative">
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-accent">
            From the desk of the author
          </p>

          <span
            aria-hidden="true"
            className="absolute -right-2 -top-8 hidden font-display text-[7rem] leading-none text-ink/[0.035] lg:block"
          >
            05
          </span>

          <h2 className="mt-5 max-w-3xl font-display text-[clamp(3.4rem,6vw,6.8rem)] font-medium leading-[0.86] tracking-[-0.055em]">
            A letter
            <br />
            <span className="text-ink-soft">from the author.</span>
          </h2>
        </div>

        {/* Letter sheet */}
        <div className="relative mt-14 sm:mt-20">
          
          {/* Offset paper edge */}
          <div
            aria-hidden="true"
            className="absolute inset-3 -translate-x-3 translate-y-3 border border-accent/20"
          />

          <div className="relative border border-ink/15 bg-paper px-7 py-9 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
            
            {/* Letter metadata */}
            <div className="flex flex-col gap-5 border-b border-ink/10 pb-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-sans text-[0.55rem] uppercase tracking-[0.22em] text-ink-soft/70">
                  A personal note
                </p>

                <p className="mt-2 font-serif text-lg text-ink">
                  For the reader who stayed.
                </p>
              </div>

              <div className="sm:text-right">
                <p className="font-sans text-[0.55rem] uppercase tracking-[0.2em] text-ink-soft/70">
                  INK &amp; PAPER
                </p>

                <p className="mt-2 font-serif text-sm italic text-ink-soft">
                  2026
                </p>
              </div>
            </div>

            {/* Letter body */}
            <div className="mt-10 grid gap-10 lg:grid-cols-[0.28fr_1fr] lg:gap-14">
              
              {/* Margin detail */}
              <div className="hidden lg:block">
                <p className="font-display text-xl italic leading-[1.25] text-ink-soft">
                  A quiet
                  <br />
                  note.
                </p>

                <div className="mt-8 h-24 w-px bg-accent/40" />

                <p className="mt-6 max-w-[130px] font-sans text-[0.52rem] uppercase leading-[1.7] tracking-[0.16em] text-ink-soft/60">
                  Written slowly.
                  <br />
                  Read closely.
                </p>
              </div>

              {/* Actual letter */}
              <div className="max-w-3xl">
                <p className="font-display text-2xl italic text-ink sm:text-3xl">
                  Dear Reader,
                </p>

                <div className="mt-8 border-l border-accent pl-6 sm:pl-8">
                  <p className="font-serif text-[clamp(1.35rem,2.1vw,2rem)] leading-[1.65] text-ink">
                    Thank you for stepping into these pages. I hope somewhere
                    between the words, you find a memory, a feeling, or a part
                    of yourself that you had almost forgotten.
                  </p>
                </div>

                <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-display text-2xl italic text-ink-soft">
                      — {authorName}
                    </p>

                    <p className="mt-2 font-sans text-[0.52rem] uppercase tracking-[0.2em] text-ink-soft/60">
                      Author · Storyteller
                    </p>
                  </div>

                  <Link
                    href="/about"
                    className="inline-flex w-fit items-center gap-4 border-b border-ink/25 pb-2 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    Read the full letter
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom editorial note */}
        <div className="mt-10 flex items-center justify-between border-t border-ink/10 pt-5">
          <p className="font-sans text-[0.52rem] uppercase tracking-[0.2em] text-ink-soft/60">
            Written in ink. Kept in paper.
          </p>

          <p className="font-display text-sm italic text-ink-soft">
            Keep reading.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
      <section className="relative border-b border-ink/10 bg-paper-dark/30 py-24 sm:py-32 lg:py-36">
        <div aria-hidden="true" className="absolute inset-y-0 right-[7.5%] w-px bg-accent/20" />
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
            <div>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-accent">06 / The margins</p>
              <p className="mt-8 max-w-[210px] font-serif text-base leading-[1.7] text-ink-soft">The most meaningful part of a book is sometimes what the reader writes beside it.</p>
            </div>

            <div>
              <h2 className="font-display text-[clamp(3.5rem,6.5vw,7rem)] font-medium leading-[0.87] tracking-[-0.05em]">The margins.</h2>
              {readerThoughts.length > 0 ? (
                <div className="mt-14 grid gap-0 border-t border-ink/15">
                  {readerThoughts.slice(0, 3).map((thought, index) => (
                    <blockquote key={thought.id ?? index} className="relative grid gap-5 border-b border-ink/15 py-9 sm:grid-cols-[70px_1fr] sm:gap-8 sm:py-12">
                      <span className="font-sans text-[0.55rem] uppercase tracking-[0.18em] text-accent">0{index + 1}</span>
                      <div>
                        <p className="font-display text-[clamp(1.9rem,3.6vw,3.8rem)] font-medium leading-[1] tracking-[-0.03em]">“{thought.message}”</p>
                        <footer className="mt-5 font-sans text-[0.58rem] uppercase tracking-[0.18em] text-ink-soft">— {getReaderName(thought)}</footer>
                      </div>
                    </blockquote>
                  ))}
                </div>
              ) : (
                <div className="mt-14 border-t border-ink/15 py-10"><p className="font-serif text-xl text-ink-soft">The margins are waiting for your words.</p></div>
              )}
              <Link href="/testimonials" className="mt-8 inline-flex items-center gap-4 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft underline underline-offset-8">Read the reader notes <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          07 / THE AUTHOR'S DESK
      ============================================================ */}
      <section className="relative border-b border-ink/10 py-24 sm:py-32 lg:py-36">
        <div aria-hidden="true" className="absolute inset-y-0 left-[7.5%] w-px bg-accent/20" />
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-accent">07 / The author's desk</p>
              <h2 className="mt-5 max-w-5xl font-display text-[clamp(3.4rem,7vw,7.5rem)] font-medium leading-[0.84] tracking-[-0.055em]">The desk is<br /><span className="text-ink-soft">never quiet.</span></h2>
            </div>
            <p className="max-w-sm font-serif text-lg leading-[1.75] text-ink-soft">New stories begin as fragments. A sentence. A memory. A page written too late at night.</p>
          </div>

          <div className="mt-16 grid gap-px border border-ink/10 bg-ink/10 md:grid-cols-3">
            <Link href="/library" className="group min-h-[270px] bg-paper p-8 transition-colors duration-500 hover:bg-ink hover:text-paper sm:p-10">
              <span className="font-sans text-[0.55rem] tracking-[0.2em] text-accent">01</span>
              <h3 className="mt-20 font-display text-4xl font-medium">The Books</h3>
              <p className="mt-4 max-w-xs font-serif leading-relaxed text-ink-soft group-hover:text-paper/65">Enter the complete library.</p>
              <span className="mt-8 block font-sans text-[0.58rem] uppercase tracking-[0.18em]">Explore ↗</span>
            </Link>
            <Link href="/about" className="group min-h-[270px] bg-paper p-8 transition-colors duration-500 hover:bg-ink hover:text-paper sm:p-10">
              <span className="font-sans text-[0.55rem] tracking-[0.2em] text-accent">02</span>
              <h3 className="mt-20 font-display text-4xl font-medium">The Author</h3>
              <p className="mt-4 max-w-xs font-serif leading-relaxed text-ink-soft group-hover:text-paper/65">Meet the person behind the pages.</p>
              <span className="mt-8 block font-sans text-[0.58rem] uppercase tracking-[0.18em]">Read the letter ↗</span>
            </Link>
            <a href="https://www.instagram.com/author.pchendraya/" target="_blank" rel="noopener noreferrer" className="group min-h-[270px] bg-paper p-8 transition-colors duration-500 hover:bg-ink hover:text-paper sm:p-10">
              <span className="font-sans text-[0.55rem] tracking-[0.2em] text-accent">03</span>
              <h3 className="mt-20 font-display text-4xl font-medium">Instagram</h3>
              <p className="mt-4 max-w-xs font-serif leading-relaxed text-ink-soft group-hover:text-paper/65">A glimpse beyond the page.</p>
              <span className="mt-8 block font-sans text-[0.58rem] uppercase tracking-[0.18em]">Visit the desk ↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          08 / THE LAST PAGE
      ============================================================ */}
      <section className="relative flex min-h-[78svh] items-center py-24 sm:min-h-[82svh] sm:py-32 lg:py-40">
        <div aria-hidden="true" className="absolute inset-y-0 left-[7.5%] w-px bg-accent/55" />
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20">
          <div className="grid items-end gap-16 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-accent">08 / The last page</p>
              <h2 className="mt-7 font-display text-[clamp(4rem,8.5vw,9rem)] font-medium leading-[0.82] tracking-[-0.06em]">There are<br />more stories<br /><span className="text-ink-soft">to tell.</span></h2>
              <div className="mt-12 flex flex-wrap items-center gap-7">
                <Link href="/library" className="inline-flex items-center gap-5 bg-ink px-7 py-4 font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-paper transition-transform duration-300 hover:-translate-y-1">Enter the library <span aria-hidden="true">↗</span></Link>
                <span className="font-display text-xl italic text-ink-soft">Take your time.</span>
              </div>
            </div>

            <div className="border-l border-accent/50 pl-7 lg:pb-4 lg:pl-10">
              <p className="font-sans text-[0.56rem] uppercase tracking-[0.2em] text-ink-soft/60">A final note</p>
              <p className="mt-5 font-serif text-xl leading-[1.75] text-ink-soft">Close the page whenever you like. The stories will still be here when you return.</p>
            </div>
          </div>

          <div className="mt-24 border-t border-ink/15 pt-8 sm:mt-32">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-sans text-xs font-medium uppercase tracking-[0.2em]">{siteName}</p>
                <p className="mt-2 font-sans text-[0.58rem] uppercase tracking-[0.16em] text-ink-soft">{authorName}</p>
              </div>
              <p className="font-display text-lg italic text-ink-soft">Written in ink. Kept in paper.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
