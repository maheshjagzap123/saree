# 08 — Redesign Pass 2

_Date: 2026-10-07_

Builds on Pass 1. Adds the distinctive discovery UX and completes the admin tooling for the
editorial fields introduced in Pass 1. No existing functionality changed; all additive.

## Admin — product editor (full)
`ProductEditor` now has grouped sections and saves every field:
- **Basics:** name, slug, SKU, price, compare-at, stock, status, collection, category
- **Product Identity:** colour, fabric, weave, border, motif, occasion, length, width
- **Editorial:** short description, description, product story, craft story, styling notes,
  occasion notes, care instructions
- **SEO:** SEO title, SEO description, OG image
- **Merchandising:** blouse included, featured, bestseller, new, exclusive

These map to the columns added in `migration_editorial_fields.sql` and surface on the
product detail page (Why This Saree, the story/craft/styling/care sections).

## Admin — image management
Per image: **alt text**, **image type** (hero / full saree / drape / pallu / border / detail /
blouse / packaging / video thumbnail), **reorder** (↑/↓, persisted to `display_order`),
set primary, remove. Service additions: `updateProductImage`, `reorderProductImages`.

## Find Your Saree (guided finder) — `/find`
A four-step quiz (occasion → colour → style → budget) that scores existing products
client-side and shows the top 6 matches. No AI. Linked from the homepage "Find Your
Paithani" section and the Discover menu.

## Product comparison — `/compare`
Compare up to 3 sarees side by side (price, fabric, weave, colour, border, motif, occasion,
length, blouse, availability). A floating **compare bar** appears when items are selected;
each product card has a Compare toggle. State lives in `StoreContext` (`compare`,
`toggleCompare`, `removeCompare`, `clearCompare`) and persists to localStorage.

## Admin dashboard — charts
Lightweight inline-SVG charts (no chart library): revenue and order trend (last 14 days) and
a top-products bar list. Added `getSalesSeries`, `getTopProducts`, and `avgOrderValue` to the
admin service.

## Verified
- `npm run build` passes clean; dev server boots clean.

## Still pending (future)
- Admin content CMS (announcement/hero/testimonials/footer editable without code)
- Product gallery zoom / fullscreen / swipe
- Journal article pages + Article schema
- Richer Craft Library factual content
- Online payment, reviews, coupons UI, XML sitemap, GA4, deployment
