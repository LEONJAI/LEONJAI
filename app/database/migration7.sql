-- 8. Profile photo. A small (160px) image is stored as text on the profile row.
alter table public.profiles add column if not exists avatar text
  check (avatar is null or char_length(avatar) <= 60000);
