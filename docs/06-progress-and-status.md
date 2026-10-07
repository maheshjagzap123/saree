# 06 — Progress & Status (living tracker)

_Last updated: 2026-10-07_

## Legend
✅ done · 🟡 partial / mock-data · ⬜ not started

## Foundation (this build)

| Area | Status | Notes |
|------|--------|-------|
| Vite + React + Tailwind project | ✅ | JavaScript |
| Routing (React Router) | ✅ | public routes wired |
| Design system (colors, type, tokens) | ✅ | Tailwind theme |
| UI primitives (Button, Badge, Container, SectionHeading) | ✅ | |
| Layout (announcement bar, header, mega menu, footer, WhatsApp btn) | ✅ | announcement text hardcoded for now |
| Cart + Wishlist (Context) | 🟡 | local state, no persistence |
| Mock product/collection data | 🟡 | `src/data/` |
| Homepage (all editorial sections) | ✅ | mock data |
| Shop (filters + sort + grid) | ✅ | client-side filtering of mock data |
| Product detail page | ✅ | gallery + info + add to bag |
| Collections index + details | ✅ | mock data |
| About / Contact / Journal / 404 | ✅ | content pages (basic) |
| Store page (local SEO) | ✅ | address/hours/directions + LocalBusiness schema |
| FAQ page | ✅ | accordion + FAQPage schema |
| Shipping / Returns / Privacy / Terms | ✅ | placeholder copy, ready to replace |
| Search (name/sku/collection/color/motif/weave) | ✅ | `/search?q=`, client-side over mock data |
| Quick View modal | ✅ | from product cards |
| Cart drawer | ✅ | |
| SEO per-page meta helper (Seo component) | ✅ | title, description, canonical, OG |
| robots.txt | ✅ | allow/block per plan |
| Supabase client + `.env` wired | ✅ | connects to project; anon key only |
| Data services (products/collections) | ✅ | Supabase reads + automatic mock fallback |
| DB schema SQL | ✅ | `supabase/schema.sql` (ready to apply) |
| Seed SQL | ✅ | `supabase/seed.sql` (demo catalog, ready to apply) |

## Pending (future passes)

| Area | Status | Notes |
|------|--------|-------|
| Apply schema + seed in Supabase | ✅ | applied via pooler; 5 collections, 8 products, 16 images live |
| Live data verified (anon read) | ✅ | public read policy confirmed working from the browser key |
| RLS policies (public/own/admin) | ✅ | applied + verified via `migration_auth_admin.sql` |
| Auth (email/password) | ✅ | signup/login/logout; no Google/reset by design |
| &nbsp;&nbsp;↳ email confirmation | ⚠️ | **ACTION:** turn OFF "Confirm email" in dashboard for instant login |
| Storage bucket + image upload | ✅ | `product-images` bucket (public) + admin upload in product editor |
| Admin dashboard + product CRUD | ✅ | `/admin` dashboard, products list + full editor |
| Image management (primary, remove) | ✅ | upload, set primary, delete in product editor |
| Collections/categories admin | ✅ | `/admin/collections`, `/admin/categories` |
| Orders admin + status/tracking | ✅ | `/admin/orders` list + detail, status + tracking |
| Customer account area | ✅ | account, orders, order detail + tracking, addresses, profile, wishlist |
| Checkout flow (no payment) | ✅ | details → review → place order; writes order + items |
| &nbsp;&nbsp;↳ online payment | ⬜ | intentionally skipped (pay on delivery / WhatsApp) |
| Journal articles + Article schema | 🟡 | index built, article pages pending |
| Reviews, coupons, banners CMS | ⬜ | V2 |
| Homepage CMS (admin-editable content) | ⬜ | Phase 53 |
| XML sitemap generation | ⬜ | |
| Product/Organization/LocalBusiness/FAQ/Breadcrumb schema | ✅ | implemented on relevant pages (mock data) |
| GA4 + Search Console | ⬜ | post-deploy |
| Performance pass (Lighthouse/CWV) | ⬜ | Phase 9 |
| Deployment (Vercel + Supabase + domain) | ⬜ | Phase 10 |

## How to extend

1. Create a Supabase project; put URL + anon key in `.env` (see `.env.example`).
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Replace mock data reads in `src/data/` / services with Supabase queries.
4. Add RLS policies per `docs/03-database-and-supabase.md`.
5. Build admin (Phase 4), then checkout (Phase 6), then SEO data wiring (Phase 8).
