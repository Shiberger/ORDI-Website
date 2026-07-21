-- ============================================================================
-- ORDI — 0004 CLOUD FON launch
-- N°05 shipped. Data-only: the storefront reads `status` for the coming-soon
-- badge and for whether the add-to-cart button is live, so the launch is this
-- one row changing. Runnable more than once.
-- ============================================================================

update public.products
   set status = 'available'
 where id = 'cloud-fon'
   and status = 'coming-soon';

-- The launch photography is a dark forest, and `hue` is the backdrop the
-- overlay labels flip against, so it moves with the art.
update public.products
   set hue = '#1C2A20'
 where id = 'cloud-fon'
   and hue = '#E8E0D6';
