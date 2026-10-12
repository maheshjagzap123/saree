import { sanitizePhone } from '../../utils/validation'

// Phone input with a fixed, non-editable +91 prefix. Accepts only digits, max 10.
// `value` is the 10-digit string (no +91). onChange receives the sanitized 10-digit string.
export default function PhoneField({ value, onChange, id = 'phone', required = true, className = '' }) {
  return (
    <div className={`flex items-stretch border border-beige bg-ivory focus-within:border-wine ${className}`}>
      <span className="flex select-none items-center border-r border-beige px-3 text-sm text-muted">+91</span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="9876543210"
        value={value}
        onChange={(e) => onChange(sanitizePhone(e.target.value))}
        required={required}
        pattern="[6-9][0-9]{9}"
        title="Enter a 10-digit mobile number starting with 6-9"
        maxLength={10}
        className="w-full bg-transparent px-3 py-2 text-sm outline-none"
      />
    </div>
  )
}
