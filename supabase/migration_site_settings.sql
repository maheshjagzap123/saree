-- Vastraa Paithani — site_settings access migration.
-- Run AFTER schema.sql and migration_auth_admin.sql. Safe to re-run.
-- The site_settings table (key text pk, value jsonb) holds admin-editable store config:
-- store details, announcement bar, homepage copy, social links, etc.
-- Public can READ (the storefront reads announcement/store info); only admins can WRITE.

alter table site_settings enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename='site_settings' and policyname='public read site_settings') then
    create policy "public read site_settings" on site_settings
      for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='site_settings' and policyname='admin write site_settings') then
    create policy "admin write site_settings" on site_settings
      for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- Seed sensible defaults (only if the key does not already exist).
insert into site_settings (key, value) values
  ('store', '{
    "name": "Vastraa Paithani",
    "email": "hello@vastraapaithani.com",
    "phone": "+91 75881 74528",
    "whatsapp": "917588174528",
    "address": "Yeola, Nashik District, Maharashtra, India",
    "hours": "Mon-Sat, 10:00 AM - 8:00 PM",
    "instagram": "",
    "facebook": "",
    "free_shipping_threshold": 10000
  }'::jsonb),
  ('announcement', '{
    "enabled": true,
    "text": "Complimentary shipping on orders above \u20b910,000"
  }'::jsonb),
  ('homepage', '{
    "hero_eyebrow": "The Vastraa Atelier",
    "hero_title": "Woven for the moments you will remember.",
    "hero_subtitle": "",
    "cta_label": "Explore the Collection",
    "cta_link": "/shop"
  }'::jsonb)
on conflict (key) do nothing;
