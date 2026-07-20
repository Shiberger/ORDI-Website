-- ============================================================================
-- ORDI — 0002 content schema
-- Products, their sizes, and journal entries. These used to live in
-- front-end/lib/data/*.ts; they move here so the admin dashboard can edit them.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PRODUCTS
-- Bilingual copy is stored as paired _en / _th columns rather than jsonb:
-- the admin form maps 1:1 to columns, and Postgres can index/validate them.
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id           text primary key,                -- url slug, e.g. 'good-boy'
  name         text not null,                   -- 'GOOD BOY'
  number       text not null default '',        -- 'N°01'

  tagline_en   text not null default '',
  tagline_th   text not null default '',
  family_en    text not null default '',
  family_th    text not null default '',
  story_en     text not null default '',
  story_th     text not null default '',

  notes_top    text[] not null default '{}',
  notes_heart  text[] not null default '{}',
  notes_base   text[] not null default '{}',

  status       text not null default 'available'
               check (status in ('available', 'coming-soon', 'sold-out')),
  hue          text not null default '#EFEAE0',
  image_url    text,                            -- optional; falls back to bundled art

  published    boolean not null default true,
  sort_order   integer not null default 0,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_published_idx on public.products(published, sort_order);

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- PRODUCT SIZES (1-many: 50ml / 12ml, each with its own price)
-- ---------------------------------------------------------------------------
create table if not exists public.product_sizes (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products on delete cascade,
  ml          integer not null check (ml > 0),
  price       integer not null check (price >= 0),   -- THB, no decimals
  sort_order  integer not null default 0,
  unique (product_id, ml)
);

create index if not exists product_sizes_product_id_idx on public.product_sizes(product_id);

-- ---------------------------------------------------------------------------
-- JOURNAL
-- ---------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id          text primary key,                 -- 'j03'
  slug        text not null unique,             -- 'cloud-fon-scent-of-air'
  number      text not null default '',         -- 'JRN.003'
  date        text not null,                    -- display date, '2026.05.25'

  title_en    text not null default '',
  title_th    text not null default '',
  excerpt_en  text not null default '',
  excerpt_th  text not null default '',
  body_en     text not null default '',
  body_th     text not null default '',
  body2_en    text,
  body2_th    text,

  readtime    text not null default '3 min',
  published   boolean not null default true,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists journal_published_idx on public.journal_entries(published, date desc);

drop trigger if exists journal_touch_updated_at on public.journal_entries;
create trigger journal_touch_updated_at
  before update on public.journal_entries
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — public reads published rows, admins do everything
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.product_sizes enable row level security;
alter table public.journal_entries enable row level security;

drop policy if exists "Anyone can read published products" on public.products;
create policy "Anyone can read published products"
  on public.products for select
  using (published or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can read sizes of published products" on public.product_sizes;
create policy "Anyone can read sizes of published products"
  on public.product_sizes for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_sizes.product_id and p.published
    )
  );

drop policy if exists "Admins manage product sizes" on public.product_sizes;
create policy "Admins manage product sizes"
  on public.product_sizes for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can read published journal" on public.journal_entries;
create policy "Anyone can read published journal"
  on public.journal_entries for select
  using (published or public.is_admin());

drop policy if exists "Admins manage journal" on public.journal_entries;
create policy "Admins manage journal"
  on public.journal_entries for all
  using (public.is_admin())
  with check (public.is_admin());
