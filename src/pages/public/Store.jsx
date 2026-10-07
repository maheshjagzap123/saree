import Seo, { SITE_URL } from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { store } from '../../data/content'

// LocalBusiness schema — only include details the real business can verify.
const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: store.name,
  description: 'Premium handcrafted Paithani and silk sarees.',
  url: `${SITE_URL}/store`,
  telephone: store.phone,
  email: store.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: store.address,
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  openingHours: 'Mo-Sa 10:00-20:00',
}

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  store.address
)}`

export default function Store() {
  return (
    <>
      <Seo
        title="Visit Our Store"
        description="Visit the Vastraa Paithani store in Yeola, Maharashtra. See our address, opening hours and directions."
        jsonLd={localBusinessLd}
      />

      <section className="border-b border-beige bg-cream py-14 text-center">
        <Container>
          <span className="eyebrow">Come Say Hello</span>
          <h1 className="mt-3 text-4xl sm:text-5xl">Visit Our Store</h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Experience our sarees in person. Our team will be glad to assist you.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl">{store.name}</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="eyebrow mb-1">Address</dt>
                <dd className="text-muted">{store.address}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Opening Hours</dt>
                <dd className="text-muted">{store.hours}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Phone</dt>
                <dd className="text-muted">{store.phone}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Email</dt>
                <dd className="text-muted">{store.email}</dd>
              </div>
            </dl>
            <Button href={mapsHref} target="_blank" rel="noopener noreferrer" className="mt-8">
              Get Directions
            </Button>
          </div>

          {/* Map placeholder — embed a real Google Map iframe once the exact location is confirmed. */}
          <div className="flex min-h-[320px] items-center justify-center border border-beige bg-cream text-center text-sm text-muted">
            <div className="px-6">
              <p>Map preview</p>
              <p className="mt-2">A Google Map embed will appear here once the store location is confirmed.</p>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
