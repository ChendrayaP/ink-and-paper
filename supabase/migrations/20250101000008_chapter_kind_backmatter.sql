-- INK & PAPER — Manuscript import
-- Extend chapter_kind with front/back matter needed by real manuscripts:
--   'acknowledgments' (front matter, before Introduction)
--   'epilogue'        (back matter, after the last chapter)
-- These are NOT chapters and never receive a chapter number (see reading_sequence).
-- Added in their own migration so the new values are committed before the
-- reading_sequence view (next migration) references them.

alter type public.chapter_kind add value if not exists 'acknowledgments';
alter type public.chapter_kind add value if not exists 'epilogue';
