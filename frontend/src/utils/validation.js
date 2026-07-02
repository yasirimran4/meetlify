const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginForm({ email, password }) {
  const errors = {}

  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    errors.email = 'Email address is required.'
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  }

  return errors
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0
}
