import { DocTag } from '@/components/brand/DocTag'
import { AgentPill } from '@/components/brand/AgentPill'
import type { DocType } from '@/types/document'

const DOC_GROUPS: { agent: 'ba' | 'ux' | 'pe'; docs: DocType[]; count: string }[] = [
  {
    agent: 'ba',
    count: '10 documents',
    docs: ['BRD', 'FRD', 'SRS', 'BMP', 'USR', 'PFD', 'UC', 'DMD', 'UAT', 'RTM'],
  },
  {
    agent: 'ux',
    count: '1 document',
    docs: ['UIUX'],
  },
  {
    agent: 'pe',
    count: '1 dev prompt',
    docs: ['DEVPROMPT'],
  },
]

// Friendly names for hover tooltips
const DOC_NAMES: Partial<Record<DocType, string>> = {
  BRD: 'Business Requirements Doc',
  FRD: 'Functional Requirements Doc',
  SRS: 'System Requirements Spec',
  BMP: 'Benefit Measurement Plan',
  USR: 'User Stories',
  PFD: 'Process Flow Diagrams',
  UC:  'Use Cases',
  DMD: 'Data Mapping Document',
  UAT: 'User Acceptance Testing',
  RTM: 'Requirements Traceability Matrix',
  UIUX: 'UI/UX Specification',
  DEVPROMPT: 'AI Dev Prompt (Cursor / Claude Code / v0)',
}

export function DocTagStrip() {
  return (
    <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0]">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
          What you'll receive — 13 documents
        </p>
      </div>

      {/* Agent groups */}
      <div className="divide-y divide-border">
        {DOC_GROUPS.map((group) => (
          <div key={group.agent} className="px-5 py-4">
            {/* Agent header */}
            <div className="flex items-center gap-2 mb-3">
              <AgentPill agent={group.agent} />
              <span className="text-[11px] text-[#6B7280] font-sans">
                {group.count}
              </span>
            </div>
            {/* Doc tags */}
            <div className="flex flex-wrap gap-1.5" role="list" aria-label={`${group.agent.toUpperCase()} agent documents`}>
              {group.docs.map((docType) => (
                <div
                  key={docType}
                  role="listitem"
                  title={DOC_NAMES[docType]}
                  className="group relative"
                >
                  <DocTag type={docType} size="md" />
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#0F0F0F] text-white text-[10px] font-sans rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {DOC_NAMES[docType]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Elicitation transcript note */}
      <div className="px-5 py-3 border-t border-[0.5px] border-border bg-[#F7F5F0]">
        <p className="text-[11px] text-[#6B7280] font-sans">
          + Your elicitation Q&A transcript is included as a bonus reference document.
        </p>
      </div>
    </div>
  )
}
