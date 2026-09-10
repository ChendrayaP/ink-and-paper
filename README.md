# INK & PAPER

A digital reading room for the books of **P Chendraya Perumal** — a place to
discover and read stories freely, in a calm, literary environment.

This is a fresh, independent application. It does **not** depend on, read from,
or modify any previous (Lovable) deployment. The old site can keep running
untouched until this one is approved and a custom domain is pointed here.

---

## Status — Phases 1–2 complete

**Phase 1 — foundation**

- Next.js (App Router) + TypeScript, strict mode
- Tailwind CSS v4 with the INK & PAPER design tokens (warm paper, charcoal ink,
  restrained sepia accent, serif + sans type roles)
- Self-hosted fonts (Newsreader serif, Inter sans) — no build-time network
- Supabase client factories: browser, server (cookie session), and a
  server-only service-role client
- Typed, validated environment access and `.env.example`
- Config-driven canonical URL (custom-domain ready)
- A minimal placeholder homepage that confirms the theme renders

**Phase 2 — database**

- SQL migrations under `supabase/migrations/` (enums, tables, functions, the
  `reading_sequence` view, RLS, storage, grants, seed)
- Row Level Security on every table; author authorization via `is_author()`
- Two storage buckets (`book-covers`, `testimonial-photos`), author-only writes
- Generated TypeScript types in `src/lib/database.types.ts`, wired into all
  three Supabase clients
- Apply instructions in `supabase/APPLY.md`

No book content is imported yet.

**Phase 3 — public shell**

- Header with the INK & PAPER lockup (from `site_settings`), desktop nav,
  external Instagram link, and Start Reading
- Accessible mobile menu (Escape/backdrop/nav all close it; focus managed)
- Homepage (hero, featured books, author note, reader thoughts, invitation,
  closing CTA), Library, About, Testimonials, and a friendly 404
- Full book covers rendered with object-contain — never cropped, any aspect ratio
- Data-driven throughout via a cookieless anon client (RLS-respecting, cacheable);
  graceful empty states when there is no content; no fake content in the database
- Per-page SEO metadata + canonical URLs from `NEXT_PUBLIC_SITE_URL`
- Verified: production build green, and zero horizontal overflow at 360/375/390px

A development-only, flag-gated fixtures path (`NEXT_PUBLIC_USE_DEV_FIXTURES=1`)
can render the pages populated for design review; it never writes to the database.

**Phase 4 — book reader**

- `/books/[slug]` (cover + Begin reading) and `/books/[slug]/[section]`
  (`introduction`, `contents`, `chapter-1` … `chapter-N`)
- All sequencing — order, labels, "Chapter n of N", Previous/Next — comes
  straight from the `reading_sequence` view; the frontend never recomputes it
- Front matter is never counted as a chapter; the counter is derived
- Desktop-only sticky cover sidebar; hidden on mobile (reading-first)
- Faithful manuscript rendering (no rewriting/Markdown), book-like serif column
- End-of-book completion area with a Leave-a-Note placeholder (form is Phase 5)
- Fully server-rendered (ISR); invalid/unpublished routes return the site 404
- Verified: 24/24 behaviour checks (incl. 3- and 12-chapter books, completion,
  invalid routes) and zero horizontal overflow at 360/375/390px

**Phase 5 — leave a note**

- Real form in the final-chapter completion area (Name, Note required; Photo,
  Place optional); no book selector — the book comes from the route
- Posts to `POST /api/books/[slug]/notes`, a server route that validates text
  and photo (size, type, AND magic bytes), enforces the protected values, and
  inserts through the anon client so RLS stays the backstop
- Optional photo uploaded server-side only via the service-role client
  (`lib/notes/upload.ts`, `server-only`); the browser never gets privileged keys
- Lightweight in-memory rate limit + honeypot + request-size guard
- Warm confirmation; the note is `published=false` and never appears publicly
  until the author reviews it (Studio, Phase 7)
- Verified: 22 validation unit tests, curl route tests (valid/JPEG/PNG/WebP,
  missing/whitespace/oversized/wrong-type/spoofed, honeypot, override attempts,
  invalid book, rate limit), 6 browser UI checks, and a client-bundle scan
  confirming no service-role key / admin code leaks

**Phase 6 — authentication & Studio protection**

- Public pages moved into an `app/(site)` route group (URLs unchanged) so the
  public header/footer wrap only public pages; `/auth` and `/studio` are a
  distinct private area with no public nav
- `/auth` email/password sign-in (author only; no public registration) via the
  cookie-based `@supabase/ssr` browser client
- Middleware scoped to `/studio` refreshes the session and redirects
  unauthenticated visitors to `/auth`; public pages never hit it and stay static
- `app/studio/layout.tsx` is the authoritative server gate: no session →
  `/auth`; authenticated non-author → Unauthorized view; author → Studio.
  `is_author()` (unchanged) + RLS remain the ultimate authorization
- Sign-out clears the session cookie; `/studio` responses are `no-store`
- Verified: logged-out `/studio` (and nested) → 307 `/auth`, `/auth` renders,
  all public pages 200, reader/Leave-a-Note unaffected, and the client bundle
  has no service-role key or privileged code. Build + typecheck green.
- No Phase 2 RLS/schema changes; no new dependencies.

Still to come: Phase 3 public pages, Phase 4 reader, Phase 5 Leave a Note,
Phase 6 auth, Phase 7 Studio, Phase 8 analytics, Phase 9 SEO,
Phase 10 responsive/authorization testing.

---

## Getting started

Requirements: Node.js 18.18+ (20 LTS recommended).

```bash
# 1. install dependencies
npm install

# 2. configure environment
cp .env.example .env.local
#    then edit .env.local with your Supabase URL + anon key
#    (service-role key can be added when server features arrive)

# 3. run the dev server
npm run dev
#    → http://localhost:3000
```

Useful scripts:

```bash
npm run build      # production build
npm run start      # run the production build locally
npm run typecheck  # TypeScript, no emit
```

## Where environment variables go

| Where | File / place | Contains |
| --- | --- | --- |
| Local dev | `.env.local` (git-ignored) | all values, including the service-role key |
| The repo | `.env.example` (committed) | placeholders only, never real values |
| Production | Vercel → Settings → Environment Variables | the same keys, set per environment |

`NEXT_PUBLIC_*` values are exposed to the browser and are safe to expose.
`SUPABASE_SERVICE_ROLE_KEY` is server-only and must never carry the
`NEXT_PUBLIC_` prefix or appear in client code.

## Custom domain

The canonical URL comes from `NEXT_PUBLIC_SITE_URL`. Moving from
`http://localhost:3000` to `https://inkandpaper.com` is a configuration change
only — no application code references any fixed domain.

## Project structure

```
src/
  app/
    layout.tsx        root layout: fonts + base metadata
    page.tsx          placeholder home (replaced in Phase 3)
    globals.css       Tailwind v4 import + design tokens
    fonts.ts          self-hosted font loaders
    fonts/            committed .woff2 files
  components/
    ui/Container.tsx  page content column
  lib/
    config.ts         brand constants + canonical URL
    env.ts            typed, validated env access
    types.ts          domain types (generated from schema in Phase 2)
    utils.ts          cn(), slugify()
    supabase/
      client.ts       browser client (anon)
      server.ts       server client (anon + session cookies)
      admin.ts        service-role client (server-only, RLS-bypassing)
```

## Fonts

Newsreader and Inter are self-hosted: the variable `.woff2` files live in
`src/app/fonts/` and are loaded via `next/font/local`. They were sourced from
the `@fontsource-variable/*` dev dependencies. This keeps builds offline-safe
and avoids depending on Google Fonts at runtime.


**Phase 7 — the private Studio**

The author manages all content from `/studio` with no code changes:
- Dashboard with counts (books, published, drafts, testimonials, pending
  submissions) and a "reader notes awaiting review" shortcut.
- Books: list with cover/title/subtitle/genre/status/chapter-count/updated,
  create draft, edit, publish/unpublish (with confirmations), delete (with
  storage cleanup). Publishing validates title + cover + at least one chapter.
- Book editor sections: Details, Cover (contain preview, replace, old file
  removed only after the new upload succeeds), Front matter (one Introduction;
  Contents auto-generated), Chapters (add / edit / delete / reorder via ↑↓ —
  numbers are derived from `reading_sequence`, never stored).
- Chapter/Introduction editor with a serif long-form textarea, optimistic
  concurrency (updated_at) and an unsaved-changes guard.
- Testimonials: reader submissions arrive unpublished; pending ones are
  surfaced first; publish/unpublish, feature/unfeature, edit (incl. book
  association and photo), delete. Editing never changes `source`.
- Site settings: site name, author name, description, Instagram (https),
  contact email — the single `site_settings` row. Canonical URL stays in env.

Architecture & security:
- All writes are Next.js **server actions** run as the authenticated author via
  the session client, so **Supabase RLS authorizes every write** — no
  service-role key is used anywhere in the Studio (only the Phase 5 reader-photo
  path uses admin). Verified against local Postgres: reorder/delete renumber the
  reading_sequence correctly; anon and non-authors are blocked from all writes.
- A flag-gated dev-preview (`NEXT_PUBLIC_USE_DEV_FIXTURES`) lets the Studio UI
  render without auth for local review; it is never set in production, where
  every `/studio` route enforces auth (verified: logged-out → 307 `/auth`).
- No Phase 2 schema/RLS changes. Dependency change: `@supabase/ssr` upgraded to
  0.12.7 (compatibility with supabase-js 2.116). Responsive with no horizontal
  overflow at 1024/768/390. Audio columns remain unused (no player).
