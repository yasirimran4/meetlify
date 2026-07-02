export default function Label({ htmlFor, children, className = '', required = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-sm font-medium text-text-primary ${className}`}
    >
      {children}
      {required ? <span className="sr-only"> (required)</span> : null}
    </label>
  )
}
