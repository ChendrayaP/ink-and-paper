-- INK & PAPER — Phase 2
-- Table/function privileges for the API roles. Privileges say "may attempt";
-- RLS decides "on which rows". Both must allow an operation for it to succeed.

grant usage on schema public to anon, authenticated;

-- Read access (RLS still restricts rows).
grant select on
  public.books,
  public.chapters,
  public.testimonials,
  public.site_settings,
  public.reading_sequence
to anon, authenticated;

-- Anonymous readers may submit reader notes (RLS forces safe values).
grant insert on public.testimonials to anon, authenticated;

-- The author (authenticated) manages content; RLS limits writes to the author.
grant insert, update, delete on
  public.books,
  public.chapters,
  public.testimonials
to authenticated;

grant update on public.site_settings to authenticated;

-- A user may read their own profile row.
grant select on public.profiles to authenticated;

-- The authorization helper is called inside policies for both roles.
grant execute on function public.is_author() to anon, authenticated;
