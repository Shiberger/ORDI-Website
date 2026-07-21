-- ============================================================================
-- ORDI — 0007 CLOUD FON pricing
-- N°05 is priced 100 THB above the rest of the collection in both sizes.
-- Data only, and the last time pricing moves through a migration — the studio
-- edits prices from the dashboard.
-- ============================================================================

update public.product_sizes s
   set price = v.price
  from (values (50, 1490), (12, 490)) as v(ml, price)
 where s.product_id = 'cloud-fon'
   and s.ml = v.ml
   and s.price is distinct from v.price;
