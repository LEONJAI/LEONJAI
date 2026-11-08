-- 3. Save an order request for the signed-in visitor.
create or replace function public.place_order(p_item text)
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in to place an order'; end if;
  if p_item is null or char_length(trim(p_item)) = 0 then raise exception 'Order item is required'; end if;
  insert into public.orders (user_id, item) values (auth.uid(), left(trim(p_item), 200)) returning id into new_id;
  return new_id;
end $$;

revoke all on function public.place_order(text) from public, anon;
grant execute on function public.place_order(text) to authenticated;
