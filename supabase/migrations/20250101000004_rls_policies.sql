-- INK & PAPER — Phase 2
-- Row Level Security. RLS is the security boundary; the app never relies on
-- hiding routes. Multiple permissive policies on a table are OR-ed together.

alter table public.profiles      enable row level security;
alter table public.books         enable row level security;
alter table public.chapters      enable row level security;
alter table public.testimonials  enable row level security;
alter table public.site_settings enable row level security;

-- ── profiles ────────────────────────────────────────────────────────────────
-- A user may read only their own profile. There is deliberately NO update
-- policy: role changes happen only via privileged SQL, so a user can never
-- elevate their own role.
create policy "profiles: self read"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

-- ── books ───────────────────────────────────────────────────────────────────
create policy "books: public read published"
  on public.books for select
  to anon, authenticated
  using (status = 'published');

create policy "books: author full access"
  on public.books for all
  to authenticated
  using (public.is_author())
  with check (public.is_author());

-- ── chapters ─────────────────────────────────────────────────────────────────
create policy "chapters: public read of published books"
  on public.chapters for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.books b
      where b.id = chapters.book_id
        and b.status = 'published'
    )
  );

create policy "chapters: author full access"
  on public.chapters for all
  to authenticated
  using (public.is_author())
  with check (public.is_author());

-- ── testimonials ─────────────────────────────────────────────────────────────
create policy "testimonials: public read published"
  on public.testimonials for select
  to anon, authenticated
  using (published = true);

-- Anyone may submit a reader note, but the WITH CHECK forces safe values:
-- it must be a reader_submission, unpublished, unfeatured, and (if attached to
-- a book) attached only to a PUBLISHED book. A submitter cannot self-publish,
-- self-feature, impersonate the author, or attach to a hidden/draft book.
create policy "testimonials: public submit reader notes"
  on public.testimonials for insert
  to anon, authenticated
  with check (
    source = 'reader_submission'
    and published = false
    and featured = false
    and (
      book_id is null
      or exists (
        select 1 from public.books b
        where b.id = testimonials.book_id
          and b.status = 'published'
      )
    )
  );

create policy "testimonials: author full access"
  on public.testimonials for all
  to authenticated
  using (public.is_author())
  with check (public.is_author());

-- ── site_settings ────────────────────────────────────────────────────────────
create policy "site_settings: public read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "site_settings: author update"
  on public.site_settings for update
  to authenticated
  using (public.is_author())
  with check (public.is_author());
