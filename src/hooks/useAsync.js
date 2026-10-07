import { useEffect, useState } from 'react'

// Tiny async-data hook: runs an async function and tracks data/loading/error.
// `deps` controls re-running (e.g. a slug or query string).
export function useAsync(fn, deps = [], initial = null) {
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    Promise.resolve()
      .then(fn)
      .then((result) => {
        if (active) setData(result)
      })
      .catch((e) => {
        if (active) setError(e)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
