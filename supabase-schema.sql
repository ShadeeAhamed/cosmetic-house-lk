-- Cosmetic House LK production backend schema.
-- Run this once in Supabase SQL Editor, then add SUPABASE_URL and
-- SUPABASE_SERVICE_ROLE_KEY to the private backend host environment.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id text primary key,
  contact text unique not null,
  name text,
  gender text,
  disabled boolean not null default false,
  verification_status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_contact_idx on public.users (contact);
create index if not exists users_created_at_idx on public.users (created_at desc);

create table if not exists public.orders (
  id text primary key,
  status text not null default 'New Order',
  payment_status text not null default 'Pending',
  payment_method text,
  customer_name text,
  customer_phone text,
  customer_email text,
  total numeric(12,2) not null default 0,
  source text not null default 'website',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_customer_phone_idx on public.orders (customer_phone);
create index if not exists orders_customer_email_idx on public.orders (customer_email);

create table if not exists public.products (
  id text primary key,
  slug text unique,
  name text not null,
  brand text,
  category text,
  price numeric(12,2) not null default 0,
  image text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_brand_idx on public.products (brand);

create table if not exists public.carts (
  id text primary key,
  user_id text references public.users(id) on delete cascade,
  contact text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wishlist (
  id text primary key,
  user_id text references public.users(id) on delete cascade,
  contact text,
  product_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists carts_contact_idx on public.carts (contact);
create index if not exists wishlist_contact_idx on public.wishlist (contact);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id text references public.orders(id) on delete cascade,
  provider text not null,
  provider_reference text,
  status text not null default 'Pending',
  amount numeric(12,2) not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_staff (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null default 'staff',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visits (
  id text primary key,
  page text,
  referrer text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists visits_created_at_idx on public.visits (created_at desc);
create index if not exists visits_page_idx on public.visits (page);

alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.wishlist enable row level security;
alter table public.payments enable row level security;
alter table public.admin_staff enable row level security;
alter table public.visits enable row level security;

-- Service-role backend access bypasses RLS. Public browser access should go
-- through the private Node API, not directly to these tables.
