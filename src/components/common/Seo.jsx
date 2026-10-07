import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'Vastraa Paithani'
const SITE_URL = 'https://vastraapaithani.example'
const DEFAULT_DESC =
  'Explore handcrafted Paithani sarees inspired by the heritage of Yeola. Discover traditional silk, bridal and festive collections from Vastraa Paithani.'

function setMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(url) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

function setJsonLd(id, data) {
  let el = document.getElementById(id)
  if (data) {
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = id
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(data)
  } else if (el) {
    el.remove()
  }
}

/**
 * Per-page SEO. Sets title, description, canonical, OpenGraph, and optional JSON-LD.
 * This is a lightweight stand-in; swap for react-helmet-async / SSR meta later if needed.
 */
export default function Seo({ title, description, image, type = 'website', jsonLd }) {
  const { pathname } = useLocation()
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | The Art of Timeless Paithani`
  const desc = description || DEFAULT_DESC
  const url = `${SITE_URL}${pathname}`

  useEffect(() => {
    document.title = fullTitle
    setMeta('name', 'description', desc)
    setCanonical(url)

    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', url)
    if (image) setMeta('property', 'og:image', image)

    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)

    setJsonLd('page-jsonld', jsonLd)
  }, [fullTitle, desc, url, type, image, jsonLd])

  return null
}

export { SITE_NAME, SITE_URL }
