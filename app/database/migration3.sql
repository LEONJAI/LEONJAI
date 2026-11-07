-- Run once in Supabase > SQL Editor. Adds profile photos.
alter table public.profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

drop policy if exists "avatar read"   on storage.objects;
drop policy if exists "avatar insert" on storage.objects;
drop policy if exists "avatar update" on storage.objects;

create policy "avatar read" on storage.objects for select
  using (bucket_id = 'avatars');
create policy "avatar insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatar update" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
