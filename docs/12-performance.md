# 12 — Performance

Living notes on performance work. The dominant cost was imagery: 32 source saree PNGs at
2.5–3.5 MB each (~88.7 MB total), served both from the JS bundle and from Supabase Storage.

## Image optimization (biggest win)

**Source → WebP.** `scripts/optimize-images.mjs` uses `sharp` to resize (max width 1600px)
and convert every `src/Images/*.png` to WebP (quality 82) in `src/Images/optimized/`.

- Result: **88.7 MB → 9.7 MB (89% smaller).**
- `src/assets/images.js` imports the optimized WebP, so the bundle ships light assets.
  `dist/assets` dropped from ~90 MB to ~10 MB.
- Runs automatically in `prebuild` (`npm run build`), and on demand via `npm run optimize:images`.
  Re-runnable and incremental (skips WebP already newer than its source).

**Supabase Storage.** `scripts/reupload-webp.mjs` uploads the optimized WebP to the
`product-images` bucket (`catalog/*.webp`) and repoints `product_images.url` +
`collections.cover_image` from `.png` to `.webp`.

- Result per image: **~3,288 KB → ~419 KB (≈87% smaller).**
- A product grid of 8 images: ~26 MB → ~3.4 MB.
- Non-destructive: original PNGs remain in the bucket, so it's reversible by swapping URLs
  back to `.png`. Signs in as admin for storage write RLS.

## Loading hints (already in place)

- Hero image: `loading="eager"` + `fetchpriority="high"` (LCP element).
- All other images via `<Img>`: `loading="lazy"` by default.
- `<Img>` falls back to an on-brand SVG illustration if a URL fails, so layout never breaks.

## Build dependency note

`sharp` is a devDependency. The Cloudflare Pages build runs `npm install` then
`npm run build`, so the prebuild image step works there (npm fetches the correct
platform binary). The source PNGs are committed because the optimize/reupload scripts
read from them.

## Still open

- Consider `srcset`/responsive sizes for product cards (serve smaller widths on mobile).
- Code-split the main JS chunk (Vite warns it is >500 kB) via dynamic imports / manualChunks.
- GA4 + real-user Lighthouse/CWV measurement post-deploy.
