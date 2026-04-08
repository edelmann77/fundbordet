create or replace function public.get_my_friends()
returns table (
  id uuid,
  inviter uuid,
  invitee uuid,
  status text,
  counterpart_user_id uuid,
  counterpart_email text,
  created_at timestamptz
)
language sql
security definer
set search_path = public, auth
as $$
  select
    friends.id,
    friends.inviter,
    friends.invitee,
    friends.status,
    case
      when friends.inviter = auth.uid() then friends.invitee
      else friends.inviter
    end as counterpart_user_id,
    counterpart.email::text as counterpart_email,
    friends.created_at
  from public.friends as friends
  join auth.users as counterpart
    on counterpart.id = case
      when friends.inviter = auth.uid() then friends.invitee
      else friends.inviter
    end
  where friends.inviter = auth.uid()
    or friends.invitee = auth.uid()
  order by
    case when friends.status = 'not confirmed' then 0 else 1 end,
    friends.created_at desc;
$$;

revoke all on function public.get_my_friends() from public;
grant execute on function public.get_my_friends() to authenticated;