-- Vastraa Paithani — auth + admin + storage migration.
-- Run AFTER schema.sql (and seed.sql). Safe to re-run.
-- Adds: profiles auto-insert on signup, is_admin() helper, admin write policies,
-- customer order policies, and a public product-images storage bucket.

-- ---------- Auto-create a profile row when a user signs up ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Admin helper ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- Admin write policies (idempotent) ----------
do $$
begin
  -- products
  if not exists (select 1 from pg_policies where tablename='products' and policyname='admin manage products') then
    create policy "admin manage products" on products for all using (public.is_admin()) with check (public.is_admin());
  end if;
  -- product_images
  alter table product_images enable row level security;
  if not exists (select 1 from pg_policies where tablename='product_images' and policyname='public read product_images') then
    create policy "public read product_images" on product_images for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='product_images' and policyname='admin manage product_images') then
    create policy "admin manage product_images" on product_images for all using (public.is_admin()) with check (public.is_admin());
  end if;
  -- collections
  if not exists (select 1 from pg_policies where tablename='collections' and policyname='admin manage collections') then
    create policy "admin manage collections" on collections for all using (public.is_admin()) with check (public.is_admin());
  end if;
  -- categories
  if not exists (select 1 from pg_policies where tablename='categories' and policyname='admin manage categories') then
    create policy "admin manage categories" on categories for all using (public.is_admin()) with check (public.is_admin());
  end if;
  -- orders: customers create/read their own; admins manage all
  if not exists (select 1 from pg_policies where tablename='orders' and policyname='create own orders') then
    create policy "create own orders" on orders for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='orders' and policyname='admin manage orders') then
    create policy "admin manage orders" on orders for all using (public.is_admin()) with check (public.is_admin());
  end if;
  -- order_items
  if not exists (select 1 from pg_policies where tablename='order_items' and policyname='read own order_items') then
    create policy "read own order_items" on order_items for select
      using (exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
  end if;
  if not exists (select 1 from pg_policies where tablename='order_items' and policyname='create own order_items') then
    create policy "create own order_items" on order_items for insert
      with check (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));
  end if;
  -- addresses already covered by "own addresses" in schema.sql
  -- profiles: allow admins to read all profiles (for customer admin)
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='admin read profiles') then
    create policy "admin read profiles" on profiles for select using (public.is_admin() or auth.uid() = id);
  end if;
end $$;

-- ---------- Storage bucket for product images ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Public can read; admins can write/delete in the product-images bucket.
do $$
begin
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='public read product images') then
    create policy "public read product images" on storage.objects
      for select using (bucket_id = 'product-images');
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='admin write product images') then
    create policy "admin write product images" on storage.objects
      for insert with check (bucket_id = 'product-images' and public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='admin update product images') then
    create policy "admin update product images" on storage.objects
      for update using (bucket_id = 'product-images' and public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='admin delete product images') then
    create policy "admin delete product images" on storage.objects
      for delete using (bucket_id = 'product-images' and public.is_admin());
  end if;
end $$;

-- ---------- Order number generator ----------
create or replace function public.set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null then
    new.order_number := 'VP' || to_char(now(), 'YYMM') || lpad((floor(random()*100000))::text, 5, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists orders_set_number on orders;
create trigger orders_set_number
  before insert on orders
  for each row execute function public.set_order_number();
