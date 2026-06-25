import { create } from 'zustand'
import type { DocType, DocStatus, AgentType } from '@/types/document'
import { DOC_ORDER, DOC_AGENT } from '@/types/document'

export type GenerationStatus = 'idle' | 'running' | 'complete' | 'failed'

// Per-document runtime state
export interface DocProgress {
  status:        DocStatus
  tokenCount:    number        // live token count shown on active item
  startedAt?:    string
  completedAt?:  string
  errorMessage?: string
}

interface GenerationStore {
  // Pipeline status
  status:                  GenerationStatus
  currentAgent:            AgentType | null
  currentDocIndex:         number           // 0-based index into DOC_ORDER (0–12)
  docsComplete:            number           // count of completed docs
  estimatedMinutesLeft:    number
  failedAtDoc:             DocType | null
  errorMessage:            string | null
  startedAt:               string | null
  completedAt:             string | null

  // Per-document progress map
  docProgress:             Record<DocType, DocProgress>

  // Actions
  startGeneration:         () => void
  setDocStatus:            (doc: DocType, status: DocStatus) => void
  setDocTokenCount:        (doc: DocType, count: number) => void
  markDocComplete:         (doc: DocType) => void
  markComplete:            () => void
  markFailed:              (doc: DocType, message: string) => void
  updateEstimatedTime:     (minutesLeft: number) => void
  reset:                   () => void
}

// Build the initial progress map — all docs pending
function buildInitialProgress(): Record<DocType, DocProgress> {
  return Object.fromEntries(
    DOC_ORDER.map(d => [d, { status: 'pending' as DocStatus, tokenCount: 0 }])
  ) as Record<DocType, DocProgress>
}

export const useGenerationStore = create<GenerationStore>()((set, get) => ({
  status:               'idle',
  currentAgent:         null,
  currentDocIndex:      0,
  docsComplete:         0,
  estimatedMinutesLeft: 13,
  failedAtDoc:          null,
  errorMessage:         null,
  startedAt:            null,
  completedAt:          null,
  docProgress:          buildInitialProgress(),

  startGeneration: () => set({
    status:               'running',
    currentAgent:         'ba',
    currentDocIndex:      0,
    docsComplete:         0,
    estimatedMinutesLeft: 13,
    failedAtDoc:          null,
    errorMessage:         null,
    startedAt:            new Date().toISOString(),
    completedAt:          null,
    docProgress:          buildInitialProgress(),
  }),

  setDocStatus: (doc, status) =>
    set(s => ({
      docProgress: {
        ...s.docProgress,
        [doc]: {
          ...s.docProgress[doc],
          status,
          startedAt: status === 'generating' ? new Date().toISOString() : s.docProgress[doc].startedAt,
        },
      },
    })),

  setDocTokenCount: (doc, count) =>
    set(s => ({
      docProgress: {
        ...s.docProgress,
        [doc]: { ...s.docProgress[doc], tokenCount: count },
      },
    })),

  markDocComplete: (doc) => {
    const nextIndex = get().currentDocIndex + 1
    const nextDoc   = DOC_ORDER[nextIndex] as DocType | undefined
    const nextAgent: AgentType | null = nextDoc ? DOC_AGENT[nextDoc] : null
    const newComplete = get().docsComplete + 1

    // Estimate: ~0.9 min average per remaining document
    const remaining = DOC_ORDER.length - newComplete
    const estimated = Math.max(0, Math.round(remaining * 0.9))

    set(s => ({
      docsComplete:         newComplete,
      currentDocIndex:      nextIndex,
      currentAgent:         nextAgent,
      estimatedMinutesLeft: estimated,
      docProgress: {
        ...s.docProgress,
        [doc]: {
          ...s.docProgress[doc],
          status:      'complete',
          completedAt: new Date().toISOString(),
        },
      },
    }))
  },

  markComplete: () => set({
    status:               'complete',
    currentAgent:         null,
    estimatedMinutesLeft: 0,
    completedAt:          new Date().toISOString(),
  }),

  markFailed: (doc, message) =>
    set(s => ({
      status:       'failed',
      failedAtDoc:  doc,
      errorMessage: message,
      currentAgent: null,
      docProgress: {
        ...s.docProgress,
        [doc]: {
          ...s.docProgress[doc],
          status:       'failed',
          errorMessage: message,
        },
      },
    })),

  updateEstimatedTime: (minutesLeft) => set({ estimatedMinutesLeft: minutesLeft }),

  reset: () => set({
    status:               'idle',
    currentAgent:         null,
    currentDocIndex:      0,
    docsComplete:         0,
    estimatedMinutesLeft: 13,
    failedAtDoc:          null,
    errorMessage:         null,
    startedAt:            null,
    completedAt:          null,
    docProgress:          buildInitialProgress(),
  }),
}))
