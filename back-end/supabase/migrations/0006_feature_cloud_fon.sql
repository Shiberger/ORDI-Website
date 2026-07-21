-- ============================================================================
-- ORDI — 0006 CLOUD FON takes the home-page band
-- The launch band and the featured slot used to be two sections; they are one
-- now, and N°05 is what it holds. Data only — after this the studio moves the
-- spotlight from the dashboard, not from a migration.
-- ============================================================================

update public.products set featured = (id = 'cloud-fon')
 where featured is distinct from (id = 'cloud-fon');
