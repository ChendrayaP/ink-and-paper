-- INK & PAPER — Analytics (first-party, privacy-light page views)
-- Append-only event table. One row per public page view. Deliberately stores
-- NO personally identifying data: no IP, no user agent, no cookies, no visitor
-- id, no referrer. Only the (already public) path, a coarse classification, the
-- book slug/section parsed from the path, and a timestamp.
--
-- Writes happen ONLY via the server-side service-role admin client (RLS-bypass),
-- exactly like the Phase-5 reader-photo path. Anonymous and authenticated
-- clients have NO insert access. Reads are author-only via is_author() + RLS.

create table public.page_views (
  id                   bigint generated always as identity primary key,
  path                 text not null,
  kind                 text not null
                         check (kind in ('home','library','about','testimonials','book','reader')),
  book_slug            text,
  section_path_segment text,
  viewed_at            timestamptz not null default now(),
  day                  date not null default (now() at time zone 'utc')::date
);

comment on table public.page_views is
  'Privacy-light first-party page-view events. No PII. Author-only read; admin-only write.';

-- Indexes for the dashboard queries.
create index page_views_viewed_at_idx on public.page_views (viewed_at desc);
create index page_views_day_idx       on public.page_views (day);
create index page_views_path_idx      on public.page_views (path);
create index page_views_book_slug_idx on public.page_views (book_slug) where book_slug is not null;

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table public.page_views enable row level security;

-- Author-only reads. There is deliberately NO insert/update/delete policy:
-- all writes go through the service-role admin client, which bypasses RLS.
create policy "page_views: author read"
  on public.page_views for select
  to authenticated
  using (public.is_author());

-- ── Aggregate views (security_invoker: inherit page_views' author-only RLS) ────
create view public.analytics_daily
  with (security_invoker = true) as
  select day, count(*)::bigint as views
  from public.page_views
  group by day;

create view public.analytics_top_paths
  with (security_invoker = true) as
  select path, kind, count(*)::bigint as views
  from public.page_views
  group by path, kind;

create view public.analytics_book_views
  with (security_invoker = true) as
  select book_slug, count(*)::bigint as views
  from public.page_views
  where book_slug is not null
  group by book_slug;

-- ── Grants ────────────────────────────────────────────────────────────────────
-- Author reads via SELECT (RLS restricts rows to the author).
grant select on public.page_views to authenticated;
-- The server-side admin client (service_role) is the ONLY writer. Granted
-- explicitly so recording never depends on project-level default privileges.
-- No insert is granted to anon or authenticated.
grant insert on public.page_views to service_role;
grant select on
  public.analytics_daily,
  public.analytics_top_paths,
  public.analytics_book_views
to authenticated;
