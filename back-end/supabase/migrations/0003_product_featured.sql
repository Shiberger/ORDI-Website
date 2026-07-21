-- ============================================================================
-- ORDI — 0003 featured product
-- One fragrance gets a spotlight band on the home page, above the collection
-- grid. Which one is editorial, not derived — so it is a flag the studio owns
-- from the dashboard rather than something inferred from sales or sort order.
-- ============================================================================

alter table public.products
  add column if not exists featured boolean not null default false;

-- Partial index: the storefront only ever asks "which row is featured?", and
-- that set is one row wide.
create index if not exists products_featured_idx
  on public.products(featured)
  where featured;

-- N°01 opens the collection, so it opens the home page too until the studio
-- picks another. No-ops on a database seeded after this migration.
update public.products set featured = true where id = 'good-boy';
