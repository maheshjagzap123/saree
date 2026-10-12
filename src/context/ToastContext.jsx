import { createContext, useCallback, useContext, useState } from 'react'

// Lightweight toast notifications. Call useToast().notify('message') or
// notify('message', 'error'). Auto-dismiss after a few seconds.
const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const notify = useCallback(
    (message, variant = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, message, variant }])
      setTimeout(() => dismiss(id), 3500)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {/* Live region for screen readers + visual stack */}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3 text-sm shadow-lg ${
              t.variant === 'error' ? 'bg-wine text-ivory' : 'bg-charcoal text-ivory'
            }`}
          >
            <span>{t.message}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-ivory/70 hover:text-ivory">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  // Safe no-op if provider is missing, so components never crash.
  return ctx || { notify: () => {} }
}
