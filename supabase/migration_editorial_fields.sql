-- Vastraa Paithani — editorial fields migration (Pass 1 redesign).
-- ADDITIVE ONLY. Safe to re-run. Does not drop or alter existing columns/policies.

-- Rich editorial content per product (surfaced on the product detail page).
alter table products add column if not exists product_story text;
alter table products add column if not exists craft_story text;
alter table products add column if not exists styling_notes text;
alter table products add column if not exists occasion_notes text;
alter table products add column if not exists care_instructions text;

-- SEO per product (admin editor will manage these in Pass 2).
alter table products add column if not exists seo_title text;
alter table products add column if not exists seo_description text;
alter table products add column if not exists og_image text;

-- Extra merchandising flag.
alter table products add column if not exists is_exclusive boolean not null default false;

-- Product image metadata (type/alt/order) for the richer gallery.
alter table product_images add column if not exists image_type text;
alter table product_images add column if not exists alt_text text;
alter table product_images add column if not exists display_order int not null default 0;
