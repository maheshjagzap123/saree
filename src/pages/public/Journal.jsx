import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import SectionHeading from '../../components/ui/SectionHeading'
import Img from '../../components/ui/Img'
import { journal } from '../../data/content'

export default function Journal() {
  return (
    <>
      <Seo
        title="Journal"
        description="Stories, guides and heritage from the world of Paithani — what it is, how it's woven, and how to care for it."
      />

      <section className="border-b border-beige bg-cream py-14 text-center">
        <Container>
          <span className="eyebrow">The Journal</span>
          <h1 className="mt-3 text-4xl sm:text-5xl">Stories & Guides</h1>
        </Container>
      </section>

      <Container className="py-16">
        <SectionHeading
          title="From the Loom"
          description="Learn about the craft, choose with confidence, and care for your saree."
        />
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {journal.map((a) => (
            <article key={a.slug} className="group">
              {/* Article pages are planned; links kept for structure. */}
              <div className="aspect-[16/10] overflow-hidden bg-cream">
                <Img
                  src={a.image}
                  alt={a.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <span className="mt-4 block text-xs uppercase tracking-wider2 text-gold">{a.category}</span>
              <h2 className="mt-1 font-serif text-xl">{a.title}</h2>
              <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
            </article>
          ))}
        </div>
      </Container>
    </>
  )
}
