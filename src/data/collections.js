// Mock collections. Replace with Supabase `collections` table reads later.

import { sareeImage } from '../utils/sareeImage'

// Theme colour per collection for the generated cover illustration.
const COLLECTION_COLOR = {
  'traditional-paithani': 'Purple',
  'bridal-paithani': 'Red',
  'silk-paithani': 'Green',
  'designer-paithani': 'Blue',
  'festive-paithani': 'Orange',
}

const rawCollections = [
  {
    slug: 'traditional-paithani',
    name: 'Traditional Paithani',
    tagline: 'Woven in the classic Yeola idiom',
    description:
      'Timeless Paithani weaves with signature muniya and peacock motifs, rendered in deep, regal tones for heirloom occasions.',
    image: '', // generated below in post-processing
  },
  {
    slug: 'bridal-paithani',
    name: 'Bridal Collection',
    tagline: 'For the most important day',
    description:
      'Richly woven bridal Paithani designed to be worn, treasured and passed on across generations.',
    image: '',
  },
  {
    slug: 'silk-paithani',
    name: 'Silk Collection',
    tagline: 'Lustrous, lightweight, luminous',
    description:
      'Pure and semi-silk sarees with a soft fall and a quiet sheen, made for festive gatherings and celebrations.',
    image: '',
  },
  {
    slug: 'designer-paithani',
    name: 'Designer Paithani',
    tagline: 'Heritage, reimagined',
    description:
      'Contemporary interpretations of traditional weaving, with modern palettes and considered detailing.',
    image: '',
  },
  {
    slug: 'festive-paithani',
    name: 'Festive Collection',
    tagline: 'Celebrate every tradition',
    description:
      'Vibrant, joyful weaves for Diwali, Gudi Padwa, pujas and family festivities throughout the year.',
    image: '',
  },
]

// Replace the cover image with a colour-themed saree illustration per collection.
export const collections = rawCollections.map((c) => ({
  ...c,
  image: sareeImage({ color: COLLECTION_COLOR[c.slug] || 'Multicolor', seed: c.slug, w: 1200, h: 900, label: c.name }),
}))

export function getCollection(slug) {
  return collections.find((c) => c.slug === slug)
}
