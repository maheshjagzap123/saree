# 10 — Deploying to Cloudflare Pages

This app is a static **Vite + React SPA** that talks to **Supabase** from the browser.
Cloudflare Pages serves the built static files; Supabase stays as-is (no server to deploy).

## What's already set up in the repo
- `public/_redirects` → `/*  /index.html  200` so deep links (e.g. `/shop`, `/products/..`)
  work on refresh (SPA routing). Copied into `dist/` automatically.
- `public/_headers` → security headers + long cache for `/assets/*`. Includes
  `Permissions-Policy: geolocation=(self)` so "Use my current location" keeps working.
- `package.json` → `engines.node >= 20`.
- `VITE_SITE_URL` → used for canonical/OpenGraph; set it to your real domain in prod.

---

## Step 1 — Connect the repo
1. Go to **Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git**.
2. Authorise GitHub and pick the repo **maheshjagzap123/saree**.
3. Production branch: **main**.

## Step 2 — Build settings
Set these in the Pages project build configuration:

| Field | Value |
|-------|-------|
| Framework preset | **Vite** (or "None") |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave blank)* |
| Node version | 20 (via `engines`, or set `NODE_VERSION=20` env var) |

## Step 3 — Environment variables (REQUIRED)
In **Settings → Environment variables → Production** (and Preview), add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://bdldguyunzwkjtwlwnkz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | your Supabase anon/public key |
| `VITE_WHATSAPP_NUMBER` | e.g. `919876543210` (country code, no +) |
| `VITE_SITE_URL` | your Pages URL or custom domain, e.g. `https://vastraa.pages.dev` |

> These are build-time variables (Vite inlines `VITE_*` at build). After changing any of
> them, trigger a new deploy (Deployments → Retry/Redeploy) so they take effect.
> Only the **anon** key goes here — never the service-role key.

## Step 4 — Deploy
Click **Save and Deploy**. Cloudflare runs `npm install` + `npm run build` and publishes `dist`.
You get a URL like `https://saree-xxx.pages.dev`.

## Step 5 — Supabase: allow your domain
In **Supabase → Authentication → URL Configuration**:
- **Site URL:** your Pages URL (e.g. `https://saree-xxx.pages.dev`)
- **Redirect URLs:** add the Pages URL and any custom domain.
This matters for auth email links / redirects. (Supabase Storage images are public, so they
load without extra config.)

## Step 6 — Custom domain (optional)
Pages → your project → **Custom domains → Set up a domain**, add your domain and follow the
DNS steps. Then update `VITE_SITE_URL` to that domain and redeploy, and add it to Supabase
redirect URLs.

---

## Important notes / gotchas
- **Geolocation needs HTTPS** — Cloudflare Pages is HTTPS by default, so "Use my current
  location" works in production (it won't on plain `http://`).
- **`.env` is NOT deployed** — it's gitignored. Cloudflare uses the env vars you set in Step 3.
- **Auth email confirmation** — if sign-ups should log in instantly, turn OFF
  "Confirm email" in Supabase → Authentication → Email (dashboard toggle).
- **Local admin scripts** (`scripts/*.mjs`) use `pg` + the DB password; they are NOT part of
  the deployed app and never run on Cloudflare.
- After deploy, test: open the site, hard-refresh on `/shop` (should NOT 404), sign in, add
  to bag, checkout, and the admin at `/admin`.
