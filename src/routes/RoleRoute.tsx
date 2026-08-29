import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { Role } from '@/types'

export default function RoleRoute({ role, children }: { role: Role; children: ReactNode }) {
  const { currentUser } = useAuth()

  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== role) return <Navigate to={`/app/${currentUser.role}`} replace />

  return <>{children}</>
}
