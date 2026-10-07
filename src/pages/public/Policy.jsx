import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'

// Simple content page used for Shipping, Returns, Privacy and Terms. Replace the
// placeholder copy with the real business policies before launch.
const CONTENT = {
  shipping: {
    title: 'Shipping Policy',
    intro: 'How and when your order reaches you.',
    body: [
      'We offer pan-India delivery on all orders. Orders are typically dispatched within 2–4 business days.',
      'Shipping charges, where applicable, are calculated at checkout. Complimentary shipping may apply on qualifying orders.',
      'Once dispatched, you will receive tracking details to follow your order to delivery.',
    ],
  },
  returns: {
    title: 'Returns & Exchanges',
    intro: 'Our approach to returns and exchanges.',
    body: [
      'Because each saree is a premium handcrafted piece, we encourage you to review the product details carefully and reach out to us with any questions before ordering.',
      'If something is not right with your order, contact us promptly and we will do our best to help.',
      'Please replace this placeholder with the shop’s confirmed return and exchange terms.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'How we handle your information.',
    body: [
      'We collect only the information needed to process your orders and provide customer support.',
      'We do not sell your personal information. Payment details are handled by secure, trusted providers.',
      'Please replace this placeholder with the shop’s confirmed privacy policy.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'The terms that apply to using our store.',
    body: [
      'By using this website and placing an order, you agree to the terms outlined here.',
      'Product colours may vary slightly due to screen settings and the nature of handcrafted weaving.',
      'Please replace this placeholder with the shop’s confirmed terms and conditions.',
    ],
  },
}

export default function Policy({ type }) {
  const data = CONTENT[type] || CONTENT.shipping

  return (
    <>
      <Seo title={data.title} description={data.intro} />
      <section className="border-b border-beige bg-cream py-14 text-center">
        <Container>
          <span className="eyebrow">Customer Care</span>
          <h1 className="mt-3 text-4xl sm:text-5xl">{data.title}</h1>
        </Container>
      </section>
      <Container className="py-16">
        <div className="mx-auto max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
          {data.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Container>
    </>
  )
}
