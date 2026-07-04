import { useCallback, useState, useEffect } from 'react'
import { UploadCloud, X } from 'lucide-react'

export default function ImageUpload({ value, onChange, error, disabled }) {
  const [preview, setPreview] = useState(value || null)

  useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value)
    }
  }, [value])

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (file) {
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
        onChange(file)
      }
    },
    [onChange]
  )

  const handleRemove = useCallback(() => {
    setPreview(null)
    onChange(null)
  }, [onChange])

  return (
    <div className="w-full">
      <div
        className={`relative flex items-center justify-center w-full rounded-xl border-2 border-dashed transition-colors ${
          error
            ? 'border-error bg-error-muted/20'
            : 'border-border bg-surface-subtle hover:border-text-secondary/40'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {preview ? (
          <div className="relative w-full aspect-video overflow-hidden rounded-xl group">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {!disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRemove()
                  }}
                  className="rounded-full bg-surface p-2 text-error hover:bg-error-muted transition-colors"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full aspect-video cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-3 text-text-secondary" aria-hidden="true" />
              <p className="mb-2 text-sm text-text-secondary">
                <span className="font-semibold text-primary">Click to upload</span>
              </p>
              <p className="text-xs text-text-secondary">JPEG, PNG or WEBP (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  )
}
