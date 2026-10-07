# 02 — Design System

The look is **editorial luxury**: generous whitespace, restrained motion, premium serif
headlines over clean sans body. Never Bootstrap-generic.

## Color palette

| Token | Use | Hex |
|-------|-----|-----|
| Ivory | Primary background | `#FBF8F3` |
| Cream | Secondary surface | `#F3ECE1` |
| Soft Beige | Borders / muted surfaces | `#E7DCCB` |
| Deep Wine | Primary brand / CTAs | `#6E1023` |
| Royal Purple | Accent (Paithani) | `#4B1E5B` |
| Muted Gold | Zari accent / highlights | `#B08D57` |
| Charcoal | Text / headings | `#2A2522` |

Rules: wine for primary actions, gold used sparingly as an accent (never fill large areas),
purple for Paithani-specific accents, charcoal for text on ivory.

## Typography

- **Serif (display):** headings, hero, editorial sections. (e.g. Cormorant Garamond / Playfair.)
- **Sans (text):** navigation, product details, buttons, forms. (e.g. Inter / Jost.)
- Scale is large and airy for headings; comfortable line length for body.

## Core components (shared UI)

```text
Header  AnnouncementBar  MegaMenu  Footer  Hero
CollectionCard  ProductCard  ProductGrid  ProductGallery
FilterDrawer  SearchBar  WishlistButton  CartDrawer
QuantitySelector  ReviewCard  Breadcrumb  Newsletter
Testimonial  FAQ  WhatsAppButton  Button  Badge  Container  SectionHeading
```

## Animation rules

Use subtle motion only: hero text reveal, image fade, product hover, smooth nav, page
transitions, scroll reveal, image zoom. **Avoid** excessive bouncing, huge parallax, slow
transitions, animation on every element. Respect `prefers-reduced-motion`. Luxury = restraint.

## Responsive breakpoints

Design mobile-first. Test Mobile, Tablet, Laptop (1366), Desktop (1440), Large (1920),
on iPhone / Android / iPad. The mobile experience is a first-class design, not a squeezed
desktop.

## Accessibility

Semantic HTML, correct heading hierarchy, keyboard navigation, visible focus states, alt
text, accessible buttons, form labels, sufficient contrast, reduced-motion support.
Note: full WCAG compliance needs manual testing with assistive tech and expert review.

## Project structure (frontend)

```text
src/
  assets/
  components/   common/  layout/  product/  cart/  ui/
  pages/        public/  account/  admin/
  features/     auth/  products/  cart/  wishlist/  orders/  reviews/
  services/     productService  orderService  customerService
  hooks/  context/  lib/supabase.js  routes/  utils/  constants/  App.jsx
```

## State management

Keep it simple: React Context + local state + Supabase. Introduce a lightweight state
library only if genuinely needed for larger commerce state.
