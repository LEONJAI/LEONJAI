-- Run once in Supabase > SQL Editor. Adds paid-member workstations.
-- Grant subscription access only after confirming payment (see docs/README.md).
alter table public.profiles add column if not exists subscription_active boolean not null default false;

-- Members must never be able to grant themselves paid access through the public API.
create or replace function public.protect_subscription_status() returns trigger as $$
begin
  if auth.role() = 'authenticated' and new.subscription_active is distinct from old.subscription_active then
    raise exception 'Subscription status can only be changed by an administrator';
  end if;
  return new;
end;
$$ language plpgsql;
drop trigger if exists protect_subscription_status on public.profiles;
create trigger protect_subscription_status before update on public.profiles
  for each row execute function public.protect_subscription_status();

create table if not exists public.profile_media (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_type text not null check (media_type in ('photo', 'video', 'logo')),
  object_path text not null unique,
  file_name text not null check (char_length(file_name) between 1 and 255),
  created_at timestamptz not null default now()
);
alter table public.profile_media enable row level security;
drop policy if exists "paid members manage own media" on public.profile_media;
create policy "paid members manage own media" on public.profile_media for all to authenticated
  using (user_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.subscription_active))
  with check (user_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.subscription_active));

insert into storage.buckets (id, name, public, file_size_limit)
values ('workstation', 'workstation', false, 104857600)
on conflict (id) do update set public = false, file_size_limit = 104857600;
drop policy if exists "paid members read workstation files" on storage.objects;
drop policy if exists "paid members upload workstation files" on storage.objects;
drop policy if exists "paid members delete workstation files" on storage.objects;
create policy "paid members read workstation files" on storage.objects for select to authenticated
  using (bucket_id = 'workstation' and (storage.foldername(name))[1] = auth.uid()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.subscription_active));
create policy "paid members upload workstation files" on storage.objects for insert to authenticated
  with check (bucket_id = 'workstation' and (storage.foldername(name))[1] = auth.uid()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.subscription_active));
create policy "paid members delete workstation files" on storage.objects for delete to authenticated
  using (bucket_id = 'workstation' and (storage.foldername(name))[1] = auth.uid()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.subscription_active));
