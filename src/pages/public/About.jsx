import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import SectionHeading from '../../components/ui/SectionHeading'
import Button from '../../components/ui/Button'
import { craftsmanshipSteps } from '../../data/content'

export default function About() {
  return (
    <>
      <Seo
        title="Our Story"
        description="The story of Vastraa Paithani — handcrafted Paithani sarees inspired by the heritage of Yeola and the artisans who weave them."
      />

      <section className="relative h-[46vh] min-h-[340px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=75"
          alt="Paithani weaving on a traditional loom"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-ivory">
          <div className="animate-fade-up px-6">
            <span className="eyebrow text-gold-soft">Our Story</span>
            <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl">Woven Heritage, Timeless Elegance</h1>
          </div>
        </div>
      </section>

      <Container className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="leading-relaxed text-muted">
            Vastraa Paithani began with a simple belief — that a saree can carry a story. We
            work with weaving traditions rooted in Maharashtra, bringing the artistry of the
            Paithani to those who value craft, authenticity and quiet luxury.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Every saree in our collection is chosen with care, from the sheen of the silk to
            the detail in the pallu. We would rather offer a considered edit than an endless
            catalogue.
          </p>
        </div>
      </Container>

      <section className="bg-charcoal py-16 text-ivory">
        <Container>
          <SectionHeading
            eyebrow="Craftsmanship"
            title="How a Paithani Comes to Life"
            className="[&_h2]:text-ivory [&_.eyebrow]:text-gold-soft"
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
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

      <Container className="py-16 text-center">
        <h2 className="font-serif text-3xl">Explore the Collection</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Discover handcrafted Paithani and silk sarees for every occasion.
        </p>
        <Button to="/shop" className="mt-6">Shop Collection</Button>
      </Container>
    </>
  )
}
