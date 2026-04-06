create or replace function public.find_user_by_email(lookup_email text)
returns table (user_id uuid, email text)
language sql
security definer
set search_path = public, auth
as $$
  select users.id, users.email::text
  from auth.users as users
  where lower(users.email::text) = lower(trim(lookup_email))
    and users.id <> auth.uid()
  limit 1;
$$;

revoke all on function public.find_user_by_email(text) from public;
grant execute on function public.find_user_by_email(text) to authenticated;