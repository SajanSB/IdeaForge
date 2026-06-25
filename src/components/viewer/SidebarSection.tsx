import { AgentPill } from '@/components/brand/AgentPill'
import { SidebarItem } from './SidebarItem'
import type { DocType, AgentType } from '@/types/document'

interface SidebarSectionProps {
  agent:      AgentType
  docs:       DocType[]
  documents:  Record<DocType, string | null>
  activeDoc:  DocType
  onSelect:   (docType: DocType) => void
  label:      string
}

export function SidebarSection({
  agent, docs, documents, activeDoc, onSelect, label
}: SidebarSectionProps) {
  return (
    <div role="group" aria-label={`${label} documents`} className="mb-2">
      {/* Agent header */}
      <div className="px-3 py-2 flex items-center gap-2">
        <AgentPill agent={agent} />
        <span className="text-[10px] text-[#6B7280] font-sans ml-1">
          {docs.length} doc{docs.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Doc items */}
      <div className="space-y-0.5 px-2">
        {docs.map(docType => (
          <SidebarItem
            key={docType}
            docType={docType}
            isActive={activeDoc === docType}
            hasContent={!!documents[docType]}
            onClick={() => onSelect(docType)}
          />
        ))}
      </div>
    </div>
  )
}
