-- INK & PAPER — Phase 2
-- Functions, triggers, and the reading_sequence view.

-- Maintains updated_at on row updates.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger books_set_updated_at
  before update on public.books
  for each row execute function public.set_updated_at();
create trigger chapters_set_updated_at
  before update on public.chapters
  for each row execute function public.set_updated_at();
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Creates a profile row automatically when a user signs up (role starts NULL;
-- it is elevated to 'author' manually). Public sign-up is disabled, so in
-- practice this only ever fires for the author's own account.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, null)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Authorization helper. SECURITY DEFINER so it reads profiles without being
-- gated by profiles' own RLS (this also prevents policy recursion). The empty
-- search_path forces fully-qualified names, closing a common injection vector.
create or replace function public.is_author()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'author'
  );
$$;

-- ── reading_sequence ────────────────────────────────────────────────────────
-- The single source of truth for how a book is read. It assembles the reading
-- order deterministically and derives chapter numbers so that front matter can
-- never be counted as a chapter.
--
-- Reading order per book:  introduction → contents → chapter 1 → … → chapter N
-- (the cover is the book root page, not a row here.)
--
-- Ordering key: kind_rank (intro=0, contents=1, chapter=2), then display_order,
-- then created_at, then id — fully deterministic, with no ties.
--
--   sequence_position : 1..M across all rows, in reading order
--   chapter_number    : 1..N for kind='chapter' ONLY; NULL for front matter
--   total_chapters    : count of kind='chapter' in the book (front matter excluded)
--   path_segment      : URL piece — 'introduction' | 'contents' | 'chapter-<n>'
--   label             : display label — 'Introduction' | 'Contents' | 'Chapter <n>'
--   prev/next_*       : neighbours in reading order (NULL prev = cover/root,
--                       NULL next = end-of-book completion)
--
-- security_invoker = true → the view respects the querying user's RLS on
-- chapters, so anon sees only chapters of published books.
create or replace view public.reading_sequence
with (security_invoker = true) as
with ordered as (
  select
    c.*,
    case c.kind
      when 'introduction' then 0
      when 'contents'     then 1
      when 'chapter'      then 2
    end as kind_rank
  from public.chapters c
),
numbered as (
  select
    o.*,
    row_number() over (
      partition by o.book_id
      order by o.kind_rank, o.display_order, o.created_at, o.id
    ) as sequence_position,
    case when o.kind = 'chapter' then
      row_number() over (
        partition by o.book_id, (o.kind = 'chapter')
        order by o.display_order, o.created_at, o.id
      )
    end as chapter_number,
    (count(*) filter (where o.kind = 'chapter')
      over (partition by o.book_id))::int as total_chapters
  from ordered o
),
labeled as (
  select
    n.*,
    case n.kind
      when 'introduction' then 'introduction'
      when 'contents'     then 'contents'
      when 'chapter'      then 'chapter-' || n.chapter_number::text
    end as path_segment,
    case n.kind
      when 'introduction' then 'Introduction'
      when 'contents'     then 'Contents'
      when 'chapter'      then 'Chapter ' || n.chapter_number::text
    end as label
  from numbered n
)
select
  l.id,
  l.book_id,
  l.title,
  l.content,
  l.kind,
  l.display_order,
  l.audio_url,
  l.audio_duration,
  l.audio_status,
  l.created_at,
  l.updated_at,
  l.sequence_position::int as sequence_position,
  l.chapter_number::int    as chapter_number,
  l.total_chapters,
  l.path_segment,
  l.label,
  lag(l.path_segment)  over w as prev_path_segment,
  lag(l.label)         over w as prev_label,
  lead(l.path_segment) over w as next_path_segment,
  lead(l.label)        over w as next_label
from labeled l
window w as (partition by l.book_id order by l.sequence_position);
