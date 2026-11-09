-- Run in Supabase → SQL Editor

create table if not exists public.quotes (
  id bigint generated always as identity primary key,
  name text not null, email text not null, service text not null,
  budget text, details text, lang text, created_at timestamptz default now()
);
create table if not exists public.work     (id bigint generated always as identity primary key, title text, kind text, note text, color text);
create table if not exists public.services (id bigint generated always as identity primary key, title text, note text, tag text);
create table if not exists public.gallery  (id bigint generated always as identity primary key, type text check (type in ('photo','logo','video')), title text, color text);
create table if not exists public.prices   (id bigint generated always as identity primary key, grp text check (grp in ('design','web')), title text, note text, usd numeric, php numeric, per text);

alter table public.quotes   enable row level security;
alter table public.work     enable row level security;
alter table public.services enable row level security;
alter table public.gallery  enable row level security;
alter table public.prices   enable row level security;

-- Visitors can send a quote request but cannot read requests
create policy "anyone can request a quote" on public.quotes for insert to anon with check (true);

-- Visitors can read the site content; edit it from the Supabase dashboard
create policy "read work"     on public.work     for select to anon using (true);
create policy "read services" on public.services for select to anon using (true);
create policy "read gallery"  on public.gallery  for select to anon using (true);
create policy "read prices"   on public.prices   for select to anon using (true);

-- Optional: add your own rows. If a table is empty, the site shows built-in demo content.
-- insert into public.prices (grp,title,note,usd,php) values ('design','Logo','2 concepts, 2 revisions',120,3500);
