-- Meri Kahani, Meri Zubani — Supabase schema
-- Run once: Supabase dashboard → SQL Editor → New query → paste all of this → Run.

-- ---------- Profiles (one per account) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text unique not null check (username ~ '^[a-z0-9_]{3,24}$'),
  name       text not null check (char_length(name) between 1 and 60),
  village    text not null default '' check (char_length(village) <= 60),
  trade      text not null default '' check (char_length(trade) <= 60),
  created_at timestamptz not null default now()
);

-- Create the profile automatically when someone signs up (details come from sign-up metadata).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username, name, village, trade)
  values (
    new.id,
    lower(new.raw_user_meta_data->>'username'),
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), 'Member'),
    coalesce(new.raw_user_meta_data->>'village', ''),
    coalesce(new.raw_user_meta_data->>'trade', '')
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- Stories ----------
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  author       uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  author_name  text not null,
  author_trade text not null default '',
  village      text not null default '' check (char_length(village) <= 60),
  title        text not null check (char_length(title) between 1 and 120),
  body         text not null check (char_length(body) between 20 and 8000),
  category     text not null check (category in ('shop','market','craft','food','beauty','shg','money','learning')),
  media        jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists posts_created_idx on public.posts (created_at desc);

-- ---------- Claps ("Shabaash!") and comments ----------
-- item_id is 's:<profile id>' for the six field stories or 'p:<post id>' for community stories.
create table if not exists public.claps (
  item_id    text not null,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (item_id, user_id)
);
create table if not exists public.comments (
  id         bigint generated always as identity primary key,
  item_id    text not null,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  name       text not null,
  body       text not null check (char_length(body) between 1 and 800),
  created_at timestamptz not null default now()
);
create index if not exists comments_item_idx on public.comments (item_id, created_at);

-- ---------- Row-level security: anyone can read; members change only their own rows ----------
alter table public.profiles enable row level security;
alter table public.posts    enable row level security;
alter table public.claps    enable row level security;
alter table public.comments enable row level security;

drop policy if exists "profiles are public"      on public.profiles;
drop policy if exists "update own profile"       on public.profiles;
create policy "profiles are public"  on public.profiles for select using (true);
create policy "update own profile"   on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "posts are public"         on public.posts;
drop policy if exists "insert own posts"         on public.posts;
drop policy if exists "update own posts"         on public.posts;
drop policy if exists "delete own posts"         on public.posts;
create policy "posts are public"     on public.posts for select using (true);
create policy "insert own posts"     on public.posts for insert to authenticated with check (author = auth.uid());
create policy "update own posts"     on public.posts for update to authenticated using (author = auth.uid()) with check (author = auth.uid());
create policy "delete own posts"     on public.posts for delete to authenticated using (author = auth.uid());

drop policy if exists "claps are public"         on public.claps;
drop policy if exists "add own clap"             on public.claps;
drop policy if exists "remove own clap"          on public.claps;
create policy "claps are public"     on public.claps for select using (true);
create policy "add own clap"         on public.claps for insert to authenticated with check (user_id = auth.uid());
create policy "remove own clap"      on public.claps for delete to authenticated using (user_id = auth.uid());

drop policy if exists "comments are public"      on public.comments;
drop policy if exists "add own comment"          on public.comments;
drop policy if exists "delete own comment"       on public.comments;
create policy "comments are public"  on public.comments for select using (true);
create policy "add own comment"      on public.comments for insert to authenticated with check (user_id = auth.uid());
create policy "delete own comment"   on public.comments for delete to authenticated using (user_id = auth.uid());

-- ---------- Photo / video / voice-note storage ----------
-- Public bucket, 15 MB per file, images, video and audio only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 15728640, array['image/*','video/*','audio/*'])
on conflict (id) do update set public = true, file_size_limit = 15728640, allowed_mime_types = array['image/*','video/*','audio/*'];

-- Members may upload only inside a folder named after their own user id, and delete only their own files.
drop policy if exists "read own media"           on storage.objects;
drop policy if exists "upload to own folder"     on storage.objects;
drop policy if exists "delete own media"         on storage.objects;
-- Public files are served by URL without a policy; this one lets members list and remove their own files.
create policy "read own media"       on storage.objects for select to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "upload to own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "delete own media"     on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
