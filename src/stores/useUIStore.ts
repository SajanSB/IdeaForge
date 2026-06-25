import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  // Notification preferences
  notifyOnComplete:  boolean
  notifyReceipt:     boolean
  notifyUpdates:     boolean

  // UI preferences
  sidebarCollapsed:  boolean

  // Actions
  setNotifyOnComplete: (v: boolean) => void
  setNotifyReceipt:    (v: boolean) => void
  setNotifyUpdates:    (v: boolean) => void
  toggleSidebar:       () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      notifyOnComplete: true,
      notifyReceipt:    true,
      notifyUpdates:    false,
      sidebarCollapsed: false,

      setNotifyOnComplete: (v) => set({ notifyOnComplete: v }),
      setNotifyReceipt:    (v) => set({ notifyReceipt: v }),
      setNotifyUpdates:    (v) => set({ notifyUpdates: v }),
      toggleSidebar:       ()  => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: 'ideaforge_v1_ui' }
  )
)
