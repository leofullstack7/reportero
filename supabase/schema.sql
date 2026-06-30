-- Esquema completo (proyecto nuevo)
-- Dashboard: https://supabase.com/dashboard/project/pwthbquwdlybhbwekbgw/sql

create table if not exists public.transcriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  source text not null default 'whisper' check (source in ('whisper', 'browser')),
  summary text,
  created_at timestamptz not null default now()
);

create index if not exists transcriptions_user_created_idx
  on public.transcriptions (user_id, created_at desc);

alter table public.transcriptions enable row level security;

-- Eliminar políticas públicas antiguas (si existían)
drop policy if exists "anon_select_transcriptions" on public.transcriptions;
drop policy if exists "anon_insert_transcriptions" on public.transcriptions;
drop policy if exists "anon_update_transcriptions" on public.transcriptions;
drop policy if exists "anon_delete_transcriptions" on public.transcriptions;

drop policy if exists "users_select_own" on public.transcriptions;
drop policy if exists "users_insert_own" on public.transcriptions;
drop policy if exists "users_update_own" on public.transcriptions;
drop policy if exists "users_delete_own" on public.transcriptions;

create policy "users_select_own"
  on public.transcriptions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users_insert_own"
  on public.transcriptions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users_update_own"
  on public.transcriptions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_delete_own"
  on public.transcriptions for delete
  to authenticated
  using (auth.uid() = user_id);
