-- 9. Profile details: address, birthday and contact number, filled in at sign up and editable later.
alter table public.profiles add column if not exists address text check (address is null or char_length(address) <= 300);
alter table public.profiles add column if not exists birthday date check (birthday is null or (birthday >= date '1900-01-01' and birthday <= current_date));
alter table public.profiles add column if not exists phone text check (phone is null or char_length(phone) <= 30);

-- Copy the details from the sign-up form onto the new profile row.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare b date;
begin
  begin
    b := nullif(new.raw_user_meta_data->>'birthday', '')::date;
  exception when others then
    b := null;
  end;
  if b is not null and (b > current_date or b < date '1900-01-01') then b := null; end if;
  insert into public.profiles (id, full_name, address, birthday, phone)
  values (
    new.id,
    coalesce(left(new.raw_user_meta_data->>'full_name', 120), ''),
    left(nullif(new.raw_user_meta_data->>'address', ''), 300),
    b,
    left(nullif(new.raw_user_meta_data->>'phone', ''), 30)
  );
  return new;
end $$;
