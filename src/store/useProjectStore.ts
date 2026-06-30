import { create } from 'zustand'

export type ProjectStatus = 'draft' | 'generating' | 'complete' | 'failed'

export interface Project {
  id: string
  ideaText: string
  industry?: string
  techPreference?: string
  status: ProjectStatus
  qaTranscript: { q: string; a: string; skipped?: boolean }[]
  documents: Record<string, string>
  createdAt: string
}

interface ProjectState {
  currentProject: Project | null
  projects: Project[]
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateCurrentProject: (updates: Partial<Project>) => void
  deleteProject: (id: string) => void
}

const mockProjects: Project[] = [
  {
    id: 'proj-123',
    ideaText: 'A marketplace for local home chefs to sell their meals to neighbours.',
    industry: 'FoodTech',
    techPreference: 'React',
    status: 'complete',
    qaTranscript: [
      { q: 'Who is your primary target audience?', a: 'Local neighbours looking for home-cooked food.' }
    ],
    documents: {},
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
]

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  projects: mockProjects,
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateCurrentProject: (updates) => set((state) => ({
    currentProject: state.currentProject ? { ...state.currentProject, ...updates } : null,
    projects: state.projects.map(p => p.id === state.currentProject?.id ? { ...p, ...updates } : p)
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject
  }))
}))
