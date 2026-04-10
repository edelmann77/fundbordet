drop function if exists public.get_all_findings_catalog();

create or replace function public.get_all_findings_catalog(
  search_term text default null,
  page_limit integer default 9,
  page_offset integer default 0
)
returns table (
  id uuid,
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
      findings.written_name,
      findings.material,
      findings.dating,
      findings.dime_id::text as dime_id,
      findings.created_at
    from public.findings as findings
    where
      search_term is null
      or search_term = ''
      or coalesce(findings.written_name, '') ilike '%' || search_term || '%'
      or coalesce(findings.material, '') ilike '%' || search_term || '%'
      or coalesce(findings.dating, '') ilike '%' || search_term || '%'
      or coalesce(findings.dime_id::text, '') ilike '%' || search_term || '%'
  )
  select
    filtered_findings.id,
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