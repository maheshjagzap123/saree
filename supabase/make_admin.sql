-- Promote a user to admin by email.
-- Run in the Supabase SQL editor AFTER the user has signed up once.
-- Replace the email below with your account's email.

update public.profiles p
set role = 'admin'
from auth.users u
where u.id = p.id
  and u.email = 'you@example.com';   -- <-- change this

-- Verify:
-- select u.email, p.role from public.profiles p join auth.users u on u.id = p.id where p.role = 'admin';
