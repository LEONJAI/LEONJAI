-- Run once in Supabase > SQL Editor (after schema.sql).
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists bio text;

create policy "own profile insert" on public.profiles
  for insert with check (auth.uid() = id);
