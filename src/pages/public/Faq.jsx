import { useState } from 'react'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import { ChevronDown } from '../../components/ui/icons'
import { faqs } from '../../data/content'

// FAQPage schema — content matches the visible accordion below.
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

function Item({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-beige">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-serif text-lg">{q}</span>
        <ChevronDown className={`text-base transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-5 text-sm leading-relaxed text-muted">{a}</p>}
    </div>
  )
}

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        description="Answers to common questions about our Paithani sarees, shipping, care and returns."
        jsonLd={faqLd}
      />

      <section className="border-b border-beige bg-cream py-14 text-center">
        <Container>
          <span className="eyebrow">Here to Help</span>
          <h1 className="mt-3 text-4xl sm:text-5xl">Frequently Asked Questions</h1>
        </Container>
      </section>

      <Container className="py-16">
        <div className="mx-auto max-w-2xl">
          {faqs.map((f, i) => (
            <Item
              key={f.q}
              q={f.q}
              a={f.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>
      </Container>
    </>
  )
}
