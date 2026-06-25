import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DocType } from '@/types/document'
import { DOC_ORDER } from '@/types/document'

interface DocumentStore {
  documents:      Record<DocType, string | null>
  projectId:      string | null

  setProjectId:   (id: string) => void
  setDocument:    (doc: DocType, content: string) => void
  getDocument:    (doc: DocType) => string | null
  hasAll:         () => boolean
  countComplete:  () => number
  clearAll:       () => void
}

function emptyDocs(): Record<DocType, null> {
  return Object.fromEntries(DOC_ORDER.map(d => [d, null])) as Record<DocType, null>
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents:  emptyDocs(),
      projectId:  null,

      setProjectId: (id)         => set({ projectId: id }),
      setDocument:  (doc, content) =>
        set(s => ({ documents: { ...s.documents, [doc]: content } })),
      getDocument: (doc)         => get().documents[doc],
      hasAll:      ()             => DOC_ORDER.every(d => get().documents[d] !== null),
      countComplete: ()           => DOC_ORDER.filter(d => get().documents[d] !== null).length,
      clearAll:    ()             => set({ documents: emptyDocs(), projectId: null }),
    }),
    { name: 'ideaforge_v1_documents' }
  )
)
