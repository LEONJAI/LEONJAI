-- 4. Save a quote request. Works for visitors who are not signed in. Limit: 5 per email per hour.
create or replace function public.submit_quote(p_name text, p_email text, p_service text, p_budget text, p_details text)
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if (select count(*) from public.quote_requests where email = lower(trim(p_email)) and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Too many requests, try again later';
  end if;
  insert into public.quote_requests (user_id, name, email, service, budget, details)
  values (auth.uid(), trim(p_name), lower(trim(p_email)), trim(p_service), nullif(trim(p_budget), ''), nullif(trim(p_details), ''))
  returning id into new_id;
  return new_id;
end $$;

revoke all on function public.submit_quote(text, text, text, text, text) from public;
grant execute on function public.submit_quote(text, text, text, text, text) to anon, authenticated;
