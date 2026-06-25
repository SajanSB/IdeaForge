import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading, refreshSession } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    refreshSession().then(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        navigate(redirectTo, { replace: true })
      }
    })
  }, [])

  return { isAuthenticated, isLoading }
}

export function useRequireAdmin(redirectTo = '/dashboard') {
  const { isAdmin, refreshSession } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    refreshSession().then(() => {
      if (!useAuthStore.getState().isAdmin) {
        navigate(redirectTo, { replace: true })
      }
    })
  }, [])

  return { isAdmin }
}
