import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageLoader } from '@/components/ui/Loader'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageLoader label="Loading your workspace…" />

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
