import { Link } from 'react-router-dom'
import Seo, { SITE_URL } from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import ProductCard from '../../components/product/ProductCard'
import Reveal from '../../components/common/Reveal'
import { listProducts, listCollections } from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import {
  hero,
  discoveryPaths,
  characterStyles,
  colourStory,
  atelierSteps,
  brandStatement,
  journal,
} from '../../data/content'

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Vastraa Paithani',
  url: SITE_URL,
  slogan: 'A digital atelier for Paithani sarees',
  sameAs: ['https://instagram.com', 'https://facebook.com'],
}

export default function Home() {
  const { data: products } = useAsync(() => listProducts(), [], [])
  const list = products || []

  const signature = [...list].sort((a, b) => b.price - a.price)[0]
  const currentEdit = list.filter((p) => p.is_featured).slice(0, 6)
  const newArrivals = list.filter((p) => p.is_new).slice(0, 4)
  const storyProduct = list.find((p) => /purple/i.test(p.name)) || list[0]

  return (
    <>
      <Seo
        title="A Digital Atelier for Paithani Sarees"
        description="Vastraa Paithani — a digital atelier for handcrafted Paithani sarees. Discover colour, craft and the character of each weave."
        jsonLd={organizationLd}
      />

      {/* 01 — CINEMATIC HERO */}
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
        <picture>
          <source media="(max-width: 640px)" srcSet={hero.mobileImage} />
          <img
            src={hero.desktopImage}
            alt="A handcrafted Paithani saree with an ornate zari pallu"
            className="h-full w-full object-cover"
            fetchpriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/25 to-charcoal/10" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-2xl text-ivory">
              <span className="eyebrow animate-fade-in text-gold-soft">{hero.eyebrow}</span>
              <h1 className="mt-5 font-serif text-4xl font-light leading-[1.08] text-ivory animate-fade-up sm:text-6xl lg:text-7xl">
                {hero.titleLines.map((l, i) => (
                  <span key={i} className="block">{l}</span>
                ))}
              </h1>
              <p className="mt-6 max-w-md text-base text-ivory/85 animate-fade-up-slow">{hero.copy}</p>
              <div className="mt-9 flex flex-wrap gap-4 animate-fade-up-slow">
                <Button to={hero.primaryCta.to} variant="gold" size="lg">{hero.primaryCta.label}</Button>
                <Button to={hero.secondaryCta.to} variant="light" size="lg">{hero.secondaryCta.label}</Button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* 02 — THE SIGNATURE PIECE */}
      {signature && (
        <section className="bg-ivory py-24">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className="order-2 lg:order-1">
                <span className="eyebrow">The Signature Edit</span>
                <h2 className="mt-4 font-serif text-4xl font-light leading-tight sm:text-5xl">
                  {signature.name}
                </h2>
                <p className="mt-5 max-w-md leading-relaxed text-muted">
                  {signature.short_description}
                </p>
                <dl className="mt-7 grid max-w-md grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  {signature.fabric && (<><dt className="text-muted">Fabric</dt><dd className="text-right">{signature.fabric}</dd></>)}
                  {signature.weave_type && (<><dt className="text-muted">Weave</dt><dd className="text-right">{signature.weave_type}</dd></>)}
                  {signature.color && (<><dt className="text-muted">Colour</dt><dd className="text-right">{signature.color}</dd></>)}
                  {signature.occasion?.length > 0 && (<><dt className="text-muted">Occasion</dt><dd className="text-right">{signature.occasion.join(', ')}</dd></>)}
                </dl>
                <p className="mt-7 font-serif text-2xl text-wine">{formatPrice(signature.price)}</p>
                <Button to={`/products/${signature.slug}`} className="mt-6">Discover This Saree</Button>
              </Reveal>
              <Reveal className="order-1 lg:order-2">
                <div className="aspect-[4/5] overflow-hidden bg-cream">
                  <img src={signature.images[0]} alt={signature.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {/* 03 — FIND YOUR PAITHANI */}
      <section className="bg-cream py-24">
        <Container>
          <Reveal className="max-w-xl">
            <span className="eyebrow">Find Your Paithani</span>
            <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
              Every occasion has a colour, a weave and a story.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {discoveryPaths.map((d, i) => (
              <Reveal key={d.key} delay={i * 60} className={i === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''}>
                <Link to={d.to} className="group relative block h-full overflow-hidden">
                  <div className={`${i === 0 ? 'aspect-[3/4] lg:h-full' : 'aspect-[4/3]'} overflow-hidden bg-beige`}>
                    <img src={d.image} alt={d.title} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-7 text-ivory">
                    <h3 className="font-serif text-2xl font-light">{d.title}</h3>
                    <p className="mt-1 text-sm text-ivory/80">{d.description}</p>
                    <span className="mt-3 inline-block text-xs uppercase tracking-wider2 text-gold-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Explore →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 04 — PAITHANI BY CHARACTER */}
      <section className="py-24">
        <Container>
          <Reveal className="max-w-xl">
            <span className="eyebrow">The Weaves</span>
            <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">Paithani by character</h2>
            <p className="mt-4 text-muted">Each style carries its own border, motif and mood.</p>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {characterStyles.map((c, i) => (
              <Reveal key={c.title} delay={i * 50}>
                <Link to={`/search?q=${encodeURIComponent(c.query)}`} className="group block border-t border-beige pt-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-2xl font-light group-hover:text-wine">{c.title}</h3>
                    <span className="text-xs uppercase tracking-wider2 text-gold opacity-0 transition-opacity group-hover:opacity-100">View →</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{c.note}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 05 — THE CURRENT EDIT */}
      {currentEdit.length > 0 && (
        <section className="bg-cream py-24">
          <Container>
            <Reveal className="flex items-end justify-between">
              <div>
                <span className="eyebrow">The Current Edit</span>
                <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">Selected this season</h2>
              </div>
              <Link to="/shop" className="hidden text-sm uppercase tracking-wider2 text-charcoal link-underline sm:block">
                All Sarees →
              </Link>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
              {currentEdit.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}><ProductCard product={p} /></Reveal>
              ))}
            </div>
            <div className="mt-12 text-center sm:hidden">
              <Button to="/shop" variant="outline">All Sarees</Button>
            </div>
          </Container>
        </section>
      )}

      {/* 06 — THE COLOUR STORY */}
      <section className="py-24">
        <Container>
          <Reveal className="max-w-xl">
            <span className="eyebrow">Find Your Colour</span>
            <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">The colour story</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {colourStory.map((c, i) => (
              <Reveal key={c.name} delay={i * 40}>
                <Link to={`/shop?color=${encodeURIComponent(c.value)}`} className="group block">
                  <div className="aspect-square overflow-hidden" style={{ background: c.swatch.startsWith('linear') ? c.swatch : c.swatch }}>
                    <div className="flex h-full w-full items-end bg-charcoal/0 p-4 transition-colors duration-300 group-hover:bg-charcoal/15">
                      <span className="font-serif text-lg text-ivory drop-shadow">{c.name}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 07 — THE ATELIER */}
      <section className="bg-charcoal py-24 text-ivory">
        <Container>
          <Reveal className="max-w-xl">
            <span className="eyebrow text-gold-soft">The Vastraa Atelier</span>
            <h2 className="mt-4 font-serif text-4xl font-light text-ivory sm:text-5xl">From silk to saree</h2>
            <p className="mt-4 text-ivory/70">Six quiet stages shape every Paithani we offer.</p>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {atelierSteps.map((s, i) => (
              <Reveal key={s.no} delay={i * 70}>
                <div className="aspect-[4/3] overflow-hidden bg-charcoal/40">
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover opacity-90 transition-transform duration-[1200ms] hover:scale-105" loading="lazy" />
                </div>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-serif text-2xl text-gold-soft">{s.no}</span>
                  <h3 className="font-serif text-xl text-ivory">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm text-ivory/70">{s.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <Button to="/about" variant="gold">Discover the Craft</Button>
          </div>
        </Container>
      </section>

      {/* 08 — SAREE STORIES */}
      {storyProduct && (
        <section className="py-24">
          <Container>
            <div className="grid items-stretch gap-0 overflow-hidden border border-beige lg:grid-cols-2">
              <div className="aspect-[4/5] overflow-hidden bg-cream lg:aspect-auto">
                <img src={storyProduct.images[0]} alt={storyProduct.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <Reveal className="flex flex-col justify-center bg-ivory p-10 lg:p-16">
                <span className="eyebrow">Saree Stories</span>
                <h2 className="mt-4 font-serif text-3xl font-light sm:text-4xl">{storyProduct.name}</h2>
                <p className="mt-5 leading-relaxed text-muted">
                  {storyProduct.description || storyProduct.short_description}
                </p>
                <div className="mt-7 flex flex-wrap gap-4">
                  <Button to={`/products/${storyProduct.slug}`}>View the Saree</Button>
                  <Button to="/journal" variant="ghost" className="px-0 link-underline">Read the story →</Button>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {/* 09 — NEW ARRIVALS (compact) */}
      {newArrivals.length > 0 && (
        <section className="bg-cream py-24">
          <Container>
            <Reveal className="flex items-end justify-between">
              <div>
                <span className="eyebrow">Just Arrived</span>
                <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">New arrivals</h2>
              </div>
              <Link to="/shop?filter=new" className="hidden text-sm uppercase tracking-wider2 link-underline sm:block">View all →</Link>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {newArrivals.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}><ProductCard product={p} /></Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 10 — JOURNAL */}
      <section className="py-24">
        <Container>
          <Reveal className="max-w-xl">
            <span className="eyebrow">The Journal</span>
            <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">Notes on colour, craft and care</h2>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {journal.map((a, i) => (
              <Reveal key={a.slug} delay={i * 70}>
                <Link to="/journal" className="group block">
                  <div className="aspect-[16/11] overflow-hidden bg-cream">
                    <img src={a.image} alt={a.title} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" loading="lazy" />
                  </div>
                  <span className="mt-4 block text-xs uppercase tracking-wider2 text-gold">{a.category}</span>
                  <h3 className="mt-1 font-serif text-xl font-light group-hover:text-wine">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 11 — PERSONAL ASSISTANCE */}
      <section className="bg-plum py-20 text-ivory">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <span className="eyebrow text-gold-soft">Personal Assistance</span>
            <h2 className="max-w-2xl font-serif text-3xl font-light text-ivory sm:text-4xl">
              Need help choosing?
            </h2>
            <p className="max-w-xl text-ivory/80">
              Tell us your occasion, preferred colour and budget. We'll help you find a saree that feels right.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              <Button to="/contact" variant="gold">Talk to a Saree Specialist</Button>
              <Button
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'}?text=${encodeURIComponent("Hi, I'd like help choosing a Paithani saree.")}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
              >
                WhatsApp Us
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 12 — FINAL BRAND STATEMENT */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <img src={brandStatement.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-charcoal/65" />
        <Container>
          <Reveal className="relative max-w-2xl text-ivory">
            <h2 className="font-serif text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl">
              {brandStatement.lines.map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <Button to={brandStatement.cta.to} variant="gold" size="lg" className="mt-9">
              {brandStatement.cta.label}
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
