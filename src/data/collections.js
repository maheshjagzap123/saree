// Mock collections. Replace with Supabase `collections` table reads later.

export const collections = [
  {
    slug: 'traditional-paithani',
    name: 'Traditional Paithani',
    tagline: 'Woven in the classic Yeola idiom',
    description:
      'Timeless Paithani weaves with signature muniya and peacock motifs, rendered in deep, regal tones for heirloom occasions.',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=70',
  },
  {
    slug: 'bridal-paithani',
    name: 'Bridal Collection',
    tagline: 'For the most important day',
    description:
      'Richly woven bridal Paithani designed to be worn, treasured and passed on across generations.',
    image:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=70',
  },
  {
    slug: 'silk-paithani',
    name: 'Silk Collection',
    tagline: 'Lustrous, lightweight, luminous',
    description:
      'Pure and semi-silk sarees with a soft fall and a quiet sheen, made for festive gatherings and celebrations.',
    image:
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1200&q=70',
  },
  {
    slug: 'designer-paithani',
    name: 'Designer Paithani',
    tagline: 'Heritage, reimagined',
    description:
      'Contemporary interpretations of traditional weaving, with modern palettes and considered detailing.',
    image:
      'https://images.unsplash.com/photo-1617059062018-6b7c5e2b9b9c?auto=format&fit=crop&w=1200&q=70',
  },
  {
    slug: 'festive-paithani',
    name: 'Festive Collection',
    tagline: 'Celebrate every tradition',
    description:
      'Vibrant, joyful weaves for Diwali, Gudi Padwa, pujas and family festivities throughout the year.',
    image:
      'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=1200&q=70',
  },
]

export function getCollection(slug) {
  return collections.find((c) => c.slug === slug)
}
