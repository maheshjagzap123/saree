# 03 — Database & Supabase Architecture

```text
React Frontend
      │
      ▼
Supabase
 ├── Authentication
 ├── PostgreSQL
 ├── Storage
 ├── RLS
 └── Edge Functions
```

Because this is a real e-commerce system, **relational design is appropriate** (unlike a
toy project). Use proper foreign keys and join tables.

## Tables (initial structure)

```text
profiles
products
product_images
categories
collections
product_categories        (join)
product_collections       (join)
wishlists / wishlist_items
carts / cart_items
addresses
orders / order_items
reviews
coupons / coupon_usage
banners
testimonials
blog_posts / blog_categories
site_settings
```

## `products` columns

```text
id, name, slug, sku, description, short_description,
price, compare_at_price, stock_quantity,
category_id, collection_id,
fabric, color, weave_type, border_type, motif, occasion,
saree_length, saree_width, blouse_included,
status, is_featured, is_bestseller, is_new,
created_at, updated_at
```

## Relationships

```text
products
   ├── product_images   (1→many)
   ├── categories        (via product_categories)
   ├── collections       (via product_collections)
   ├── reviews           (1→many)
   └── order_items       (1→many)
```

## Storage buckets

```text
product-images   collection-images   blog-images
banner-images    avatars
```

Prefer optimized WebP/AVIF. Use descriptive file names (see SEO doc).

## Authentication

Supabase Auth. Start with: email/password, optional Google login, password reset, email
verification. Later: OTP login if required.

## Roles

Minimum: `customer`, `admin`. Future: `manager`, `content_editor`.

## Row Level Security (mandatory)

- Customers can only access their own profile, wishlist, cart, addresses, orders.
- Public can read published products, collections, blog posts.
- Admins manage business data.

## Security checklist

Supabase RLS · protected admin routes · role checking · input validation · secure storage
policies · **no service-role key in frontend** · environment variables · server-side
validation where necessary · rate limiting for sensitive operations · secure payment
integration if added.

## Current foundation note

The running app currently uses **mock/local data** (`src/data/`) and local Context for
cart/wishlist so it works with no backend. The SQL schema lives in
`supabase/schema.sql` and is ready to apply when the Supabase project is created.
`src/lib/supabase.js` is a stub that reads env vars and warns if they are missing.


## Cart & Wishlist sync (cross-device)

Signed-in customers get a cart and wishlist that follow them across devices; guests keep
theirs in `localStorage` only. Add-to-bag and wishlist both require sign-in, so server
writes only happen for authenticated users.

Migration: `supabase/migration_cart_wishlist_sync.sql` (run after `schema.sql` +
`migration_auth_admin.sql`; idempotent). It:

- Enables RLS on `wishlists`, `wishlist_items`, `carts`, `cart_items`.
- Adds owner-scoped policies (`auth.uid() = user_id`) plus an `admin read` SELECT policy
  on each so admins can view carts/wishlists for support without customers seeing each
  other's data.
- Adds `unique (user_id)` on `wishlists` and `carts` so "one cart / one wishlist per user"
  is enforced and `upsert(..., { onConflict: 'user_id' })` is deterministic.

Client flow (`src/context/StoreContext.jsx` + `src/services/syncService.js`):

1. **Guest** — cart/wishlist live in `localStorage` (`vastraa.cart`, `vastraa.wishlist`).
2. **On sign-in** — merge the guest's local items into the server (`mergeCart` sums
   quantities for duplicates; `mergeWishlist` unions product ids), then adopt the server
   state as the source of truth.
3. **While signed in** — every mutation updates local state optimistically for a snappy
   UI, then mirrors to Supabase in the background (`setCartItem` / `removeCartItem` /
   `clearCart` / `addWishlistItem` / `removeWishlistItem`). Failures are logged, not
   thrown; the next sign-in reconciles any drift.
4. **On sign-out** — the in-memory bag/wishlist are cleared so one account's items don't
   linger for the next visitor on a shared device. (Compare is not account-bound.)

Product ids stored in `cart_items`/`wishlist_items` are the real `products.id` UUIDs, so a
deleted product's cart line is simply dropped on the next load (`loadCart` filters rows
whose joined product is null).
