-- 7. Order list: save several items at once and keep each item's price.
alter table public.orders add column if not exists amount_usd numeric(10,2)
  check (amount_usd is null or (amount_usd >= 0 and amount_usd < 100000));

create or replace function public.place_orders(p_items jsonb)
returns integer language plpgsql security definer set search_path = public as $$
declare n integer := 0; it jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in to place an order'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'Order list is empty'; end if;
  if jsonb_array_length(p_items) > 20 then raise exception 'Too many items in one order'; end if;
  if (select count(*) from public.orders where user_id = auth.uid() and created_at > now() - interval '1 day') >= 100 then
    raise exception 'Too many orders today, contact us';
  end if;
  for it in select * from jsonb_array_elements(p_items) loop
    insert into public.orders (user_id, item, amount_usd)
    values (auth.uid(), left(trim(it->>'item'), 200), nullif(it->>'amount_usd', '')::numeric);
    n := n + 1;
  end loop;
  return n;
end $$;

revoke all on function public.place_orders(jsonb) from public, anon;
grant execute on function public.place_orders(jsonb) to authenticated;
