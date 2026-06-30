import { create } from 'zustand'

export type ReviewStatus = 'idle' | 'pending' | 'approved' | 'skipped'
export type ReviewPhase  = 'ba' | 'ba_complete' | 'ux_pe' | 'done'

interface ReviewStore {
  status:      ReviewStatus
  phase:       ReviewPhase
  feedback:    string
  approvedAt:  string | null

  setFeedback:    (text: string) => void
  approve:        (feedback: string) => void
  skip:           () => void
  markBAComplete: () => void
  markDone:       () => void
  reset:          () => void
}

export const useReviewStore = create<ReviewStore>((set) => ({
  status:     'idle',
  phase:      'ba',
  feedback:   '',
  approvedAt: null,

  setFeedback: (text) => set({ feedback: text }),

  approve: (feedback) =>
    set({ status: 'approved', feedback, approvedAt: new Date().toISOString(), phase: 'ux_pe' }),

  skip: () => set({ status: 'skipped', phase: 'ux_pe' }),

  markBAComplete: () => set({ phase: 'ba_complete', status: 'pending' }),

  markDone: () => set({ phase: 'done' }),

  reset: () => set({ status: 'idle', phase: 'ba', feedback: '', approvedAt: null }),
}))
