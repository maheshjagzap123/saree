// Generates on-brand, saree-specific SVG illustrations as data URIs.
// Used for the demo so every image is relevant (a draped saree with a Paithani-style
// border, pallu and peacock/floral motifs) and always loads with no network.
// Real photography can replace these per-product via the admin or by editing the data.

// Colour themes keyed by product colour name.
const THEMES = {
  Purple: { body: '#4B1E5B', border: '#B08D57', accent: '#C9AD7E', pallu: '#3A1546' },
  Green: { body: '#1F5B3A', border: '#B08D57', accent: '#D7B46A', pallu: '#164029' },
  Red: { body: '#9C2A1E', border: '#C9AD7E', accent: '#E0C27A', pallu: '#7A1E15' },
  Pink: { body: '#B23A6B', border: '#B08D57', accent: '#E7C98A', pallu: '#8E2B52' },
  Blue: { body: '#1E3A5B', border: '#C9AD7E', accent: '#D7B46A', pallu: '#152B45' },
  Black: { body: '#2A2522', border: '#B08D57', accent: '#C9AD7E', pallu: '#15120F' },
  Orange: { body: '#C2641E', border: '#9C2A1E', accent: '#E0C27A', pallu: '#9C4E14' },
  Multicolor: { body: '#6E1023', border: '#B08D57', accent: '#4B1E5B', pallu: '#4B1E5B' },
  Ivory: { body: '#E7DCCB', border: '#B08D57', accent: '#9C7B4A', pallu: '#D8C8AE' },
  Gold: { body: '#9C7B4A', border: '#6E1023', accent: '#C9AD7E', pallu: '#7E6238' },
}
const DEFAULT_THEME = { body: '#6E1023', border: '#B08D57', accent: '#C9AD7E', pallu: '#520B1A' }

// Deterministic small hash from a string (for subtle per-item variation).
function hash(str) {
  let h = 0
  for (let i = 0; i < String(str).length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff
  return h
}

// A repeating peacock-ish motif band.
function motifBand(y, w, color) {
  let band = ''
  const step = 46
  for (let x = 20; x < w - 20; x += step) {
    band += `<path d="M${x} ${y} q10 -14 20 0 q-10 10 -20 0 Z" fill="${color}" opacity="0.9"/>`
    band += `<circle cx="${x + 10}" cy="${y - 5}" r="2.2" fill="${color}"/>`
  }
  return band
}

/**
 * Build a saree illustration data URI.
 * @param {object} opts { color, seed, w, h, label }
 */
export function sareeImage({ color = 'Multicolor', seed = '', w = 900, h = 1200, label = '' } = {}) {
  const t = THEMES[color] || DEFAULT_THEME
  const v = hash(`${color}-${seed}`)
  const drapeShift = (v % 40) - 20

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FBF8F3"/>
      <stop offset="1" stop-color="#F3ECE1"/>
    </linearGradient>
    <linearGradient id="silk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.body}"/>
      <stop offset="0.55" stop-color="${t.pallu}"/>
      <stop offset="1" stop-color="${t.body}"/>
    </linearGradient>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#bg)"/>

  <!-- draped saree body -->
  <path d="M${w * 0.2 + drapeShift} 0
           C ${w * 0.1} ${h * 0.3}, ${w * 0.3} ${h * 0.5}, ${w * 0.22} ${h}
           L ${w * 0.82} ${h}
           C ${w * 0.74} ${h * 0.55}, ${w * 0.92} ${h * 0.32}, ${w * 0.78 + drapeShift} 0 Z"
        fill="url(#silk)"/>

  <!-- zari border (left + right edges of the drape) -->
  <path d="M${w * 0.2 + drapeShift} 0 C ${w * 0.1} ${h * 0.3}, ${w * 0.3} ${h * 0.5}, ${w * 0.22} ${h}"
        fill="none" stroke="${t.border}" stroke-width="14"/>
  <path d="M${w * 0.78 + drapeShift} 0 C ${w * 0.92} ${h * 0.32}, ${w * 0.74} ${h * 0.55}, ${w * 0.82} ${h}"
        fill="none" stroke="${t.border}" stroke-width="14"/>

  <!-- pallu band near the top -->
  <rect x="${w * 0.17 + drapeShift}" y="${h * 0.08}" width="${w * 0.64}" height="${h * 0.12}" fill="${t.border}" opacity="0.85" transform="skewX(-6)"/>
  ${motifBand(h * 0.15, w, t.accent)}

  <!-- lower border band -->
  <rect x="${w * 0.2}" y="${h * 0.86}" width="${w * 0.62}" height="26" fill="${t.border}" opacity="0.9"/>
  ${motifBand(h * 0.9, w, t.accent)}

  <!-- central peacock motif -->
  <g transform="translate(${w / 2 + drapeShift / 2} ${h * 0.5})" opacity="0.9">
    <path d="M0 -70 q46 24 0 90 q-46 -66 0 -90 Z" fill="${t.accent}" opacity="0.55"/>
    <circle cx="0" cy="-40" r="10" fill="${t.border}"/>
    <circle cx="0" cy="-40" r="4" fill="${t.body}"/>
    <path d="M-34 10 q34 40 68 0" fill="none" stroke="${t.accent}" stroke-width="3" opacity="0.7"/>
  </g>

  <!-- wordmark -->
  <text x="${w / 2}" y="${h - 40}" font-family="Georgia, serif" font-size="26" fill="${t.body}" text-anchor="middle" opacity="0.85">Vastraa Paithani</text>
  ${label ? `<text x="${w / 2}" y="${h - 14}" font-family="Arial, sans-serif" font-size="13" letter-spacing="2" fill="#6B6259" text-anchor="middle">${String(label).slice(0, 40)}</text>` : ''}
</svg>`.trim()

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// A craft/atelier themed panel (loom + threads) for editorial sections.
export function craftImage({ seed = '', w = 1200, h = 900, title = '' } = {}) {
  const v = hash(seed)
  const warp = []
  for (let i = 0; i < 14; i++) {
    const x = (w / 15) * (i + 1)
    warp.push(`<line x1="${x}" y1="60" x2="${x}" y2="${h - 60}" stroke="#B08D57" stroke-width="2" opacity="${0.3 + ((v + i) % 5) * 0.1}"/>`)
  }
  const weft = []
  for (let j = 0; j < 6; j++) {
    const y = 120 + j * ((h - 240) / 5)
    weft.push(`<line x1="60" y1="${y}" x2="${w - 60}" y2="${y}" stroke="#6E1023" stroke-width="3" opacity="0.5"/>`)
  }
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#2A2522"/>
  <rect x="30" y="30" width="${w - 60}" height="${h - 60}" fill="#3A332E"/>
  ${warp.join('')}
  ${weft.join('')}
  <text x="${w / 2}" y="${h - 30}" font-family="Georgia, serif" font-size="26" fill="#C9AD7E" text-anchor="middle">${title || 'The Atelier'}</text>
</svg>`.trim()
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
