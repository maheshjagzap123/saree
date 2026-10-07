import { useState } from 'react'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { store } from '../../data/content'

export default function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Vastraa Paithani. Visit our store in Yeola or reach us by phone, WhatsApp or email."
      />

      <section className="border-b border-beige bg-cream py-14 text-center">
        <Container>
          <span className="eyebrow">We'd Love to Help</span>
          <h1 className="mt-3 text-4xl sm:text-5xl">Contact Us</h1>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Details */}
          <div>
            <h2 className="font-serif text-2xl">Visit Our Store</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="eyebrow mb-1">Address</dt>
                <dd className="text-muted">{store.address}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Phone</dt>
                <dd className="text-muted">{store.phone}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Email</dt>
                <dd className="text-muted">{store.email}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Business Hours</dt>
                <dd className="text-muted">{store.hours}</dd>
              </div>
            </dl>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl">Send a Message</h2>
            {sent ? (
              <p className="mt-6 border border-beige bg-cream p-6 text-sm text-muted">
                Thank you — we've received your message and will be in touch soon.
              </p>
            ) : (
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
              >
                <div>
                  <label htmlFor="name" className="eyebrow mb-1 block">Name</label>
                  <input id="name" required className="w-full border border-beige bg-ivory px-4 py-3 text-sm focus:border-wine" />
                </div>
                <div>
                  <label htmlFor="email" className="eyebrow mb-1 block">Email</label>
                  <input id="email" type="email" required className="w-full border border-beige bg-ivory px-4 py-3 text-sm focus:border-wine" />
                </div>
                <div>
                  <label htmlFor="message" className="eyebrow mb-1 block">Message</label>
                  <textarea id="message" rows={5} required className="w-full border border-beige bg-ivory px-4 py-3 text-sm focus:border-wine" />
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
