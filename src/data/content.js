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

// ============================================================================
// Editorial content for the redesigned homepage & craft sections (Pass 1).
// All copy here is placeholder/editorial — contains no unverifiable business
// claims (no certifications, counts, awards, guarantees). Admin-editable later.
// ============================================================================

// Section 01 — Cinematic hero
export const hero = {
  eyebrow: 'The Vastraa Atelier',
  titleLines: ['Woven for the moments', 'you will remember.'],
  copy: 'Paithani sarees shaped by colour, craft and generations of Indian textile tradition.',
  primaryCta: { label: 'Explore the Edit', to: '/shop' },
  secondaryCta: { label: 'Discover the Craft', to: '/about' },
  desktopImage:
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=2000&q=80',
  mobileImage:
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80',
}

// Section 03 — Find Your Paithani (discovery paths)
export const discoveryPaths = [
  {
    key: 'bride',
    title: 'The Bride',
    description: 'For wedding and bridal moments.',
    to: '/collections/bridal-paithani',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=75',
  },
  {
    key: 'celebration',
    title: 'The Celebration',
    description: 'For festivals and special occasions.',
    to: '/collections/festive-paithani',
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=1000&q=75',
  },
  {
    key: 'classic',
    title: 'The Classic',
    description: 'Traditional Paithani character.',
    to: '/collections/traditional-paithani',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=75',
  },
  {
    key: 'statement',
    title: 'The Statement',
    description: 'Bold colours and dramatic motifs.',
    to: '/collections/designer-paithani',
    image: 'https://images.unsplash.com/photo-1617059062018-6b7c5e2b9b9c?auto=format&fit=crop&w=1000&q=75',
  },
  {
    key: 'gift',
    title: 'The Gift',
    description: 'Curated choices for meaningful occasions.',
    to: '/shop',
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1000&q=75',
  },
]

// Section 04 — Paithani by Character (weave/style families)
export const characterStyles = [
  { title: 'Single Muniya', note: 'A single row of parrot motifs along the border.', query: 'single muniya' },
  { title: 'Triple Muniya', note: 'Three rows of muniya for a richer border.', query: 'triple muniya' },
  { title: 'Brocade', note: 'Dense, raised zari patterning.', query: 'brocade' },
  { title: 'Tissue', note: 'A luminous tissue-gold sheen.', query: 'tissue' },
  { title: 'Peacock', note: 'The signature peacock pallu.', query: 'peacock' },
  { title: 'Asawali', note: 'Flowering vine and creeper motifs.', query: 'asawali' },
]

// Section 06 — The Colour Story
export const colourStory = [
  { name: 'Royal Purple', value: 'Purple', swatch: '#4B1E5B' },
  { name: 'Emerald', value: 'Green', swatch: '#1F5B3A' },
  { name: 'Rani Pink', value: 'Pink', swatch: '#B23A6B' },
  { name: 'Deep Blue', value: 'Blue', swatch: '#1E3A5B' },
  { name: 'Vermilion', value: 'Red', swatch: '#9C2A1E' },
  { name: 'Ivory', value: 'Ivory', swatch: '#EFE7D8' },
  { name: 'Antique Gold', value: 'Gold', swatch: '#9C7B4A' },
  { name: 'Multicolour', value: 'Multicolor', swatch: 'linear-gradient(135deg,#4B1E5B,#9C2A1E,#9C7B4A)' },
]

// Section 07 — The Atelier (craft journey)
export const atelierSteps = [
  { no: '01', title: 'Silk', text: 'The journey begins with fine silk yarn, chosen for lustre and strength.', image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1200&q=75' },
  { no: '02', title: 'Colour', text: 'Yarn is dyed in deep, traditional palettes.', image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?auto=format&fit=crop&w=1200&q=75' },
  { no: '03', title: 'Motif', text: 'Peacocks, muniya and vines are mapped onto the loom.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=75' },
  { no: '04', title: 'Loom', text: 'The warp is dressed and the handloom prepared.', image: 'https://images.unsplash.com/photo-1591130901961-3564a2c0a3f6?auto=format&fit=crop&w=1200&q=75' },
  { no: '05', title: 'Weave', text: 'The border and pallu are woven thread by thread.', image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1200&q=75' },
  { no: '06', title: 'Finish', text: 'Each saree is checked, finished and readied for its new home.', image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=1200&q=75' },
]

// Section 12 — Final brand statement
export const brandStatement = {
  lines: ['Not just a saree.', 'A piece of memory,', 'woven to last.'],
  cta: { label: 'Explore the Collection', to: '/shop' },
  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=80',
}

// Section 11 — Personal assistance
export const assistance = {
  title: 'Need help choosing?',
  copy: "Tell us your occasion, preferred colour and budget. We'll help you find a saree that feels right.",
}

// Craft Library definitions (used by Craft Library pages later; safe to export now)
export const craftLibrary = [
  { slug: 'single-muniya', title: 'Single Muniya', summary: 'A single row of parrot (muniya) motifs running along the border.' },
  { slug: 'triple-muniya', title: 'Triple Muniya', summary: 'Three rows of muniya motifs for a deeper, richer border.' },
  { slug: 'brocade', title: 'Brocade', summary: 'Dense, raised zari patterning woven into the ground.' },
  { slug: 'tissue', title: 'Tissue', summary: 'A fine weave with a luminous tissue-gold sheen.' },
  { slug: 'peacock', title: 'Peacock', summary: 'The signature Paithani pallu alive with peacock motifs.' },
  { slug: 'asawali', title: 'Asawali', summary: 'Flowering vine and creeper motifs, a classical Paithani theme.' },
]
