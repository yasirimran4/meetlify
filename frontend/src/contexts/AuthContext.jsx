import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { clearTokens, getAccessToken } from '../utils/storage'
import { isTokenValid } from '../utils/jwt'

const AuthContext = createContext(null)

function resolveAuthenticatedState() {
  const token = getAccessToken()

  if (!token) return false

  if (!isTokenValid(token)) {
    clearTokens()
    return false
  }

  return true
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(resolveAuthenticatedState)

  const refreshAuthState = useCallback(() => {
    setIsAuthenticated(resolveAuthenticatedState())
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      logout,
      refreshAuthState,
    }),
    [isAuthenticated, logout, refreshAuthState],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
