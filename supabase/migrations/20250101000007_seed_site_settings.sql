-- INK & PAPER — Phase 2
-- Seed the single site_settings row with known public configuration.
-- This is site config, not manuscript content. Set the Instagram URL later,
-- either here or through the Studio in a later phase.

insert into public.site_settings (id, site_name, author_name, site_description, instagram_url)
values (
  1,
  'INK & PAPER',
  'P Chendraya Perumal',
  'Stories about people, memory, love, loss, and hope — free to read online.',
  null
)
on conflict (id) do nothing;
