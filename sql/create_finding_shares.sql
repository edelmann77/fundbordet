create table if not exists public.finding_shares (
  id uuid primary key default gen_random_uuid(),
  finding_id uuid not null references public.findings (id) on delete cascade,
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  shared_with_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint finding_shares_owner_check check (owner_user_id <> shared_with_user_id),
  constraint finding_shares_unique_pair unique (finding_id, shared_with_user_id)
);

create index if not exists finding_shares_finding_idx
on public.finding_shares (finding_id);

create index if not exists finding_shares_owner_idx
on public.finding_shares (owner_user_id);

create index if not exists finding_shares_shared_with_idx
on public.finding_shares (shared_with_user_id);

create or replace function public.set_finding_shares_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.validate_finding_share()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  finding_owner_id uuid;
begin
  select findings.user_id
    into finding_owner_id
  from public.findings as findings
  where findings.id = new.finding_id;

  if finding_owner_id is null then
    raise exception 'Finding % does not exist', new.finding_id;
  end if;

  new.owner_user_id = finding_owner_id;

  if new.owner_user_id = new.shared_with_user_id then
    raise exception 'A finding cannot be shared with its owner';
  end if;

  return new;
end;
$$;

drop trigger if exists set_finding_shares_updated_at on public.finding_shares;

create trigger set_finding_shares_updated_at
before update on public.finding_shares
for each row
execute function public.set_finding_shares_updated_at();

drop trigger if exists validate_finding_share on public.finding_shares;

create trigger validate_finding_share
before insert or update on public.finding_shares
for each row
execute function public.validate_finding_share();

alter table public.finding_shares enable row level security;

grant select, insert, update, delete on public.finding_shares to authenticated;

drop policy if exists "Owners and recipients can read finding shares" on public.finding_shares;
create policy "Owners and recipients can read finding shares"
on public.finding_shares
for select
to authenticated
using (auth.uid() = owner_user_id or auth.uid() = shared_with_user_id);

drop policy if exists "Owners can create finding shares" on public.finding_shares;
create policy "Owners can create finding shares"
on public.finding_shares
for insert
to authenticated
with check (auth.uid() = owner_user_id);

drop policy if exists "Owners can update finding shares" on public.finding_shares;
create policy "Owners can update finding shares"
on public.finding_shares
for update
to authenticated
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

drop policy if exists "Owners can delete finding shares" on public.finding_shares;
create policy "Owners can delete finding shares"
on public.finding_shares
for delete
to authenticated
using (auth.uid() = owner_user_id);