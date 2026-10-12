import { useEffect, useCallback } from 'react'
import Img from '../ui/Img'
import { CloseIcon } from '../ui/icons'

// Fullscreen image viewer with keyboard navigation (←/→/Esc) and on-screen controls.
export default function Lightbox({ images, index, onClose, onIndex, alt = '' }) {
  const prev = useCallback(() => onIndex((index - 1 + images.length) % images.length), [index, images.length, onIndex])
  const next = useCallback(() => onIndex((index + 1) % images.length), [index, images.length, onIndex])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/90" role="dialog" aria-modal="true" aria-label="Image viewer">
      <button onClick={onClose} aria-label="Close viewer" className="absolute right-5 top-5 text-3xl text-ivory/80 hover:text-ivory">
        <CloseIcon />
      </button>

      {images.length > 1 && (
        <button onClick={prev} aria-label="Previous image" className="absolute left-4 top-1/2 -translate-y-1/2 px-4 text-4xl text-ivory/70 hover:text-ivory">‹</button>
      )}

      <div className="max-h-[90vh] max-w-[92vw]">
        <Img src={images[index]} alt={alt} loading="eager" className="max-h-[90vh] w-auto object-contain" />
      </div>

      {images.length > 1 && (
        <button onClick={next} aria-label="Next image" className="absolute right-4 top-1/2 -translate-y-1/2 px-4 text-4xl text-ivory/70 hover:text-ivory">›</button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-ivory/70">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
