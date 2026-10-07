-- Vastraa Paithani — initial PostgreSQL schema for Supabase.
-- Apply in the Supabase SQL editor. RLS policies are sketched at the end; review and
-- tighten before production. See docs/03-database-and-supabase.md.

-- ---------- Enums ----------
create type product_status as enum ('draft', 'published', 'archived');
create type order_status as enum ('placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
create type user_role as enum ('customer', 'admin');

-- ---------- Profiles ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now()
);

-- ---------- Catalog ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  cover_image text,
  seo_title text,
  seo_description text,
  status product_status not null default 'published',
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sku text unique,
  description text,
  short_description text,
  price numeric(12,2) not null,
  compare_at_price numeric(12,2),
  stock_quantity int not null default 0,
  category_id uuid references categories(id) on delete set null,
  collection_id uuid references collections(id) on delete set null,
  fabric text,
  color text,
  weave_type text,
  border_type text,
  motif text,
  occasion text,
  saree_length text,
  saree_width text,
  blouse_included boolean default true,
  status product_status not null default 'draft',
  is_featured boolean not null default false,
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text,
  position int not null default 0,
  is_primary boolean not null default false
);

-- Many-to-many joins (optional if a product can belong to multiple categories/collections)
create table if not exists product_categories (
  product_id uuid references products(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (product_id, category_id)
);
create table if not exists product_collections (
  product_id uuid references products(id) on delete cascade,
  collection_id uuid references collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

-- ---------- Customer data ----------
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  line1 text,
  line2 text,
  city text,
  state text,
  postal_code text,
  country text default 'India',
  is_default boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists wishlist_items (
  wishlist_id uuid references wishlists(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  primary key (wishlist_id, product_id)
);

create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists cart_items (
  cart_id uuid references carts(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity int not null default 1,
  primary key (cart_id, product_id)
);

-- ---------- Orders ----------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  user_id uuid references auth.users(id) on delete set null,
  status order_status not null default 'placed',
  subtotal numeric(12,2) not null default 0,
  shipping numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  shipping_address jsonb,
  tracking_number text,
  internal_notes text,
  created_at timestamptz not null default now()
);
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name text,
  price numeric(12,2) not null,
  quantity int not null default 1
);

-- ---------- Content & marketing ----------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  rating int check (rating between 1 and 5),
  title text,
  body text,
  approved boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value numeric(12,2) not null,
  min_order numeric(12,2) default 0,
  max_discount numeric(12,2),
  starts_at timestamptz,
  ends_at timestamptz,
  usage_limit int,
  active boolean not null default true
);
create table if not exists coupon_usage (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid references coupons(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  order_id uuid references orders(id) on delete set null,
  used_at timestamptz not null default now()
);

create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  image text,
  link text,
  position int default 0,
  active boolean not null default true
);
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author text,
  quote text,
  rating int check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  cover_image text,
  category_id uuid references blog_categories(id) on delete set null,
  seo_title text,
  seo_description text,
  status product_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value jsonb
);

-- ---------- RLS (enable + starter policies) ----------
alter table profiles        enable row level security;
alter table products        enable row level security;
alter table collections     enable row level security;
alter table categories      enable row level security;
alter table addresses       enable row level security;
alter table orders          enable row level security;
alter table order_items     enable row level security;
alter table reviews         enable row level security;

-- Public can read published catalog.
create policy "public read products" on products
  for select using (status = 'published');
create policy "public read collections" on collections
  for select using (status = 'published');
create policy "public read categories" on categories
  for select using (true);

-- A customer owns their profile row.
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- A customer can manage their own addresses and read their own orders.
create policy "own addresses" on addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own orders read" on orders
  for select using (auth.uid() = user_id);

-- Approved reviews are public.
create policy "public read approved reviews" on reviews
  for select using (approved = true);

-- NOTE: Admin write policies (role = 'admin') and more granular rules must be added
-- before production. Keep the service-role key server-side only.
