-- Run once in Supabase > SQL Editor (after schema.sql and migration.sql).
alter table public.profiles add column if not exists username   text;
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name  text;
alter table public.profiles add column if not exists birthday   date;
alter table public.profiles add column if not exists address    text;

create unique index if not exists profiles_username_key on public.profiles (lower(username));
alter table public.profiles drop constraint if exists username_format;
alter table public.profiles add constraint username_format
  check (username is null or username ~ '^[a-z0-9_]{3,20}$');

-- Save the sign-up form details into the profile automatically.
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, username, first_name, last_name, birthday, address)
  values (
    new.id,
    nullif(lower(new.raw_user_meta_data->>'username'), ''),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    nullif(new.raw_user_meta_data->>'birthday', '')::date,
    new.raw_user_meta_data->>'address'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Lets the sign-up page check if a username is free before creating the account.
create or replace function public.username_available(name text) returns boolean as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(name));
$$ language sql security definer;
grant execute on function public.username_available(text) to anon, authenticated;
