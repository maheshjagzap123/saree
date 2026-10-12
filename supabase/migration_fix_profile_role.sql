-- Vastraa Paithani — SECURITY FIX: prevent customers from self-granting admin.
-- The old "own profile" policy was FOR ALL with check (auth.uid() = id), which allowed a
-- customer to UPDATE their own row and set role = 'admin'. We split it so a user can read
-- and update their OWN profile but can NEVER change the role column (admins change roles
-- via the service role / SQL only). Idempotent.

-- Drop the over-permissive combined policy.
drop policy if exists "own profile" on profiles;

-- Read own profile (admins can also read all — that policy already exists).
drop policy if exists "read own profile" on profiles;
create policy "read own profile" on profiles
  for select using (auth.uid() = id);

-- Insert own profile row (the signup trigger uses security definer, but allow this too).
drop policy if exists "insert own profile" on profiles;
create policy "insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Update own profile, but the role must stay what it already is (no self-escalation).
-- Compares the submitted role to the current stored role for this row.
drop policy if exists "update own profile no role change" on profiles;
create policy "update own profile no role change" on profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- Admins retain full management of profiles (role changes happen here).
drop policy if exists "admin manage profiles" on profiles;
create policy "admin manage profiles" on profiles
  for all using (public.is_admin()) with check (public.is_admin());
