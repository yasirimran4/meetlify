import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Label from '../../../components/ui/Label'
import Checkbox from '../../../components/ui/Checkbox'
import { login } from '../../../services/authService'
import { saveTokens } from '../../../utils/storage'
import { validateLoginForm, hasValidationErrors } from '../../../utils/validation'
import { parseApiError } from '../../../utils/apiError'

export default function LoginForm({ onServerError }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  function handleFieldChange(setter, field) {
    return (event) => {
      setter(event.target.value)
      if (fieldErrors[field]) {
        setFieldErrors((current) => {
          const next = { ...current }
          delete next[field]
          return next
        })
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validateLoginForm({ email, password })

    if (hasValidationErrors(validationErrors)) {
      setFieldErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setFieldErrors({})

    try {
      const response = await login({
        email: email.trim(),
        password,
      })

      if (!response?.success || !response?.data) {
        onServerError?.('Authentication service is currently unavailable. Please try again later.')
        return
      }

      saveTokens({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        rememberMe,
      })

      setIsSuccess(true)
    } catch (error) {
      const parsed = parseApiError(error)

      if (parsed.isServerError) {
        onServerError?.(
          parsed.status === 0
            ? parsed.message
            : 'Authentication service is currently unavailable. Please try again later.',
        )
        return
      }

      if (parsed.isAuthError) {
        setFieldErrors({ password: parsed.message })
        return
      }

      if (hasValidationErrors(parsed.fieldErrors)) {
        setFieldErrors(parsed.fieldErrors)
        return
      }

      if (parsed.isRateLimited) {
        onServerError?.(parsed.message)
        return
      }

      setFieldErrors({ password: parsed.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Admin Login</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Enter your credentials to access the management dashboard.
        </p>
      </div>

      {isSuccess ? (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-success">Signed in successfully</p>
            <p className="mt-0.5 text-sm text-text-secondary">
              Your session is active. The admin dashboard will be available in the next release.
            </p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <Label htmlFor="email" required>
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@meetlify.com"
            value={email}
            onChange={handleFieldChange(setEmail, 'email')}
            error={fieldErrors.email}
            disabled={isSubmitting || isSuccess}
          />
        </div>

        <div>
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={handleFieldChange(setPassword, 'password')}
            error={fieldErrors.password}
            disabled={isSubmitting || isSuccess}
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Checkbox
            id="remember-me"
            label="Remember me"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isSubmitting || isSuccess}
          />
          <Link
            to="#"
            className="text-sm font-semibold text-text-primary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
            onClick={(event) => event.preventDefault()}
            aria-disabled="true"
            tabIndex={-1}
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting || isSuccess}>
          Sign In
        </Button>
      </form>
    </div>
  )
}
