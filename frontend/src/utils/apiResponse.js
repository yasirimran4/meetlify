export function unwrapApiData(response) {
  const body = response?.data

  if (!body) return null

  if (body.success === false) {
    const error = new Error(body.message ?? 'Request failed.')
    error.response = response
    throw error
  }

  return body.data ?? body
}

export function unwrapApiMessage(response) {
  return response?.data?.message ?? 'Success'
}
