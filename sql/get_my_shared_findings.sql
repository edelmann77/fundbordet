create or replace function public.get_my_shared_findings()
returns table (
  id uuid,
  user_id uuid,
  written_name text,
  material text,
  dating text,
  easting numeric,
  northing numeric,
  dime_id text,
  created_at timestamptz,
  access_level text,
  shared_at timestamptz,
  owner_user_id uuid,
  shared_by_email text
)
language sql
security definer
set search_path = public, auth
as $$
  select
    findings.id,
    findings.user_id,
    findings.written_name,
    findings.material,
    findings.dating,
    findings.easting,
    findings.northing,
    findings.dime_id,
    findings.created_at,
    'shared'::text as access_level,
    finding_shares.created_at as shared_at,
    finding_shares.owner_user_id,
    owners.email::text as shared_by_email
  from public.finding_shares as finding_shares
  join public.findings as findings
    on findings.id = finding_shares.finding_id
  join auth.users as owners
    on owners.id = finding_shares.owner_user_id
  where finding_shares.shared_with_user_id = auth.uid()
  order by findings.created_at desc;
$$;

revoke all on function public.get_my_shared_findings() from public;
grant execute on function public.get_my_shared_findings() to authenticated;