import { useState } from 'react'

// A resilient image: if the given src fails to load (network/404/rate-limit), it swaps to
// an inline SVG placeholder so the layout never renders blank. Used across the storefront
// so the demo looks complete even when external image hosts are unavailable.

// Brand-toned inline SVG placeholder (no network needed), encoded as a data URI.
function placeholder(label = 'Vastraa Paithani') {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#F3ECE1"/>
  <rect x="40" y="40" width="520" height="720" fill="none" stroke="#C9AD7E" stroke-width="2"/>
  <circle cx="300" cy="330" r="90" fill="none" stroke="#6E1023" stroke-width="2" opacity="0.5"/>
  <path d="M300 270 q40 60 0 120 q-40 -60 0 -120" fill="#4B1E5B" opacity="0.35"/>
  <text x="300" y="470" font-family="Georgia, serif" font-size="30" fill="#6E1023" text-anchor="middle">Vastraa</text>
  <text x="300" y="505" font-family="Arial, sans-serif" font-size="13" letter-spacing="4" fill="#B08D57" text-anchor="middle">PAITHANI</text>
  <text x="300" y="545" font-family="Arial, sans-serif" font-size="12" fill="#6B6259" text-anchor="middle">${String(label).slice(0, 42)}</text>
</svg>`.trim()
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export default function Img({ src, alt = '', className = '', loading = 'lazy', ...rest }) {
  const [failed, setFailed] = useState(false)
  const finalSrc = failed || !src ? placeholder(alt) : src
  return (
    <img
      src={finalSrc}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}

export { placeholder }
