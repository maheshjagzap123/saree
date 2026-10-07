# Vastraa Paithani

> The Art of Timeless Paithani

A premium **single-brand** Paithani / silk saree e-commerce platform.
Built with **React + Vite + Tailwind** on the frontend and **Supabase** (planned) for the backend.

This is a portfolio-grade, client-ready product. The storefront should feel like an
established premium Indian fashion brand — heritage, craftsmanship, exclusivity, trust,
luxury, authenticity, and modern shopping.

---

## Quick start

```bash
npm install
npm run dev      # start local dev server
npm run build    # production build
npm run preview  # preview the production build
```

Open the URL printed by Vite (default: http://localhost:5173).

### Connect Supabase (optional — the site runs on mock data without it)

1. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
   (anon/public key only — never the service-role key).
2. Apply the schema and seed. Either:
   - In the Supabase dashboard → SQL Editor, run `supabase/schema.sql`, then `supabase/seed.sql`; or
   - Run them from the CLI (requires the DB password; connects via the pooler):
     ```bash
     $env:PROJECT_REF="<your-project-ref>"; $env:PGPASSWORD="<db-password>"; $env:PGREGIONS="ap-southeast-1"
     node scripts/apply-sql.mjs supabase/schema.sql supabase/seed.sql
     ```
     `scripts/apply-sql.mjs` reads credentials from environment variables only (no secrets in the file).
3. Restart `npm run dev`. The app reads live data; if a query fails it falls back to mock data.

> Note: Supabase's direct `db.*` host is IPv6-only. On IPv4 networks use the connection
> pooler host `aws-0-<region>.pooler.supabase.com` with user `postgres.<project-ref>`.

### Auth + admin setup (two manual steps)

Accounts, checkout, orders, and the admin panel are built. Two things must be set in your
Supabase dashboard:

1. **Instant login (no email verification):**
   Authentication → Sign In / Providers → Email → turn **off** "Confirm email".
   Without this, new signups must confirm by email before they can log in.

2. **Make yourself admin** (to access `/admin`):
   Sign up once in the app, then in SQL Editor run `supabase/make_admin.sql`
   (edit the email first). Re-login to pick up the admin role.

Also apply `supabase/migration_auth_admin.sql` (adds the profiles trigger, admin role
helper, admin RLS policies, the `product-images` storage bucket, and the order-number
trigger) if you haven't already.

---

## What this repo contains right now

This is the **Phase 1-2 foundation** (brand, design system, React foundation, routing,
core components, public storefront shell, SEO framework) running on **mock/local data**
so the site works with no backend yet.

See the `docs/` folder for the complete product, page, database, SEO, and roadmap plans.

| Doc | Purpose |
|-----|---------|
| [docs/00-overview.md](docs/00-overview.md) | Vision, brand, positioning, audience |
| [docs/01-site-map-and-pages.md](docs/01-site-map-and-pages.md) | Every route and what each page contains |
| [docs/02-design-system.md](docs/02-design-system.md) | Colors, typography, components, animation rules |
| [docs/03-database-and-supabase.md](docs/03-database-and-supabase.md) | Tables, relationships, auth, RLS, storage |
| [docs/04-seo-plan.md](docs/04-seo-plan.md) | Technical + on-page + content + local SEO plan |
| [docs/05-roadmap-phases.md](docs/05-roadmap-phases.md) | 10 build phases, MVP vs V2 |
| [docs/06-progress-and-status.md](docs/06-progress-and-status.md) | Living tracker: done vs pending |

---

## Important project rule

The website should **never look like a developer portfolio pretending to be an
e-commerce store**. It should look like a real premium saree brand that happens to have
been engineered exceptionally well. The technology is invisible to the customer.

Do **not** make unsupported claims (e.g. "100% pure silk", "real gold zari", "certified")
unless the real shop can prove them. "Vastraa Paithani" is a temporary brand name and can
be swapped for the real client's shop name later.
