-- ============================================================================
-- ORDI — 0005 product image storage
-- A bucket so the studio can put photography on a fragrance from the dashboard
-- instead of asking for a deploy. Brand and editorial art stays bundled in the
-- storefront; only product shots live here.
--
-- Uploads go browser → Storage directly (never through a server action), so the
-- policies below are the whole access story: anyone may read, only an admin may
-- write.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,                                   -- read without a signed URL, so next/image can fetch it
  10485760,                               -- 10 MB — well past a compressed studio shot
  array['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Policies. `is_admin()` is the same SECURITY DEFINER function the content
-- tables use, so dashboard access is defined in exactly one place.
-- ---------------------------------------------------------------------------

drop policy if exists "Product images are publicly readable" on storage.objects;
create policy "Product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can replace product images" on storage.objects;
create policy "Admins can replace product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
