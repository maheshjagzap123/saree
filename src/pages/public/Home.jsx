import { Link } from 'react-router-dom'
import Seo, { SITE_URL } from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import SectionHeading from '../../components/ui/SectionHeading'
import ProductGrid from '../../components/product/ProductGrid'
import { StarIcon } from '../../components/ui/icons'
import { products } from '../../data/products'
import { collections } from '../../data/collections'
import {
  trustStrip,
  occasions,
  craftsmanshipSteps,
  whyChooseUs,
  testimonials,
  journal,
} from '../../data/content'

const heroImg =
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1600&q=75'

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Vastraa Paithani',
  url: SITE_URL,
  slogan: 'The Art of Timeless Paithani',
  sameAs: ['https://instagram.com', 'https://facebook.com'],
}

export default function Home() {
  const featured = products.filter((p) => p.is_featured).slice(0, 4)
  const newArrivals = products.filter((p) => p.is_new).slice(0, 4)
  const bestsellers = products.filter((p) => p.is_bestseller).slice(0, 4)
  const signature = products.filter((p) => p.price >= 35000).slice(0, 3)

  return (
    <>
      <Seo
        title="Premium Paithani Sarees from Yeola"
        description="Explore handcrafted Paithani sarees inspired by the heritage of Yeola. Discover traditional silk, bridal and festive collections from Vastraa Paithani."
        jsonLd={organizationLd}
      />

      {/* HERO */}
      <section className="relative">
        <div className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="A handcrafted Paithani saree with an ornate zari pallu"
            className="h-full w-full object-cover"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <Container className="pb-16">
              <div className="max-w-xl animate-fade-up text-ivory">
                <span className="eyebrow text-gold-soft">Handcrafted in Maharashtra</span>
                <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl text-ivory">
                  The Art of Timeless Paithani
                </h1>
                <p className="mt-4 max-w-md text-ivory/85">
                  Handcrafted elegance inspired by the heritage of Yeola.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button to="/shop" variant="gold" size="lg">Shop Collection</Button>
                  <Button to="/about" variant="light" size="lg">Discover Our Story</Button>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-beige bg-cream">
        <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-5 text-center text-xs uppercase tracking-wider2 text-muted">
          {trustStrip.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </Container>
      </section>

      {/* SHOP BY COLLECTION */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Explore"
            title="Shop by Collection"
            description="A considered edit of our finest weaves, organised for the moments that matter."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collections.slice(0, 5).map((c, i) => (
              <Link
                key={c.slug}
                to={`/collections/${c.slug}`}
                className={`group relative overflow-hidden ${i === 0 ? 'lg:col-span-2' : ''}`}
              >
                <div className={`${i === 0 ? 'aspect-[16/9]' : 'aspect-[4/5]'} overflow-hidden bg-cream`}>
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-ivory">
                  <h3 className="font-serif text-2xl text-ivory">{c.name}</h3>
                  <p className="mt-1 max-w-xs text-sm text-ivory/80">{c.tagline}</p>
                  <span className="mt-3 inline-block text-xs uppercase tracking-wider2 text-gold-soft">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* FEATURED */}
      <section className="bg-cream py-20">
        <Container>
          <SectionHeading eyebrow="Curated For You" title="Signature Weaves" />
          <div className="mt-12">
            <ProductGrid products={featured} />
          </div>
          <div className="mt-10 text-center">
            <Button to="/shop" variant="outline">View All Sarees</Button>
          </div>
        </Container>
      </section>

      {/* HERITAGE */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden bg-cream">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=70"
                alt="Close-up of Paithani weaving with traditional motifs"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <span className="eyebrow">Our Heritage</span>
              <h2 className="mt-3 text-3xl sm:text-4xl">Woven in the Heart of Maharashtra</h2>
              <p className="mt-5 leading-relaxed text-muted">
                The Paithani is among India's most treasured weaves, named for the town of
                Paithan and kept alive in Yeola. Each saree is built thread by thread — the
                silk ground, the oblique-weave border, and the famed pallu alive with peacocks,
                lotuses and vines.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                It is slow, deliberate work. A single saree can take weeks on the loom, which
                is exactly what makes it worth keeping for a lifetime.
              </p>
              <Button to="/about" variant="ghost" className="mt-6 px-0 link-underline">
                Read our story →
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* CRAFTSMANSHIP */}
      <section className="bg-charcoal py-20 text-ivory">
        <Container>
          <SectionHeading
            eyebrow="The Process"
            title="How a Paithani Comes to Life"
            className="[&_h2]:text-ivory [&_.eyebrow]:text-gold-soft"
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {craftsmanshipSteps.map((s) => (
              <div key={s.no} className="border-t border-ivory/20 pt-5">
                <span className="font-serif text-3xl text-gold-soft">{s.no}</span>
                <h3 className="mt-3 font-serif text-lg text-ivory">{s.title}</h3>
                <p className="mt-2 text-sm text-ivory/70">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* OCCASION */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Find the One" title="Shop by Occasion" />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {occasions.map((o) => (
              <Link
                key={o.slug}
                to="/shop"
                className="flex aspect-square flex-col items-center justify-center border border-beige bg-cream text-center transition-colors hover:border-wine hover:text-wine"
              >
                <span className="font-serif text-xl">{o.name}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SIGNATURE EDIT */}
      {signature.length > 0 && (
        <section className="bg-cream py-20">
          <Container>
            <SectionHeading eyebrow="Rare & Exceptional" title="The Signature Edit" />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {signature.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-ivory">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-4 text-center font-serif text-xl group-hover:text-wine">{p.name}</h3>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading eyebrow="Just In" title="Newly Woven" />
            <div className="mt-12"><ProductGrid products={newArrivals} /></div>
          </Container>
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="bg-cream py-20">
        <Container>
          <SectionHeading eyebrow="The Vastraa Promise" title="Why Shop With Us" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((w) => (
              <div key={w.title} className="border-l-2 border-gold pl-5">
                <h3 className="font-serif text-xl">{w.title}</h3>
                <p className="mt-2 text-sm text-muted">{w.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* BEST SELLERS */}
      {bestsellers.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading eyebrow="Loved By Many" title="Most Loved" />
            <div className="mt-12"><ProductGrid products={bestsellers} /></div>
          </Container>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="bg-wine py-20 text-ivory">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow text-gold-soft">In Their Words</span>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.author}>
                  <div className="flex justify-center gap-0.5 text-gold-soft">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <blockquote className="mt-4 font-serif text-lg leading-relaxed text-ivory">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-ivory/70">— {t.author}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* JOURNAL */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="The Journal" title="Stories & Guides" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {journal.map((a) => (
              <Link key={a.slug} to="/journal" className="group block">
                <div className="aspect-[16/10] overflow-hidden bg-cream">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <span className="mt-4 block text-xs uppercase tracking-wider2 text-gold">{a.category}</span>
                <h3 className="mt-1 font-serif text-xl group-hover:text-wine">{a.title}</h3>
                <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-cream py-20">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow">Follow the Weave</span>
            <h2 className="mt-3 text-3xl">Join Our World</h2>
            <p className="mt-3 text-muted">
              Be the first to know about new weaves, collections and private events.
            </p>
            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="newsletter" className="sr-only">Email address</label>
              <input
                id="newsletter"
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 border border-beige bg-ivory px-4 py-3 text-sm focus:border-wine"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </Container>
      </section>
    </>
  )
}
