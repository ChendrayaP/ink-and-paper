-- INK & PAPER — Manuscript import
-- 1) A book may have at most one Acknowledgments and at most one Epilogue,
--    mirroring the existing one-Introduction / one-Contents constraints.
-- 2) Rebuild reading_sequence to place Acknowledgments before the Introduction
--    and the Epilogue after the last chapter, with correct labels/paths/links.
--    Chapter numbering is UNCHANGED: only kind='chapter' is ever numbered.

create unique index if not exists chapters_one_acknowledgments_per_book
  on public.chapters (book_id) where kind = 'acknowledgments';
create unique index if not exists chapters_one_epilogue_per_book
  on public.chapters (book_id) where kind = 'epilogue';

-- Reading order per book:
--   acknowledgments → introduction → contents → chapter 1 … chapter N → epilogue
-- (the cover is the book root page, not a row here; the completion area follows
--  the terminal manuscript section, which is the epilogue when present.)
--
-- kind_rank: acknowledgments=0, introduction=1, contents=2, chapter=3, epilogue=4.
-- Only kind='chapter' gets a chapter_number and counts toward total_chapters,
-- so acknowledgments/introduction/contents/epilogue can never be a chapter.
create or replace view public.reading_sequence
with (security_invoker = true) as
with ordered as (
  select
    c.*,
    case c.kind
      when 'acknowledgments' then 0
      when 'introduction'    then 1
      when 'contents'        then 2
      when 'chapter'         then 3
      when 'epilogue'        then 4
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
      when 'acknowledgments' then 'acknowledgments'
      when 'introduction'    then 'introduction'
      when 'contents'        then 'contents'
      when 'chapter'         then 'chapter-' || n.chapter_number::text
      when 'epilogue'        then 'epilogue'
    end as path_segment,
    case n.kind
      when 'acknowledgments' then 'Acknowledgments'
      when 'introduction'    then 'Introduction'
      when 'contents'        then 'Contents'
      when 'chapter'         then 'Chapter ' || n.chapter_number::text
      when 'epilogue'        then 'Epilogue'
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
