// Mock editorial content (trust strip, craftsmanship steps, why-us, testimonials,
// journal, occasions). Admin-managed later via a homepage CMS.

export const announcement = 'Complimentary shipping on orders above ₹10,000'

export const trustStrip = [
  'Authentic Craftsmanship',
  'Handcrafted Sarees',
  'Secure Shopping',
  'Personalized Assistance',
  'Pan-India Delivery',
]

export const occasions = [
  { name: 'Wedding', slug: 'wedding' },
  { name: 'Bridal', slug: 'bridal' },
  { name: 'Festive', slug: 'festive' },
  { name: 'Puja', slug: 'puja' },
  { name: 'Reception', slug: 'reception' },
  { name: 'Gifting', slug: 'gifting' },
]

export const craftsmanshipSteps = [
  { no: '01', title: 'Selecting the Silk', text: 'Choosing fine silk yarn with the right sheen and strength.' },
  { no: '02', title: 'Preparing the Yarn', text: 'Dyeing and winding the yarn in traditional colour palettes.' },
  { no: '03', title: 'Creating the Motifs', text: 'Mapping peacock, muniya and floral motifs onto the loom.' },
  { no: '04', title: 'Weaving the Border', text: 'Hand-weaving the signature border and ornate pallu.' },
  { no: '05', title: 'Finishing the Saree', text: 'Careful finishing, checking and preparing for its new home.' },
]

export const whyChooseUs = [
  { title: 'Authentic Craftsmanship', text: 'Weaves rooted in Maharashtrian tradition.' },
  { title: 'Curated Collections', text: 'A considered edit, never an endless catalogue.' },
  { title: 'Personal Assistance', text: 'Guidance to help you choose the right saree.' },
  { title: 'Quality Checked', text: 'Every saree inspected before it ships.' },
  { title: 'Secure Payments', text: 'Safe, trusted checkout.' },
  { title: 'Reliable Delivery', text: 'Carefully packed, delivered pan-India.' },
]

export const testimonials = [
  { stars: 5, quote: 'The saree was even more beautiful in person.', author: 'Priya S.' },
  { stars: 5, quote: 'Exquisite weave and the colours are stunning. Felt truly special.', author: 'Aishwarya K.' },
  { stars: 5, quote: 'Wonderful personal help choosing my bridal Paithani.', author: 'Neha D.' },
]

export const journal = [
  {
    slug: 'what-is-paithani-saree',
    title: 'What Is a Paithani Saree?',
    excerpt: 'An introduction to the heritage, weave and character of the Paithani.',
    category: 'Paithani',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=70',
  },
  {
    slug: 'single-muniya-vs-triple-muniya',
    title: 'Single Muniya vs Triple Muniya',
    excerpt: 'Understanding the difference between these two classic Paithani weaves.',
    category: 'Weaves',
    image:
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&q=70',
  },
  {
    slug: 'how-to-care-for-paithani-saree',
    title: 'How to Care for a Silk Paithani',
    excerpt: 'Simple ways to store, protect and preserve your silk saree for years.',
    category: 'Care',
    image:
      'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=900&q=70',
  },
]

export const store = {
  name: 'Vastraa Paithani',
  address: 'Yeola, Nashik District, Maharashtra, India',
  phone: '+91 99999 99999',
  email: 'hello@vastraapaithani.example',
  hours: 'Mon–Sat, 10:00 AM – 8:00 PM',
}

export const faqs = [
  {
    q: 'Are your sarees handcrafted?',
    a: 'Our collection focuses on handcrafted Paithani and silk sarees rooted in Maharashtrian weaving traditions. Each product page lists its specific weave and craft details.',
  },
  {
    q: 'Do you ship across India?',
    a: 'Yes, we offer pan-India delivery. Shipping timelines and charges are shown at checkout.',
  },
  {
    q: 'Is a blouse piece included?',
    a: 'Most of our sarees include a blouse piece. This is clearly indicated on each product page under Details.',
  },
  {
    q: 'How do I care for a silk Paithani?',
    a: 'We recommend dry cleaning only, and storing the saree wrapped in a soft cotton or muslin cloth away from direct sunlight. See each product page for specific care notes.',
  },
  {
    q: 'Can I enquire about a saree before buying?',
    a: 'Absolutely. Use the WhatsApp button on any product page to ask us about availability, colour, or styling.',
  },
  {
    q: 'What is your return policy?',
    a: 'Please see our Returns page for the full policy. Reach out to us directly if you have any questions about a specific order.',
  },
]
