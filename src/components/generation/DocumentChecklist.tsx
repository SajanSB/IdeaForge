import { ChecklistItem } from './ChecklistItem'
import { DOC_ORDER } from '@/types/document'
import type { DocProgress } from '@/stores/useGenerationStore'

interface DocumentChecklistProps {
  docProgress: Record<string, DocProgress>
}

export function DocumentChecklist({ docProgress }: DocumentChecklistProps) {
  return (
    <div
      role="list"
      aria-label="Documents generation checklist"
      className="bg-white border border-[0.5px] border-border rounded-xl divide-y divide-border overflow-hidden max-h-[360px] overflow-y-auto"
    >
      {DOC_ORDER.map(docType => {
        const progress = docProgress[docType] || { status: 'pending', tokenCount: 0 }
        return (
          <ChecklistItem
            key={docType}
            docType={docType}
            status={progress.status}
            tokenCount={progress.tokenCount}
          />
        )
      })}
    </div>
  )
}
