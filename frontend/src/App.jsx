import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLoginPage from './features/auth/pages/AdminLoginPage'
import { ADMIN_ROUTES } from './constants/api'

function App() {
  return (
    <Routes>
      <Route path={ADMIN_ROUTES.login} element={<AdminLoginPage />} />
      <Route path="/" element={<Navigate to={ADMIN_ROUTES.login} replace />} />
      <Route path="*" element={<Navigate to={ADMIN_ROUTES.login} replace />} />
    </Routes>
  )
}

export default App
