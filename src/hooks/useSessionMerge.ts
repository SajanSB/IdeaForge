import { useIdeaStore } from '@/stores/useIdeaStore'
import { useElicitationStore } from '@/stores/useElicitationStore'
import { useAuthStore } from '@/stores/useAuthStore'

export function useSessionMerge() {
  const { user } = useAuthStore()
  const { projectId, setStatus } = useIdeaStore()
  const { isComplete } = useElicitationStore()

  function mergeSession(): boolean {
    if (!user || !projectId) return false
    // Session data is already in Zustand (sessionStorage backed)
    // Just mark the project as linked to the authenticated user
    if (isComplete) {
      setStatus('estimating')
      return true
    }
    return false
  }

  return { mergeSession }
}
