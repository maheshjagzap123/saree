// Shared form validation helpers.

// Keep only digits, max 10 (Indian mobile without country code).
export function sanitizePhone(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 10)
}

// Valid Indian 10-digit mobile (starts 6-9).
export function isValidPhone(value) {
  return /^[6-9]\d{9}$/.test(sanitizePhone(value))
}

// Email must contain @ and a .com (or other) TLD. Keeps it strict but simple.
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(String(value || '').trim())
}

// Indian PIN code: exactly 6 digits.
export function sanitizePin(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 6)
}
export function isValidPin(value) {
  return /^\d{6}$/.test(sanitizePin(value))
}

// Store phone with the +91 prefix for display/records.
export function withCountryCode(tenDigits) {
  const d = sanitizePhone(tenDigits)
  return d ? `+91 ${d}` : ''
}
