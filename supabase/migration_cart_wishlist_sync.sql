-- Vastraa Paithani — cart + wishlist sync migration.
-- Run AFTER schema.sql and migration_auth_admin.sql. Safe to re-run.
-- Enables RLS and owner-scoped policies so a signed-in customer can read/write
-- ONLY their own cart and wishlist (plus the items within them). Admins can read
-- all for support/analytics but customers never see each other's data.

-- ---------- Enable RLS ----------
alter table wishlists      enable row level security;
alter table wishlist_items enable row level security;
alter table carts          enable row level security;
alter table cart_items     enable row level security;

-- Ensure one wishlist/cart per user so "upsert by user_id" works deterministically.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'wishlists_user_id_key'
  ) then
    alter table wishlists add constraint wishlists_user_id_key unique (user_id);
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'carts_user_id_key'
  ) then
    alter table carts add constraint carts_user_id_key unique (user_id);
  end if;
end $$;

-- ---------- Policies (idempotent) ----------
do $$
begin
  -- wishlists: a user owns their wishlist row; admins may read.
  if not exists (select 1 from pg_policies where tablename='wishlists' and policyname='own wishlist') then
    create policy "own wishlist" on wishlists
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='wishlists' and policyname='admin read wishlists') then
    create policy "admin read wishlists" on wishlists
      for select using (public.is_admin());
  end if;

  -- wishlist_items: scoped through the owning wishlist.
  if not exists (select 1 from pg_policies where tablename='wishlist_items' and policyname='own wishlist_items') then
    create policy "own wishlist_items" on wishlist_items
      for all using (
        exists (select 1 from wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
      ) with check (
        exists (select 1 from wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
      );
  end if;
  if not exists (select 1 from pg_policies where tablename='wishlist_items' and policyname='admin read wishlist_items') then
    create policy "admin read wishlist_items" on wishlist_items
      for select using (public.is_admin());
  end if;

  -- carts: a user owns their cart row; admins may read.
  if not exists (select 1 from pg_policies where tablename='carts' and policyname='own cart') then
    create policy "own cart" on carts
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='carts' and policyname='admin read carts') then
    create policy "admin read carts" on carts
      for select using (public.is_admin());
  end if;

  -- cart_items: scoped through the owning cart.
  if not exists (select 1 from pg_policies where tablename='cart_items' and policyname='own cart_items') then
    create policy "own cart_items" on cart_items
      for all using (
        exists (select 1 from carts c where c.id = cart_id and c.user_id = auth.uid())
      ) with check (
        exists (select 1 from carts c where c.id = cart_id and c.user_id = auth.uid())
      );
  end if;
  if not exists (select 1 from pg_policies where tablename='cart_items' and policyname='admin read cart_items') then
    create policy "admin read cart_items" on cart_items
      for select using (public.is_admin());
  end if;
end $$;
