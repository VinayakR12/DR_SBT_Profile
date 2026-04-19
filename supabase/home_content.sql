create table if not exists public.home_content_sections (
  section_key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.home_content_sections
  add column if not exists section_key text,
  add column if not exists content jsonb,
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

create unique index if not exists home_content_sections_section_key_uidx
  on public.home_content_sections (section_key);

alter table public.home_content_sections
  alter column section_key set not null,
  alter column content set not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'home_content_sections'
      and column_name = 'content'
      and data_type <> 'jsonb'
  ) then
    alter table public.home_content_sections
      alter column content type jsonb
      using case
        when content is null then '{}'::jsonb
        else content::jsonb
      end;
  end if;
end
$$;

alter table public.home_content_sections enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'home_content_sections'
      and policyname = 'Allow public read for home content'
  ) then
    create policy "Allow public read for home content"
      on public.home_content_sections
      for select
      using (true);
  end if;
end
$$;

comment on table public.home_content_sections is 'Section-level content for the public home page. Use the app backup file when a section is missing or Supabase is unavailable.';

insert into storage.buckets (id, name, public)
values ('home-profile-images', 'home-profile-images', true)
on conflict (id) do update
set public = excluded.public;