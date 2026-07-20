-- ============================================================================
-- ORDI — 0001 core schema
-- Profiles (with admin roles), orders, order items, shipping, wishlist,
-- newsletter, and the member-tier view.
-- Run in Supabase SQL Editor, or `supabase db push`.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
  
end;
$$;

-- ---------------------------------------------------------------------------
-- PROFILES (extends auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users on delete cascade,
  first_name      text,
  last_name       text,
  phone           text,
  preferred_lang  text not null default 'en' check (preferred_lang in ('en', 'th')),
  is_invited      boolean not null default false,  -- "Out of Ordinary" tier
  role            text not null default 'customer'
                  check (role in ('customer', 'admin', 'owner')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Role check used by every admin RLS policy below.
-- SECURITY DEFINER so the lookup itself is not subject to profiles' RLS,
-- which would otherwise recurse infinitely.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'owner')
  );
$$;

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id                text primary key,           -- e.g. "ORDI-48201"
  user_id           uuid references auth.users on delete set null,
  email             text not null,              -- guest checkout support
  status            text not null default 'pending_payment'
                    check (status in ('pending_payment', 'paid', 'processing',
                                      'shipped', 'delivered', 'cancelled', 'refunded')),
  stripe_session_id text unique,
  stripe_payment_id text,
  payment_method    text check (payment_method in ('card', 'promptpay', 'transfer')),
  subtotal          integer not null,           -- THB, no decimals
  shipping_cost     integer not null default 0,
  total             integer not null,
  currency          text not null default 'THB',
  carrier           text check (carrier in ('thai-post', 'kerry', 'pickup')),
  tracking_number   text,
  notes             text,
  created_at        timestamptz not null default now(),
  paid_at           timestamptz,
  shipped_at        timestamptz,
  delivered_at      timestamptz
);

create index if not exists orders_user_id_idx     on public.orders(user_id);
create index if not exists orders_status_idx      on public.orders(status);
create index if not exists orders_created_at_idx  on public.orders(created_at desc);
create index if not exists orders_email_idx       on public.orders(email);

alter table public.orders enable row level security;

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update
  using (public.is_admin());

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
  on public.orders for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- ORDER ITEMS
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     text not null references public.orders on delete cascade,
  product_id   text not null,
  product_name text not null,                   -- snapshot at order time
  size_ml      integer not null,
  qty          integer not null check (qty > 0),
  unit_price   integer not null,
  created_at   timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

alter table public.order_items enable row level security;

drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items"
  on public.order_items for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- SHIPPING ADDRESSES
-- ---------------------------------------------------------------------------
create table if not exists public.shipping_addresses (
  id          uuid primary key default gen_random_uuid(),
  order_id    text not null references public.orders on delete cascade,
  first_name  text not null,
  last_name   text not null,
  phone       text not null,
  address     text not null,
  city        text not null,
  postcode    text not null,
  country     text not null default 'TH',
  created_at  timestamptz not null default now()
);

create index if not exists shipping_addresses_order_id_idx
  on public.shipping_addresses(order_id);

alter table public.shipping_addresses enable row level security;

drop policy if exists "Users can view own shipping address" on public.shipping_addresses;
create policy "Users can view own shipping address"
  on public.shipping_addresses for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = shipping_addresses.order_id and o.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- WISHLIST
-- ---------------------------------------------------------------------------
create table if not exists public.wishlists (
  user_id     uuid not null references auth.users on delete cascade,
  product_id  text not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.wishlists enable row level security;

drop policy if exists "Users manage own wishlist" on public.wishlists;
create policy "Users manage own wishlist"
  on public.wishlists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- NEWSLETTER
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  email          text primary key,
  lang           text not null default 'en' check (lang in ('en', 'th')),
  subscribed_at  timestamptz not null default now(),
  active         boolean not null default true
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Admins can read subscribers" on public.newsletter_subscribers;
create policy "Admins can read subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- MEMBER TIER (computed view)
-- ---------------------------------------------------------------------------
create or replace view public.member_tiers
with (security_invoker = true) as
select
  p.id as user_id,
  p.is_invited,
  count(o.id) filter (
    where o.status in ('paid', 'processing', 'shipped', 'delivered')
  ) as completed_orders,
  case
    when p.is_invited then 'out_of_ordinary'
    when count(o.id) filter (
      where o.status in ('paid', 'processing', 'shipped', 'delivered')
    ) >= 3 then 'ous'
    else 'ordinary'
  end as tier
from public.profiles p
left join public.orders o on o.user_id = p.id
group by p.id, p.is_invited;

-- ---------------------------------------------------------------------------
-- NOTE ON WRITES
-- Orders, order_items and shipping_addresses have no INSERT policy on purpose.
-- They are written only by the checkout API and the Stripe webhook using the
-- service_role key, which bypasses RLS. No anon client can forge an order.
-- ---------------------------------------------------------------------------
