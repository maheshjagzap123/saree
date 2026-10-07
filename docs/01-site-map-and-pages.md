# 01 — Site Map & Page Content

This describes **what every page shows** (the website, not the code). Routes marked
_(built)_ exist in the current foundation; others are planned.

## Public website

```text
/                        Home                 (built)
/shop                    Shop (all products)  (built)
/collections             Collections index    (built)
/collections/:slug       Collection details   (built)
/products/:slug          Product details      (built)
/new-arrivals            New Arrivals         (planned → filtered shop)
/best-sellers            Best Sellers         (planned → filtered shop)
/bridal                  Bridal landing       (planned → collection)
/festive                 Festive landing      (planned → collection)
/about                   About                (built)
/our-story               Our Story            (planned)
/craftsmanship           Craftsmanship        (planned)
/contact                 Contact              (built)
/store                   Store / visit us     (planned, local SEO)
/journal                 Journal (blog index) (built)
/journal/:slug           Article              (planned)
/faq                     FAQ                  (planned)
/shipping                Shipping policy      (planned)
/returns                 Returns policy       (planned)
/privacy                 Privacy              (planned)
/terms                   Terms                (planned)
/search                  Search results       (planned)
```

## Customer area (planned — needs auth)

```text
/account            /account/profile     /account/orders
/account/orders/:id /account/wishlist    /account/addresses
/account/settings
```

## Commerce

```text
/cart            Cart drawer + page   (drawer built)
/checkout        Checkout flow        (planned)
/order-success   Confirmation         (planned)
```

## Admin (planned)

```text
/admin           /admin/products      /admin/products/new
/admin/products/:id   /admin/categories   /admin/collections
/admin/orders    /admin/customers     /admin/reviews
/admin/coupons   /admin/banners       /admin/content
/admin/analytics /admin/settings
```

---

## Header

- **Announcement bar** (admin-configurable later). Examples: "Complimentary shipping on
  orders above ₹10,000", "Discover handcrafted Paithani from Yeola", "Book a private
  saree consultation".
- **Main nav (desktop):** LOGO · Shop · Collections · New Arrivals · Bridal · Our Story ·
  Journal · [Search] [Account] [Wishlist] [Bag]. Keep it uncrowded.

### Mega menu (under Collections)

```text
PAITHANI            BY OCCASION      BY PRICE
Traditional Paithani Bridal          Under ₹10,000
Single Muniya        Wedding         ₹10,000–₹25,000
Triple Muniya        Festive         ₹25,000–₹50,000
Peacock Border       Puja            ₹50,000–₹1,00,000
Muniya Border        Gifting         ₹1,00,000+
Designer Paithani
```

---

## Homepage sections (in order)

1. **Hero** — one powerful editorial image/video (not a 5-banner slider). Headline
   "The Art of Timeless Paithani", subcopy, buttons "Shop Collection" / "Discover Our Story".
   Dedicated mobile image.
2. **Trust strip** — Authentic Craftsmanship · Handcrafted Sarees · Secure Shopping ·
   Personalized Assistance · Pan-India Delivery. (Only substantiable claims.)
3. **Shop by Collection** — editorial cards: Traditional Paithani, Bridal, Silk, Designer,
   Festive. Each: image, name, short description, Explore button.
4. **Featured Products** — "Curated For You", 4-8 products.
5. **New Arrivals** — "Newly Woven". Admin controls inclusion.
6. **Best Sellers** — "Most Loved". Manual or auto by sales.
7. **Shop by Occasion** — Wedding, Bridal, Festive, Puja, Reception, Gifting (SEO landing pages).
8. **Paithani Heritage** — editorial image + text about Yeola, weaving, motifs, pallu,
   border, silk, zari. Brand + trust + SEO + storytelling.
9. **Craftsmanship** — 5 steps: Selecting the Silk → Preparing the Yarn → Creating the
   Motifs → Weaving the Border → Finishing the Saree.
10. **Signature Collection** — "The Signature Edit", 3-4 high-end products, large cards.
11. **Why Choose Us** — 4-6 cards (Authentic Craftsmanship, Curated Collections, Personal
    Assistance, Quality Checked, Secure Payments, Reliable Delivery).
12. **Testimonials** — admin-managed star reviews.
13. **Instagram / Social** — "Follow the Weave", configurable links.
14. **Journal preview** — SEO articles.
15. **Newsletter** signup.

---

## Shop page

- Hero: "All Paithani — Discover our curated collection of handcrafted sarees. N Products".
- Controls: **Filter** + **Sort**.
- **Filters:** Category, Collection, Price band, Color, Fabric, Border, Availability
  (In Stock / Made to Order).
- Product grid of product cards.

## Product card supports

Image, second image on hover, wishlist, NEW badge, SALE badge, name, collection, price,
original price, discount, Quick View, Add to Bag.

## Product detail page

- Left: image gallery (full saree, pallu, border, close-up, blouse piece, model, texture,
  packaging).
- Right: name, rating, price, short description, color, availability, **Add to Bag**,
  **Buy Now**, delivery check.
- Below: tabbed/sectioned description — About the Saree, Craft Details, Design, Occasion, Care.
- **Product attributes:** Name, SKU, Price, Sale Price, Category, Collection, Color, Fabric,
  Weave Type, Border Type, Motif, Saree Length, Width, Blouse Included, Blouse Length,
  Weight, Care Instructions, Availability.
- **Badges:** NEW, BESTSELLER, LIMITED, EXCLUSIVE, LOW STOCK (admin-controlled).
- WhatsApp "I'm interested in this Paithani" with pre-filled product name.

## Cart & wishlist

- **Cart** = premium side drawer on desktop: items, price, quantity, subtotal,
  "You may also like", View Bag + Checkout.
- **Wishlist**: add / remove / move to cart. Logged-in users persist to Supabase; guests
  may use local storage.

## Checkout (planned)

Contact → Address → Delivery → Payment → Review → Order. Clean, no extra navigation.

## Other pages

- **Contact:** address, phone, WhatsApp, email, hours, Google Maps, contact form.
- **Store:** visit us, address, hours, directions, map (local SEO).
- **404:** premium custom — "This weave seems to have gone elsewhere." + Explore / Home.
- **Journal:** SEO article hub (see SEO content clusters in docs/04).
