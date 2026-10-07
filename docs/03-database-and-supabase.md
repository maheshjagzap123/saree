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
