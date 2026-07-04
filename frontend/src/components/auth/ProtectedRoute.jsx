import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ADMIN_ROUTES } from '../../constants/api'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ADMIN_ROUTES.login} state={{ from: location }} replace />
  }

  return children
}
