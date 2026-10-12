import { useState } from 'react'

// Captures the browser's current location (latitude/longitude) on demand.
// Requires user permission and a secure context (HTTPS or localhost).
export function useGeolocation() {
  const [coords, setCoords] = useState(null) // { latitude, longitude }
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  function capture() {
    if (!('geolocation' in navigator)) {
      setStatus('error')
      setError('Location is not supported by this browser.')
      return
    }
    setStatus('loading')
    setError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        }
        setCoords(next)
        setStatus('success')
      },
      (err) => {
        setStatus('error')
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied.'
            : 'Could not get your location.'
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  return { coords, status, error, capture, setCoords }
}
