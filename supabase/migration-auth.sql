-- MIGRACIÓN: si ya ejecutaste el schema.sql anterior (sin login)
-- Ejecuta ESTE archivo en SQL Editor después del schema antiguo

alter table public.transcriptions
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Borra filas anónimas antiguas (sin dueño)
delete from public.transcriptions where user_id is null;

-- Si la columna ya tiene datos tuyos asignados manualmente, omite el delete anterior.
-- Luego exige user_id en cada fila nueva:
alter table public.transcriptions
  alter column user_id set not null;

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

create index if not exists transcriptions_user_created_idx
  on public.transcriptions (user_id, created_at desc);
