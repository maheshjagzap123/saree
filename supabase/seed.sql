-- Vastraa Paithani — demo seed data.
-- Run AFTER schema.sql, in the Supabase SQL editor. Safe to re-run (uses upserts on slug).
-- Loads 5 collections, 1 category, 8 products and their images, matching the mock catalog.

-- ---------- Collections ----------
insert into collections (name, slug, description, cover_image, status) values
  ('Traditional Paithani', 'traditional-paithani', 'Timeless Paithani weaves with signature muniya and peacock motifs.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=70', 'published'),
  ('Bridal Collection', 'bridal-paithani', 'Richly woven bridal Paithani to be treasured across generations.', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=70', 'published'),
  ('Silk Collection', 'silk-paithani', 'Pure and semi-silk sarees with a soft fall and a quiet sheen.', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1200&q=70', 'published'),
  ('Designer Paithani', 'designer-paithani', 'Contemporary interpretations of traditional weaving.', 'https://images.unsplash.com/photo-1617059062018-6b7c5e2b9b9c?auto=format&fit=crop&w=1200&q=70', 'published'),
  ('Festive Collection', 'festive-paithani', 'Vibrant weaves for Diwali, Gudi Padwa, pujas and family festivities.', 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=1200&q=70', 'published')
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, cover_image = excluded.cover_image, status = excluded.status;

-- ---------- Category ----------
insert into categories (name, slug, description) values
  ('Paithani', 'paithani', 'Handcrafted Paithani sarees.')
on conflict (slug) do nothing;

-- ---------- Products ----------
-- Helper: resolve collection_id by slug inline via subquery.
insert into products
  (name, slug, sku, description, short_description, price, compare_at_price, stock_quantity,
   collection_id, fabric, color, weave_type, border_type, motif, occasion,
   saree_length, saree_width, blouse_included, status, is_featured, is_bestseller, is_new)
values
  ('Royal Purple Single Muniya Paithani', 'royal-purple-single-muniya-paithani', 'VP-PTH-1001',
   'A classic single muniya Paithani handwoven in a deep royal purple, finished with a luminous peacock pallu and a fine muniya border.',
   'A regal single muniya Paithani in deep purple with a traditional peacock pallu.',
   24999, 29999, 4, (select id from collections where slug='traditional-paithani'),
   'Silk', 'Purple', 'Single Muniya', 'Muniya', 'Peacock', 'Wedding, Festive',
   '6.3 m (with blouse piece)', '1.1 m', true, 'published', true, true, false),

  ('Emerald Green Peacock Paithani', 'emerald-green-peacock-paithani', 'VP-PTH-1002',
   'An emerald green Paithani with a richly woven peacock border and a shimmering zari pallu, ideal for weddings and receptions.',
   'Emerald green Paithani with an intricate peacock border and zari pallu.',
   32999, null, 2, (select id from collections where slug='bridal-paithani'),
   'Pure Silk', 'Green', 'Triple Muniya', 'Peacock', 'Peacock', 'Bridal, Wedding',
   '6.3 m (with blouse piece)', '1.1 m', true, 'published', true, false, true),

  ('Classic Red Bridal Paithani', 'classic-red-bridal-paithani', 'VP-PTH-1003',
   'A timeless red bridal Paithani with a broad zari border and an elaborate pallu, woven for the most important day.',
   'A timeless red bridal Paithani with a wide zari border.',
   48999, 54999, 3, (select id from collections where slug='bridal-paithani'),
   'Pure Silk', 'Red', 'Triple Muniya', 'Temple', 'Lotus', 'Bridal, Wedding',
   '6.3 m (with blouse piece)', '1.1 m', true, 'published', true, true, false),

  ('Rani Pink Muniya Border Paithani', 'rani-pink-muniya-border-paithani', 'VP-PTH-1004',
   'A joyful rani pink Paithani with a fine muniya border and a soft silk fall, perfect for festive occasions.',
   'A joyful rani pink Paithani with a delicate muniya border.',
   18999, 21999, 8, (select id from collections where slug='festive-paithani'),
   'Semi Silk', 'Pink', 'Single Muniya', 'Muniya', 'Parrot', 'Festive, Puja',
   '6.3 m (with blouse piece)', '1.1 m', true, 'published', false, false, true),

  ('Peacock Blue Designer Paithani', 'peacock-blue-designer-paithani', 'VP-PTH-1005',
   'A contemporary peacock-blue Paithani that reinterprets traditional motifs with a modern palette and refined finishing.',
   'A modern peacock-blue Paithani with contemporary detailing.',
   27999, null, 5, (select id from collections where slug='designer-paithani'),
   'Silk', 'Blue', 'Designer', 'Asawali', 'Vine', 'Festive, Reception',
   '6.3 m (with blouse piece)', '1.1 m', true, 'published', true, false, true),

  ('Black Gold Tissue Paithani', 'black-gold-tissue-paithani', 'VP-PTH-1006',
   'A striking black Paithani with a tissue-gold sheen and an ornate pallu, made for evening celebrations.',
   'A striking black Paithani with a tissue-gold sheen.',
   36999, 41999, 2, (select id from collections where slug='designer-paithani'),
   'Tissue', 'Black', 'Designer', 'Narali', 'Floral', 'Reception, Festive',
   '6.3 m (with blouse piece)', '1.1 m', true, 'published', false, true, false),

  ('Marigold Orange Festive Paithani', 'marigold-orange-festive-paithani', 'VP-PTH-1007',
   'A warm marigold-orange Paithani with a traditional border, bringing festive cheer to pujas and family gatherings.',
   'A warm marigold Paithani for pujas and festivities.',
   15999, 18999, 10, (select id from collections where slug='festive-paithani'),
   'Semi Silk', 'Orange', 'Single Muniya', 'Muniya', 'Parrot', 'Puja, Festive',
   '6.3 m (with blouse piece)', '1.1 m', true, 'published', false, false, false),

  ('Wine Signature Bridal Paithani', 'wine-signature-bridal-paithani', 'VP-PTH-1008',
   'A signature-edit wine Paithani with the finest zari work and an elaborate pallu, a true heirloom bridal piece.',
   'A signature-edit wine Paithani with the finest zari work.',
   89999, 99999, 1, (select id from collections where slug='traditional-paithani'),
   'Pure Silk', 'Multicolor', 'Triple Muniya', 'Peacock', 'Peacock', 'Bridal, Wedding',
   '6.3 m (with blouse piece)', '1.1 m', true, 'published', true, true, false)
on conflict (slug) do update set
  price = excluded.price, compare_at_price = excluded.compare_at_price,
  stock_quantity = excluded.stock_quantity, status = excluded.status,
  is_featured = excluded.is_featured, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new;

-- ---------- Product images ----------
-- Clear and re-insert images for the seeded products so re-running stays clean.
delete from product_images
where product_id in (select id from products where sku like 'VP-PTH-10%');

insert into product_images (product_id, url, position, is_primary)
select p.id, i.url, i.position, i.is_primary
from products p
join (
  values
    ('VP-PTH-1001', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=70', 0, true),
    ('VP-PTH-1001', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=70', 1, false),
    ('VP-PTH-1002', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&q=70', 0, true),
    ('VP-PTH-1002', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=70', 1, false),
    ('VP-PTH-1003', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=70', 0, true),
    ('VP-PTH-1003', 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=900&q=70', 1, false),
    ('VP-PTH-1004', 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=900&q=70', 0, true),
    ('VP-PTH-1004', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&q=70', 1, false),
    ('VP-PTH-1005', 'https://images.unsplash.com/photo-1617059062018-6b7c5e2b9b9c?auto=format&fit=crop&w=900&q=70', 0, true),
    ('VP-PTH-1005', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=70', 1, false),
    ('VP-PTH-1006', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&q=70', 0, true),
    ('VP-PTH-1006', 'https://images.unsplash.com/photo-1617059062018-6b7c5e2b9b9c?auto=format&fit=crop&w=900&q=70', 1, false),
    ('VP-PTH-1007', 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=900&q=70', 0, true),
    ('VP-PTH-1007', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=70', 1, false),
    ('VP-PTH-1008', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=70', 0, true),
    ('VP-PTH-1008', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&q=70', 1, false)
) as i(sku, url, position, is_primary) on i.sku = p.sku;
