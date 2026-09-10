-- INK & PAPER — Phase 2
-- Core tables. No book content is inserted here; the schema only defines shape.

-- profiles: one row per authenticated user, carrying their role.
-- The author's row is elevated to role='author' manually (see apply steps).
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  role       public.app_role,
  created_at timestamptz not null default now()
);

-- books
create table public.books (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  subtitle      text,
  genre         text,
  description   text,
  cover_url     text,
  status        public.book_status not null default 'draft',
  featured      boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index books_status_idx           on public.books (status);
create index books_featured_order_idx   on public.books (featured, display_order);

-- chapters: front matter (introduction, contents) and actual chapters live in
-- the same table, distinguished by `kind`. `display_order` orders rows *within*
-- their kind; the reading_sequence view is what assembles the full sequence.
-- audio_* columns are reserved for a future phase and are unused for now.
create table public.chapters (
  id             uuid primary key default gen_random_uuid(),
  book_id        uuid not null references public.books (id) on delete cascade,
  title          text not null,
  content        text,
  kind           public.chapter_kind not null default 'chapter',
  display_order  integer not null default 0,
  audio_url      text,
  audio_duration integer,
  audio_status   text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index chapters_book_id_idx          on public.chapters (book_id);
create index chapters_book_kind_order_idx  on public.chapters (book_id, kind, display_order);

-- A book may have at most one Introduction and at most one Contents.
-- Partial unique indexes make duplicate front matter impossible at the DB level.
create unique index chapters_one_introduction_per_book
  on public.chapters (book_id) where kind = 'introduction';
create unique index chapters_one_contents_per_book
  on public.chapters (book_id) where kind = 'contents';

-- testimonials: the single model for both author-authored quotes and
-- reader-submitted notes, distinguished by `source`.
create table public.testimonials (
  id                       uuid primary key default gen_random_uuid(),
  name                     text not null,
  message                  text not null,
  designation_or_location  text,
  photo_url                text,
  book_id                  uuid references public.books (id) on delete set null,
  published                boolean not null default false,
  featured                 boolean not null default false,
  source                   public.testimonial_source not null default 'reader_submission',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index testimonials_published_idx        on public.testimonials (published);
create index testimonials_book_id_idx          on public.testimonials (book_id);
create index testimonials_source_published_idx on public.testimonials (source, published);

-- site_settings: a small, structured, single-row table for public site config.
-- Deliberately NOT a generic key/value store. The canonical domain is an
-- environment variable (NEXT_PUBLIC_SITE_URL), never stored here.
create table public.site_settings (
  id               integer primary key default 1 check (id = 1),
  site_name        text not null default 'INK & PAPER',
  author_name      text not null default 'P Chendraya Perumal',
  site_description text not null default 'Stories about people, memory, love, loss, and hope — free to read online.',
  instagram_url    text check (instagram_url is null or instagram_url ~* '^https://'),
  contact_email    text,
  updated_at       timestamptz not null default now()
);
