# 11 — Audit & Improvements

_Date: 2026-10_

A full audit of the live app followed by phased improvements. The stack, Supabase project,
schema, data, images, orders and working features were all preserved. Changes were made via
safe, additive migrations and targeted code edits — no rebuild, no destructive data changes.

## 1. Route & feature inventory (all working)
Public: `/` `/shop` `/collections` `/collections/:slug` `/products/:slug` `/about`
`/our-story` `/contact` `/journal` `/journal/:slug` (new) `/craft` `/craft/:slug` `/find`
`/compare` `/store` `/search`→redirects to `/shop` `/faq` `/shipping` `/returns` `/privacy`
`/terms` `/cart` `/login` `/signup`.
Protected customer: `/checkout` `/order-success` `/account` `/account/orders`
`/account/orders/:id` `/account/addresses` `/account/profile` `/account/wishlist`.
Admin (role-gated): `/admin` `/admin/products` `/admin/products/:id` `/admin/collections`
`/admin/categories` `/admin/orders`.

## 2. Problems found (prioritised)
1. **CRITICAL security** — `profiles` "own profile" RLS was `FOR ALL`, letting a signed-in
   customer set their own `role='admin'` (privilege escalation).
2. **No Journal article pages** — cards linked to the index only.
3. **No toasts; no loading skeletons** (plain "Loading…" text).
4. **Product detail** — no quantity selector; no fullscreen gallery / keyboard nav.
5. **Shop** — no active-filter chips, no Clear All, no empty state.

## 3. Fixes implemented
- **Security:** `supabase/migration_fix_profile_role.sql` (applied). `profiles` now has
  read-own, insert-own, update-own **with the role column locked to its current value**, and
  admin-manage-all. A customer can no longer escalate to admin. Verified against the DB.
- **Journal articles:** `journal[]` in `content.js` gained `author`, `published`, `updated`
  and a structured `body[]`; new `JournalArticle.jsx` at `/journal/:slug` with breadcrumbs,
  related articles and **Article JSON-LD**. Journal index is now an editorial layout
  (featured + grid) with working links; Home journal links point to real articles.
- **Toasts:** `ToastContext` (success/error, auto-dismiss, screen-reader live region) wired
  into add-to-bag and wishlist actions.
- **Skeletons & states:** `Skeleton` + `ProductGridSkeleton`; Shop shows a skeleton while
  loading and a clear empty state.
- **Product detail:** quantity selector (clamped to stock), add-to-bag respects quantity and
  shows a toast; **fullscreen Lightbox** gallery (click main image; ←/→/Esc keyboard nav;
  mobile-tappable) alongside the existing hover zoom.
- **Shop:** active filter chips (search + colour/fabric/border/price) with individual remove
  and **Clear all**.

## 4. Files changed
`supabase/migration_fix_profile_role.sql` (new, applied) ·
`src/data/content.js` (journal bodies + getArticle) ·
`src/pages/public/JournalArticle.jsx` (new) · `src/pages/public/Journal.jsx` ·
`src/pages/public/Home.jsx` (article links) · `src/App.jsx` (journal/:slug route) ·
`src/context/ToastContext.jsx` (new) · `src/main.jsx` (ToastProvider) ·
`src/components/ui/Skeleton.jsx` (new) ·
`src/components/product/Lightbox.jsx` (new) · `src/pages/public/Product.jsx` (qty, toast, lightbox) ·
`src/pages/public/Shop.jsx` (chips, clear all, skeleton, empty state).

## 5. Database migrations
- `migration_fix_profile_role.sql` — applied to the live project. Additive/idempotent;
  replaces one over-permissive policy with scoped ones. No data touched.

## 6. Build & test
- `npm run build` — passes clean. Dev server boots clean.

## 7. Still incomplete / future work
- Online payment (intentionally out of scope — order-request model).
- Email confirmation toggle is a Supabase dashboard setting (must be turned off there for
  instant signup).
- Admin content CMS for all homepage sections; reviews & coupons UI; XML sitemap; GA4;
  SSR/prerender for SEO (client-rendered today — fine for a portfolio, revisit if organic
  search becomes a priority).
- Occasion filter on Shop omitted (data not clean enough to be meaningful yet).

## 8. Manual actions still required
1. Supabase → Authentication → Email → turn **off** "Confirm email" for instant signup.
2. Rotate the Supabase DB password (it was shared during setup); the app uses only the anon key.
3. On Cloudflare, set env vars (see `docs/10-deployment-cloudflare.md`) and, after deploy,
   add the live URL to Supabase Auth URL configuration.
