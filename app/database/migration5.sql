-- 6. Peso payments (GCash or bank transfer). You confirm each one by hand in the Table Editor:
--    check the money arrived, then change status from 'pending' to 'confirmed'.
create table if not exists public.peso_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item text not null check (char_length(item) between 1 and 200),
  amount_php integer not null check (amount_php > 0 and amount_php < 10000000),
  method text not null check (method in ('gcash','bank')),
  reference text not null check (char_length(reference) between 4 and 80),
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  created_at timestamptz not null default now()
);
create index if not exists peso_user_idx on public.peso_payments (user_id, created_at desc);
alter table public.peso_payments enable row level security;
drop policy if exists "peso read own" on public.peso_payments;
create policy "peso read own" on public.peso_payments for select using (auth.uid() = user_id);

-- The amount comes from the visitor's browser, so always check it against what you actually received.
create or replace function public.submit_peso_payment(p_item text, p_amount_php integer, p_method text, p_reference text)
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in to submit a payment'; end if;
  if (select count(*) from public.peso_payments where user_id = auth.uid() and created_at > now() - interval '1 day') >= 10 then
    raise exception 'Too many payments today, contact us';
  end if;
  insert into public.peso_payments (user_id, item, amount_php, method, reference)
  values (auth.uid(), left(trim(p_item), 200), p_amount_php, p_method, trim(p_reference))
  returning id into new_id;
  return new_id;
end $$;

revoke all on function public.submit_peso_payment(text, integer, text, text) from public, anon;
grant execute on function public.submit_peso_payment(text, integer, text, text) to authenticated;
