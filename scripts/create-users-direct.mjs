// Creates confirmed users directly in auth.users (bypasses the email-sending signup
// path and its rate limit). Uses Supabase's bcrypt via pgcrypto. Idempotent.
import pg from 'pg'

const USERS = [
  { email: 'admin@vastraa.com', password: 'Admin@12345', name: 'Store Admin', role: 'admin' },
  { email: 'customer@vastraa.com', password: 'Customer@12345', name: 'Demo Customer', role: 'customer' },
]

const client = new pg.Client({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 5432,
  user: `postgres.${process.env.PROJECT_REF}`, password: process.env.PGPASSWORD,
  database: 'postgres', ssl: { rejectUnauthorized: false },
})
await client.connect()
await client.query('create extension if not exists pgcrypto')

// Clean up the leftover test user.
await client.query(`delete from auth.users where email like 'e2e_%@gmail.com'`)

for (const u of USERS) {
  // Remove existing (so we can set a known password), then insert fresh.
  await client.query('delete from auth.users where email = $1', [u.email])

  const { rows } = await client.query(
    `insert into auth.users
       (instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, created_at, updated_at,
        raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous)
     values
       ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
        $1, crypt($2, gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', $3::text),
        false, false)
     returning id`,
    [u.email, u.password, u.name]
  )
  const id = rows[0].id

  // Identity row (required for email login in newer GoTrue).
  await client.query(
    `insert into auth.identities
       (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
     values ($1::text, $2::uuid, jsonb_build_object('sub', $1::text, 'email', $3::text), 'email', now(), now(), now())
     on conflict do nothing`,
    [id, id, u.email]
  )

  // Profile row + role.
  await client.query(
    `insert into public.profiles (id, full_name, role) values ($1, $2, $3)
     on conflict (id) do update set role = excluded.role, full_name = excluded.full_name`,
    [id, u.name, u.role]
  )
  console.log(`created ${u.email} (${u.role})`)
}

await client.end()
console.log('done')
