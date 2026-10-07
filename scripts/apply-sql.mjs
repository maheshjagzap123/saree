// Applies one or more .sql files to the Supabase Postgres database via the pooler.
// Tries each region in PGREGIONS until one authenticates, then runs the SQL files.
// Usage: node scripts/apply-sql.mjs supabase/schema.sql supabase/seed.sql
import { readFileSync } from 'node:fs'
import pg from 'pg'

const { Client } = pg

const ref = process.env.PROJECT_REF
const password = process.env.PGPASSWORD
const files = process.argv.slice(2)
const regions = (process.env.PGREGIONS || 'ap-south-1').split(',')

async function tryRegion(region) {
  const client = new Client({
    host: `aws-0-${region}.pooler.supabase.com`,
    port: 5432,
    user: `postgres.${ref}`,
    password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  })
  await client.connect()
  return client
}

let client = null
for (const region of regions) {
  try {
    process.stdout.write(`Trying region ${region} ... `)
    client = await tryRegion(region.trim())
    console.log('connected.')
    break
  } catch (e) {
    console.log(`failed (${e.message})`)
  }
}

if (!client) {
  console.error('Could not connect via any region. Need the correct project region.')
  process.exit(2)
}

try {
  for (const file of files) {
    const sql = readFileSync(file, 'utf8')
    process.stdout.write(`Running ${file} ... `)
    await client.query(sql)
    console.log('done.')
  }
} catch (e) {
  console.error('SQL ERROR:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
