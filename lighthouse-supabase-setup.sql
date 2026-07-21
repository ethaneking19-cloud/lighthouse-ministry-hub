-- Lighthouse Ministry Hub Supabase setup
-- Run this in Supabase SQL Editor after creating your free project.

create table if not exists public.ministry_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ministry_app_state (
  id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

alter table public.ministry_staff enable row level security;
alter table public.ministry_app_state enable row level security;

drop policy if exists "Staff can read their own staff profile" on public.ministry_staff;
create policy "Staff can read their own staff profile"
  on public.ministry_staff
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Active staff can read ministry app state" on public.ministry_app_state;
create policy "Active staff can read ministry app state"
  on public.ministry_app_state
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.ministry_staff staff
      where staff.user_id = auth.uid()
        and staff.is_active = true
    )
  );

drop policy if exists "Active staff can create ministry app state" on public.ministry_app_state;
create policy "Active staff can create ministry app state"
  on public.ministry_app_state
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.ministry_staff staff
      where staff.user_id = auth.uid()
        and staff.is_active = true
    )
  );

drop policy if exists "Active staff can update ministry app state" on public.ministry_app_state;
create policy "Active staff can update ministry app state"
  on public.ministry_app_state
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.ministry_staff staff
      where staff.user_id = auth.uid()
        and staff.is_active = true
    )
  )
  with check (
    exists (
      select 1
      from public.ministry_staff staff
      where staff.user_id = auth.uid()
        and staff.is_active = true
    )
  );

-- After creating a staff user in Authentication > Users, copy their User UID
-- and run this once for each approved staff member:
--
-- insert into public.ministry_staff (user_id, display_name)
-- values ('PASTE-AUTH-USER-UID-HERE', 'Staff Name');
