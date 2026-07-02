export function parseApiError(error) {
  if (!error.response) {
    return {
      status: 0,
      message: 'Unable to connect to the server. Please check your connection and try again.',
      errorCode: 'NETWORK_ERROR',
      fieldErrors: {},
      isServerError: true,
    }
  }

  const { status, data } = error.response
  const message = data?.message ?? data?.detail ?? 'Something went wrong. Please try again.'
  const errorCode = data?.error_code ?? 'UNKNOWN_ERROR'
  const fieldErrors = {}

  if (Array.isArray(data?.errors)) {
    for (const item of data.errors) {
      if (item.field) {
        fieldErrors[item.field] = item.message
      }
    }
  }

  const isAuthError =
    status === 401 ||
    errorCode === 'AUTH_INVALID_CREDENTIALS' ||
    errorCode === 'USER_NOT_FOUND'

  const isRateLimited = status === 429

  return {
    status,
    message: isAuthError
      ? 'Invalid email or password. Please try again.'
      : isRateLimited
        ? 'Too many login attempts. Please try again in a few minutes.'
        : message,
    errorCode,
    fieldErrors,
    isServerError: status >= 500,
    isAuthError,
    isRateLimited,
  }
}
