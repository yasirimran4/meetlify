import { useState } from 'react'
import AdminAuthLayout from '../../../layouts/AdminAuthLayout'
import Alert from '../../../components/ui/Alert'
import LoginForm from '../components/LoginForm'

export default function AdminLoginPage() {
  const [serverError, setServerError] = useState(null)

  function handleServerError(message) {
    setServerError(message)
  }

  function dismissServerError() {
    setServerError(null)
  }

  return (
    <AdminAuthLayout>
      <div className="space-y-4">
        {serverError ? (
          <Alert
            title="Server Error"
            message={serverError}
            onDismiss={dismissServerError}
          />
        ) : null}

        <LoginForm onServerError={handleServerError} />
      </div>
    </AdminAuthLayout>
  )
}
