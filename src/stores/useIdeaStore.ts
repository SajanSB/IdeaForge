import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Industry, ProjectStatus, TechPreference } from '@/types/project'
import { generateProjectId } from '@/utils/generateProjectId'

interface IdeaStore {
  projectId: string | null
  ideaText: string
  industry: Industry | ''
  techPreference: TechPreference
  status: ProjectStatus
  createdAt: string | null
  setIdea: (text: string, industry: Industry | '', tech: TechPreference) => void
  initProject: () => string
  setStatus: (status: ProjectStatus) => void
  reset: () => void
}

const INITIAL: Omit<IdeaStore, 'setIdea' | 'initProject' | 'setStatus' | 'reset'> = {
  projectId: null, ideaText: '', industry: '', techPreference: 'Any',
  status: 'draft', createdAt: null,
}

export const useIdeaStore = create<IdeaStore>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      setIdea: (text, industry, tech) => set({ ideaText: text, industry, techPreference: tech }),
      initProject: () => {
        const id = get().projectId ?? generateProjectId()
        set({ projectId: id, status: 'eliciting', createdAt: new Date().toISOString() })
        return id
      },
      setStatus: (status) => set({ status }),
      reset: () => set(INITIAL),
    }),
    { name: 'ideaforge_v1_idea', storage: createJSONStorage(() => sessionStorage) }
  )
)
