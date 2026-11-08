-- 1. Run this first. Tables, indexes and row-level security.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item text not null check (char_length(item) between 1 and 200),
  status text not null default 'requested' check (status in ('requested','invoiced','paid','delivered','cancelled')),
  created_at timestamptz not null default now()
);
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  service text not null check (char_length(service) between 1 and 120),
  budget text check (char_length(budget) <= 60),
  details text check (char_length(details) <= 4000),
  created_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists quotes_user_idx on public.quote_requests (user_id, created_at desc);
create index if not exists quotes_email_idx on public.quote_requests (email, created_at desc);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.quote_requests enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "orders read own" on public.orders;
create policy "orders read own" on public.orders for select using (auth.uid() = user_id);
drop policy if exists "quotes read own" on public.quote_requests;
create policy "quotes read own" on public.quote_requests for select using (auth.uid() = user_id);
-- Orders and quote requests have no insert policy: visitors write through the functions in the migrations.
