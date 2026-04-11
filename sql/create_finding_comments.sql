create table if not exists public.finding_comments (
  id uuid primary key default gen_random_uuid(),
  finding_id uuid not null references public.findings (id) on delete cascade,
  author_user_id uuid not null references auth.users (id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.finding_comment_mentions (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.finding_comments (id) on delete cascade,
  finding_id uuid not null references public.findings (id) on delete cascade,
  mentioned_user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('friend', 'finder')),
  label text not null,
  start_index integer not null check (start_index >= 0),
  end_index integer not null check (end_index > start_index),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists finding_comments_finding_id_created_at_idx
on public.finding_comments (finding_id, created_at asc);

create index if not exists finding_comment_mentions_finding_id_comment_id_idx
on public.finding_comment_mentions (finding_id, comment_id, start_index asc);

alter table public.finding_comments enable row level security;
alter table public.finding_comment_mentions enable row level security;

grant select, insert on public.finding_comments to authenticated;
grant select, insert on public.finding_comment_mentions to authenticated;

drop policy if exists "Authenticated users can read comments" on public.finding_comments;
create policy "Authenticated users can read comments"
on public.finding_comments
for select
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can write own comments" on public.finding_comments;
create policy "Authenticated users can write own comments"
on public.finding_comments
for insert
to authenticated
with check (auth.uid() = author_user_id);

drop policy if exists "Authenticated users can read comment mentions" on public.finding_comment_mentions;
create policy "Authenticated users can read comment mentions"
on public.finding_comment_mentions
for select
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "Comment authors can write mentions" on public.finding_comment_mentions;
create policy "Comment authors can write mentions"
on public.finding_comment_mentions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.finding_comments as comments
    where comments.id = comment_id
      and comments.finding_id = finding_id
      and comments.author_user_id = auth.uid()
  )
);

create or replace function public.get_finding_comments(target_finding_id uuid)
returns table (
  id uuid,
  finding_id uuid,
  author_user_id uuid,
  author_email text,
  author_first_name text,
  author_last_name text,
  content text,
  created_at timestamptz,
  mentions jsonb
)
language sql
security definer
set search_path = public, auth
as $$
  select
    comments.id,
    comments.finding_id,
    comments.author_user_id,
    authors.email::text as author_email,
    coalesce(author_profiles.first_name, '')::text as author_first_name,
    coalesce(author_profiles.last_name, '')::text as author_last_name,
    comments.content,
    comments.created_at,
    coalesce(comment_mentions.mentions, '[]'::jsonb) as mentions
  from public.finding_comments as comments
  join auth.users as authors
    on authors.id = comments.author_user_id
  left join public.user_profiles as author_profiles
    on author_profiles.user_id = comments.author_user_id
  left join lateral (
    select jsonb_agg(
      jsonb_build_object(
        'id', mentions.id,
        'mentionedUserId', mentions.mentioned_user_id,
        'kind', mentions.kind,
        'label', mentions.label,
        'startIndex', mentions.start_index,
        'endIndex', mentions.end_index
      )
      order by mentions.start_index asc
    ) as mentions
    from public.finding_comment_mentions as mentions
    where mentions.comment_id = comments.id
  ) as comment_mentions
    on true
  where auth.uid() is not null
    and comments.finding_id = target_finding_id
  order by comments.created_at asc;
$$;

revoke all on function public.get_finding_comments(uuid) from public;
grant execute on function public.get_finding_comments(uuid) to authenticated;