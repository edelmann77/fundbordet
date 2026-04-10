create or replace function public.get_my_shared_findings()
returns table (
  id uuid,
  user_id uuid,
  written_name text,
  material text,
  dating text,
  easting numeric,
  northing numeric,
  coordinates_visible boolean,
  dime_id text,
  created_at timestamptz,
  access_level text,
  shared_at timestamptz,
  owner_user_id uuid,
  shared_by_email text,
  owner_first_name text,
  owner_last_name text
)
language sql
security definer
set search_path = public, auth
as $$
  select
    findings_with_access.id,
    findings_with_access.user_id,
    findings_with_access.written_name,
    findings_with_access.material,
    findings_with_access.dating,
    findings_with_access.easting,
    findings_with_access.northing,
    findings_with_access.coordinates_visible,
    findings_with_access.dime_id,
    findings_with_access.created_at,
    findings_with_access.access_level,
    findings_with_access.shared_at,
    findings_with_access.owner_user_id,
    findings_with_access.shared_by_email,
    findings_with_access.owner_first_name,
    findings_with_access.owner_last_name
  from (
    select
      findings.id,
      findings.user_id,
      findings.written_name,
      findings.material,
      findings.dating,
      coordinate_access.coordinates_visible,
      case
        when coordinate_access.coordinates_visible then findings.easting
        else null
      end as easting,
      case
        when coordinate_access.coordinates_visible then findings.northing
        else null
      end as northing,
      findings.dime_id,
      findings.created_at,
      'shared'::text as access_level,
      finding_shares.created_at as shared_at,
      finding_shares.owner_user_id,
      owners.email::text as shared_by_email,
      coalesce(owner_profiles.first_name, '')::text as owner_first_name,
      coalesce(owner_profiles.last_name, '')::text as owner_last_name
    from public.finding_shares as finding_shares
    join public.findings as findings
      on findings.id = finding_shares.finding_id
    join auth.users as owners
      on owners.id = finding_shares.owner_user_id
    left join public.user_profiles as owner_profiles
      on owner_profiles.user_id = finding_shares.owner_user_id
    cross join lateral (
      select public.has_confirmed_friendship(
        finding_shares.owner_user_id,
        finding_shares.shared_with_user_id
      ) as coordinates_visible
    ) as coordinate_access
    where finding_shares.shared_with_user_id = auth.uid()
  ) as findings_with_access
  order by findings_with_access.created_at desc;
$$;

revoke all on function public.get_my_shared_findings() from public;
grant execute on function public.get_my_shared_findings() to authenticated;