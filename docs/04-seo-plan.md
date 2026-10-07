# 04 — SEO Plan

SEO is designed in from the start, not bolted on later.

## Keyword targets

**Commercial:** buy paithani saree online · paithani saree online · pure silk paithani
saree · paithani saree price · buy paithani saree.

**Local (only where the business actually operates):** paithani saree in Yeola · paithani
saree shop in Yeola · paithani saree shop in Nashik · paithani saree shop near me.

**Informational:** what is paithani saree · paithani saree history · how to identify
paithani saree · single muniya vs triple muniya · how to care for paithani saree.

## URL structure (clean)

```text
/shop
/collections/paithani-sarees
/collections/bridal-paithani
/products/purple-single-muniya-paithani
/journal/what-is-paithani-saree
/about  /contact
```

Avoid `/product?id=123`, `/product/abc123`, `/page1`.

## Titles & meta

- Home: `Vastraa Paithani | Premium Paithani Sarees from Yeola`
- Collection: `Pure Silk Paithani Sarees | Vastraa Paithani`
- Product: `Purple Single Muniya Paithani Saree | Vastraa Paithani`
- Blog: `What Is a Paithani Saree? History, Weaves & Buying Guide`
- Every important page has a **unique** meta description. No duplicates.

## Canonicals

Every indexable page has a canonical URL. Critical for filters, sorting, duplicate product
URLs, pagination, and parameter URLs.

## robots.txt

Allow `/ /shop /collections /products /journal`.
Block `/admin /account /cart /checkout /search?*`.
Handle search/filter parameters deliberately rather than blanket-blocking.

## XML sitemap

Include home, collections, products, categories, blog posts, key static pages. Exclude
cart, checkout, account, admin, login.

## Structured data

- **Product** schema on product pages (name, image, description, SKU, brand, price,
  currency, availability, aggregate rating, reviews) — only matching visible content.
- **Organization** schema on home (brand, logo, website, social, contact).
- **LocalBusiness** schema if there is a physical store (verified name, address, phone,
  hours, website, geo only).
- **BreadcrumbList** with visible breadcrumbs.
- **Article** schema on blog posts.
- **FAQ** schema only where FAQ content is actually visible.

## Image SEO & performance

Descriptive alt text (e.g. "Purple single muniya Paithani silk saree with peacock pallu"),
descriptive file names (`purple-single-muniya-paithani.jpg`), WebP/AVIF, responsive images,
lazy loading below the fold, explicit width/height, compression, CDN. Optimize hero images
carefully for Core Web Vitals.

## Core Web Vitals

LCP (fast hero), CLS (reserve image dimensions), INP (avoid heavy JS). Minimize libraries,
lazy load, code-split routes, optimize fonts, avoid huge videos.

## Social / OpenGraph

`og:title og:description og:image og:url og:type` + Twitter/X cards. Shares on
WhatsApp/social should produce an attractive preview.

## Content clusters (Journal)

1. **Paithani:** what is Paithani · history · types · how it's made.
2. **Buying:** buying guide · price guide · how to identify authentic · best for weddings.
3. **Weaves:** single muniya · triple muniya · peacock border · asawali · narali · tissue.
4. **Care:** how to wash · how to store · protect silk · zari care.
5. **Styling:** Maharashtrian wedding · blouse ideas · how to style · jewellery combos.

**Internal linking:** blog → collection → product pages.

## Post-launch

Google Search Console (verify domain, submit sitemap, inspect key pages, monitor indexing
+ queries + CWV). GA4 events: page_view, view_item, search, add_to_cart,
remove_from_cart, begin_checkout, purchase, add_to_wishlist.

## Out-of-stock & 404

Don't auto-delete sold-out products — show "Sold Out / Notify Me" and keep useful pages
indexed. Permanently discontinued → appropriate redirect/status. Custom premium 404.
