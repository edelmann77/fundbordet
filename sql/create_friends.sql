create table if not exists public.friends (
  id uuid primary key default gen_random_uuid(),
  inviter uuid not null references auth.users (id) on delete cascade,
  invitee uuid not null references auth.users (id) on delete cascade,
  status text not null default 'not confirmed' check (status in ('confirmed', 'not confirmed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint friends_inviter_invitee_check check (inviter <> invitee)
);

create unique index if not exists friends_unique_pair_idx
on public.friends (least(inviter::text, invitee::text), greatest(inviter::text, invitee::text));

create index if not exists friends_inviter_idx on public.friends (inviter);
create index if not exists friends_invitee_idx on public.friends (invitee);

create or replace function public.set_friends_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_friends_updated_at on public.friends;

create trigger set_friends_updated_at
before update on public.friends
for each row
execute function public.set_friends_updated_at();

alter table public.friends enable row level security;

grant select, insert, update, delete on public.friends to authenticated;

drop policy if exists "Authenticated users can create friends" on public.friends;
create policy "Authenticated users can create friends"
on public.friends
for insert
to authenticated
with check (auth.role() = 'authenticated');

drop policy if exists "Participants can read friends" on public.friends;
create policy "Participants can read friends"
on public.friends
for select
to authenticated
using (auth.uid() = inviter or auth.uid() = invitee);

drop policy if exists "Participants can update friends" on public.friends;
create policy "Participants can update friends"
on public.friends
for update
to authenticated
using (auth.uid() = inviter or auth.uid() = invitee)
with check (auth.uid() = inviter or auth.uid() = invitee);

drop policy if exists "Participants can delete friends" on public.friends;
create policy "Participants can delete friends"
on public.friends
for delete
to authenticated
using (auth.uid() = inviter or auth.uid() = invitee);