# 07 — Premium Editorial Redesign (Pass 1)

_Date: 2026-10-07_

A visual + structural upgrade turning Vastraa Paithani from a competent saree catalogue
into a distinctive **digital atelier**. All existing functionality (auth, orders, admin,
RLS, Supabase, SEO) was preserved — this pass changed presentation, structure and copy,
plus added safe, additive database fields.

## Design tokens
- Added colours: `plum` #5A2A4D, `plum-soft` #7A4466, `gold-antique` #9C7B4A.
- Added `fade-up-slow` animation; new `Reveal` component for restrained scroll-in reveals
  (IntersectionObserver, honours `prefers-reduced-motion`).
- Lighter serif weights, more whitespace, calmer motion.

## Homepage — new curated editorial structure
Replaced the repeated "heading → 8 cards → view all" pattern with 12 distinct sections:
1. Cinematic hero (desktop + mobile image, staged reveal)
2. The Signature Piece (campaign-style single product)
3. Find Your Paithani (5 discovery paths: Bride / Celebration / Classic / Statement / Gift)
4. Paithani by Character (Single/Triple Muniya, Brocade, Tissue, Peacock, Asawali)
5. The Current Edit (4–6 curated products)
6. The Colour Story (editorial colour groups → filtered shop)
7. The Atelier (6-step craft journey: Silk → Colour → Motif → Loom → Weave → Finish)
8. Saree Stories (editorial split layout)
9. New Arrivals (compact)
10. Journal (editorial cards)
11. Personal Assistance (plum section, specialist + WhatsApp)
12. Final brand statement ("Not just a saree…")

## Navigation & footer
- Nav regrouped: **Discover · Sarees · The Craft · Journal · About** with data-driven mega
  panels; richer mobile drawer. (Old `MegaMenu.jsx` removed.)
- Footer: **Explore / The House / Assistance / Follow** + "Notes from the Atelier" newsletter.

## Product card
- Minimal luxury card: small category, serif name, short descriptor, price, quiet wishlist.
- "View Saree →" + Quick View reveal on hover; card is fully linked so nothing essential is
  hover-only (mobile-safe). Subtle image scale; at most one quiet badge.

## Product detail page
- Contextual WhatsApp ("Need help choosing?" with product name + SKU + URL).
- **Why This Saree?** — four points built only from real data (colour / weave / motif / occasion).
- Editorial sections: **The Story Behind the Saree**, Craft Details, How to Style, Care —
  driven by new DB fields with graceful fallbacks.
- **Complete the Look** (related) and **You Were Looking At** (recently viewed via localStorage).

## Checkout → "Order Request"
- Reframed as an order request (no online payment). Adds preferred contact method + order
  notes (stored inside the `shipping_address` jsonb — no schema change to orders).
- Success page shows a 6-step timeline: Order received → Availability confirmed → Preparing →
  Packed → Dispatched → Delivered.

## New page & routes
- **Craft Library**: `/craft` (index) and `/craft/:slug` (detail, lists related sarees).
- Shop now reads `?color=` to pre-select a colour filter (used by the homepage Colour Story).

## Database (additive migration — `supabase/migration_editorial_fields.sql`)
`products`: `product_story, craft_story, styling_notes, occasion_notes, care_instructions,
seo_title, seo_description, og_image, is_exclusive`.
`product_images`: `image_type, alt_text, display_order`.
`productService` now selects + maps the editorial text fields. Applied to the live DB.

## Verified
- `npm run build` passes clean; dev server boots clean.
- No functionality removed. Content with no verifiable basis (certifications, counts,
  guarantees) was intentionally avoided; editorial copy is placeholder and admin-editable.

## Deferred to Pass 2
- Guided "Find Your Saree" finder, product comparison, admin editor fields for the new
  editorial/SEO columns, admin image-type/alt/reorder UI, admin content CMS, dashboard charts,
  gallery zoom/fullscreen, richer Craft Library factual content, journal article pages.
