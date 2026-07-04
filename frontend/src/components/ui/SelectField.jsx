import { useId } from 'react'

export default function SelectField({ id, label, value, onChange, options, className = '' }) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={selectId} className="mb-2 block text-sm font-medium text-text-primary">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-lg border border-border-input bg-surface px-3 text-sm text-text-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
