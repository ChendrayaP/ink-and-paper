-- INK & PAPER — Phase 2
-- Enumerated types. Using enums (not free text) makes invalid states
-- unrepresentable: a chapter's `kind` can only ever be one of three values,
-- and only 'chapter' is ever counted toward the chapter total.

create type public.book_status        as enum ('draft', 'published');
create type public.chapter_kind       as enum ('introduction', 'contents', 'chapter');
create type public.testimonial_source as enum ('author', 'reader_submission');
create type public.app_role           as enum ('author');
