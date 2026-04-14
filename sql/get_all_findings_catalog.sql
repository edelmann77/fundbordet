drop function if exists public.get_all_findings_catalog();

create or replace function public.get_all_findings_catalog(
  search_term text default null,
  page_limit integer default 9,
  page_offset integer default 0
)
returns table (
  id uuid,
  owner_user_id uuid,
  owner_email text,
  owner_first_name text,
  owner_last_name text,
  written_name text,
  material text,
  dating text,
  dime_id text,
  created_at timestamptz,
  total_count bigint
)
language sql
security definer
set search_path = public, auth
as $$
  with filtered_findings as (
    select
      findings.id,
      findings.user_id as owner_user_id,
      owners.email::text as owner_email,
      coalesce(owner_profiles.first_name, '')::text as owner_first_name,
      coalesce(owner_profiles.last_name, '')::text as owner_last_name,
      findings.written_name,
      findings.material,
      findings.dating,
      findings.dime_id::text as dime_id,
      findings.created_at
    from public.findings as findings
    join auth.users as owners
      on owners.id = findings.user_id
    left join public.user_profiles as owner_profiles
      on owner_profiles.user_id = findings.user_id
    where
      search_term is null
      or search_term = ''
      or coalesce(findings.written_name, '') ilike '%' || search_term || '%'
      or coalesce(findings.material, '') ilike '%' || search_term || '%'
      or coalesce(findings.dating, '') ilike '%' || search_term || '%'
      or coalesce(findings.dime_id::text, '') ilike '%' || search_term || '%'
        or findings.id::text = search_term
  )
  select
    filtered_findings.id,
    filtered_findings.owner_user_id,
    filtered_findings.owner_email,
    filtered_findings.owner_first_name,
    filtered_findings.owner_last_name,
    filtered_findings.written_name,
    filtered_findings.material,
    filtered_findings.dating,
    filtered_findings.dime_id,
    filtered_findings.created_at,
    count(*) over() as total_count
  from filtered_findings
  order by filtered_findings.created_at desc
  limit greatest(page_limit, 1)
  offset greatest(page_offset, 0);
$$;

revoke all on function public.get_all_findings_catalog(text, integer, integer) from public;
grant execute on function public.get_all_findings_catalog(text, integer, integer) to authenticated;