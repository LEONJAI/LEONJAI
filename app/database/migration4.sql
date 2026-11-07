-- Quote requests from the website form. Run once in the Supabase SQL editor.
create table if not exists public.leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) between 5 and 120),
  need text not null check (char_length(need) <= 80),
  budget text check (char_length(budget) <= 40),
  message text check (char_length(message) <= 1500),
  source text check (char_length(source) <= 120),
  utm jsonb not null default '{}'::jsonb,
  referrer text check (char_length(referrer) <= 200),
  landing_page text check (char_length(landing_page) <= 200)
);
alter table public.leads enable row level security;
-- Visitors can add a lead, but nobody can read leads from the website.
-- You read them in Supabase: Table Editor > leads.
drop policy if exists "anyone can submit a lead" on public.leads;
create policy "anyone can submit a lead" on public.leads for insert to anon, authenticated with check (true);
