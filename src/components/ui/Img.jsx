import { useState } from 'react'
import { sareeImage } from '../../utils/sareeImage'

// A resilient image: if the given src fails to load (network/404), it swaps to an on-brand
// saree illustration so the layout never renders blank and stays relevant to the store.

export default function Img({ src, alt = '', className = '', loading = 'lazy', ...rest }) {
  const [failed, setFailed] = useState(false)
  const finalSrc = failed || !src ? sareeImage({ seed: alt || 'vastraa', label: alt }) : src
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
