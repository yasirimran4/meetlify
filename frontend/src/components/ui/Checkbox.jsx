export default function Checkbox({ id, label, className = '', ...props }) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex cursor-pointer items-center gap-2 text-sm text-text-secondary ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-border-input text-primary focus:ring-primary/30"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}
