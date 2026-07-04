import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ADMIN_ROUTES } from '../../constants/api'

export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ADMIN_ROUTES.dashboard} replace />
  }

  return children
}
