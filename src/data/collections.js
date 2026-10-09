// Mock collections. Replace with Supabase `collections` table reads later.

export const collections = [
  {
    slug: 'traditional-paithani',
    name: 'Traditional Paithani',
    tagline: 'Woven in the classic Yeola idiom',
    description:
      'Timeless Paithani weaves with signature muniya and peacock motifs, rendered in deep, regal tones for heirloom occasions.',
    image: 'https://picsum.photos/seed/vp-col-traditional/1200/900',
  },
  {
    slug: 'bridal-paithani',
    name: 'Bridal Collection',
    tagline: 'For the most important day',
    description:
      'Richly woven bridal Paithani designed to be worn, treasured and passed on across generations.',
    image: 'https://picsum.photos/seed/vp-col-bridal/1200/900',
  },
  {
    slug: 'silk-paithani',
    name: 'Silk Collection',
    tagline: 'Lustrous, lightweight, luminous',
    description:
      'Pure and semi-silk sarees with a soft fall and a quiet sheen, made for festive gatherings and celebrations.',
    image: 'https://picsum.photos/seed/vp-col-silk/1200/900',
  },
  {
    slug: 'designer-paithani',
    name: 'Designer Paithani',
    tagline: 'Heritage, reimagined',
    description:
      'Contemporary interpretations of traditional weaving, with modern palettes and considered detailing.',
    image: 'https://picsum.photos/seed/vp-col-designer/1200/900',
  },
  {
    slug: 'festive-paithani',
    name: 'Festive Collection',
    tagline: 'Celebrate every tradition',
    description:
      'Vibrant, joyful weaves for Diwali, Gudi Padwa, pujas and family festivities throughout the year.',
    image: 'https://picsum.photos/seed/vp-col-festive/1200/900',
  },
]

export function getCollection(slug) {
  return collections.find((c) => c.slug === slug)
}
