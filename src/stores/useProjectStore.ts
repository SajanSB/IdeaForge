import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProjectStatus, Industry, TechPreference } from '@/types/project'

export interface ProjectRecord {
  projectId:      string
  userId:         string
  ideaText:       string           // full idea text (for search and review)
  industry:       Industry | ''
  techPreference: TechPreference
  status:         ProjectStatus
  docsComplete:   number           // 0–13
  amountPaidInr?: number
  gateway?:       'razorpay' | 'stripe'
  orderId?:       string
  paymentId?:     string
  createdAt:      string           // ISO datetime
  updatedAt:      string
  completedAt?:   string
}

interface ProjectStore {
  projects:           ProjectRecord[]

  addProject:         (project: ProjectRecord) => void
  updateProject:      (projectId: string, updates: Partial<ProjectRecord>) => void
  removeProject:      (projectId: string) => void
  getProject:         (projectId: string) => ProjectRecord | undefined
  getProjectsSorted:  () => ProjectRecord[]   // newest first
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],

      addProject: (project) =>
        set(s => ({
          // Avoid duplicates — replace if projectId already exists
          projects: [
            project,
            ...s.projects.filter(p => p.projectId !== project.projectId),
          ],
        })),

      updateProject: (projectId, updates) =>
        set(s => ({
          projects: s.projects.map(p =>
            p.projectId === projectId
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      removeProject: (projectId) =>
        set(s => ({
          projects: s.projects.filter(p => p.projectId !== projectId),
        })),

      getProject: (projectId) =>
        get().projects.find(p => p.projectId === projectId),

      getProjectsSorted: () =>
        [...get().projects].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    }),
    { name: 'ideaforge_v1_projects' }
  )
)
