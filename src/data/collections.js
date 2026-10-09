// Mock collections. Replace with Supabase `collections` table reads later.

import { sareeImage } from '../utils/sareeImage'
import { IMG } from '../assets/images'

// Real cover photo per collection (falls back to a generated illustration if missing).
const COLLECTION_IMAGE = {
  'traditional-paithani': IMG.purpleBanarasi,
  'bridal-paithani': IMG.bridalCollection,
  'silk-paithani': IMG.emeraldDisplay1,
  'designer-paithani': IMG.peacockCollection,
  'festive-paithani': IMG.festiveHeritage,
}
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

// Apply the real cover photo per collection; fall back to a generated illustration.
export const collections = rawCollections.map((c) => ({
  ...c,
  image:
    COLLECTION_IMAGE[c.slug] ||
    sareeImage({ color: COLLECTION_COLOR[c.slug] || 'Multicolor', seed: c.slug, w: 1200, h: 900, label: c.name }),
}))

export function getCollection(slug) {
  return collections.find((c) => c.slug === slug)
}
