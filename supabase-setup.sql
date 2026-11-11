-- Run once in Supabase Dashboard → SQL Editor. Safe to re-run.

-- Public content (the site falls back to built-in demo content if a table is empty)
create table if not exists work     (id bigint generated always as identity primary key, title text, kind text, note text, color text);
create table if not exists services (id bigint generated always as identity primary key, title text, note text, tag text);
create table if not exists prices   (id bigint generated always as identity primary key, grp text, title text, note text, usd numeric, php numeric, per text);
create table if not exists gallery  (id bigint generated always as identity primary key, type text, title text, color text, preview_url text, file_path text, price_usd numeric, price_php numeric);

-- Quote form submissions
create table if not exists quotes (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text, email text, service text, budget text, details text, lang text
);

-- Paid video licenses (insert rows from your payment webhook / dashboard, not from the browser)
create table if not exists purchases (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  gallery_id bigint references gallery(id) on delete cascade,
  created_at timestamptz default now()
);

alter table work      enable row level security;
alter table services  enable row level security;
alter table prices    enable row level security;
alter table gallery   enable row level security;
alter table quotes    enable row level security;
alter table purchases enable row level security;

drop policy if exists "public read work"     on work;
drop policy if exists "public read services" on services;
drop policy if exists "public read prices"   on prices;
drop policy if exists "public read gallery"  on gallery;
drop policy if exists "anyone can send quote" on quotes;
drop policy if exists "read own purchases"   on purchases;
drop policy if exists "read own quotes"      on quotes;

create policy "public read work"     on work     for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read prices"   on prices   for select using (true);
create policy "public read gallery"  on gallery  for select using (true);
create policy "anyone can send quote" on quotes  for insert with check (true);
create policy "read own purchases"   on purchases for select using (auth.uid() = user_id);
create policy "read own quotes"      on quotes    for select to authenticated using (lower(email) = lower(auth.jwt() ->> 'email'));

-- Private storage buckets for downloadable files (signed URLs, 60 s)
insert into storage.buckets (id, name, public) values ('downloads','downloads',false), ('videos','videos',false) on conflict do nothing;

drop policy if exists "signed-in users read downloads" on storage.objects;
create policy "signed-in users read downloads" on storage.objects
  for select to authenticated using (bucket_id = 'downloads');
-- 'videos' has no read policy on purpose: serve them with a server-side check of the purchases table.
