import { useRef, useState } from 'react'
import Img from '../ui/Img'

// Flipkart/Amazon-style in-place image zoom. On MOUSE hover only, the image magnifies and
// pans to follow the cursor within its frame. Disabled on touch devices (coarse pointer),
// when the device can't hover, and when the user prefers reduced motion.

function canZoom() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return finePointer && !reduce
}

export default function ZoomImage({ src, alt = '', zoom = 2.2, className = '' }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })

  function handleEnter() {
    if (canZoom()) setActive(true)
  }
  function handleLeave() {
    setActive(false)
  }
  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${active ? 'cursor-zoom-in' : ''} ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
    >
      <Img
        src={src}
        alt={alt}
        loading="eager"
        className="aspect-[4/5] h-full w-full object-cover transition-transform duration-200 ease-out will-change-transform"
        style={
          active
            ? { transform: `scale(${zoom})`, transformOrigin: `${pos.x}% ${pos.y}%` }
            : { transform: 'scale(1)' }
        }
      />
    </div>
  )
}
