-- INK & PAPER — Phase 2
-- Storage: two public-read buckets with author-only writes.
--
-- Bucket-level file_size_limit and allowed_mime_types are enforced by Storage
-- for every upload (including server-side ones), independent of RLS.
--
-- Reader-submitted photos are NOT written by anonymous clients directly.
-- The Leave-a-Note server route (Phase 5) validates the file and writes it
-- server-side. So anonymous roles get NO write access to Storage here.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('book-covers',        'book-covers',        true, 5242880,
     array['image/jpeg','image/png','image/webp']),
  ('testimonial-photos', 'testimonial-photos', true, 5242880,
     array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Public read for both buckets (covers and approved photos are meant to be seen).
create policy "storage: public read book covers"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'book-covers');

create policy "storage: public read testimonial photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'testimonial-photos');

-- Author-only writes (insert/update/delete) for both buckets.
create policy "storage: author writes book covers"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'book-covers' and public.is_author())
  with check (bucket_id = 'book-covers' and public.is_author());

create policy "storage: author writes testimonial photos"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'testimonial-photos' and public.is_author())
  with check (bucket_id = 'testimonial-photos' and public.is_author());
