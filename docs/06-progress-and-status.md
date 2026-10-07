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
| Supabase client stub | ✅ | reads env, warns if missing |
| DB schema SQL | ✅ | `supabase/schema.sql` (ready to apply) |

## Pending (future passes)

| Area | Status | Notes |
|------|--------|-------|
| Real Supabase project + env wiring | ⬜ | create project, set `.env` |
| Apply schema + RLS policies | ⬜ | run `supabase/schema.sql`, add policies |
| Auth (email/password, Google, reset) | ⬜ | |
| Storage buckets + upload | ⬜ | product/collection/blog/banner/avatars |
| Admin dashboard + product CRUD | ⬜ | Phase 4 |
| Image management (reorder, primary) | ⬜ | |
| Collections/categories admin | ⬜ | |
| Orders admin + status/tracking | ⬜ | |
| Customer account area | ⬜ | profile, orders, addresses, settings |
| Checkout flow + payment | ⬜ | Phase 6 |
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
