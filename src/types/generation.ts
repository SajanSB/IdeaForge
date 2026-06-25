import type { DocType, DocStatus } from './document'

export interface GenerationState {
  status: 'idle' | 'running' | 'complete' | 'failed'
  currentAgent: 'ba' | 'ux' | 'pe' | null
  currentDocIndex: number
  docsComplete: number
  docStatuses: Record<DocType, DocStatus>
  activeTokenCount: number
  estimatedMinutesRemaining: number
  errorMessage: string | null
  failedAtDoc: DocType | null
}
