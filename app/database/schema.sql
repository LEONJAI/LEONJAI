-- Run in Supabase > SQL Editor. Logins themselves are stored by Supabase Auth (auth.users).
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Create a profile row automatically for every new user.
create function public.handle_new_user() returns trigger as $$
begin insert into public.profiles (id) values (new.id); return new; end;
$$ language plpgsql security definer;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
