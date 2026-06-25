import { IconBriefcase, IconLayoutDashboard, IconTerminal2, IconCheck } from '@tabler/icons-react'
import { cn } from '@/utils/cn'
import type { AgentType } from '@/types/document'

interface AgentPipelineStripProps {
  currentAgent: AgentType | null
  docsComplete: number
}

const AGENTS: { id: AgentType; label: string; Icon: React.ComponentType<any>; docs: string }[] = [
  { id: 'ba', label: 'BA agent',         Icon: IconBriefcase,       docs: '10 documents' },
  { id: 'ux', label: 'UX agent',         Icon: IconLayoutDashboard, docs: '1 document'   },
  { id: 'pe', label: 'Prompt engineer',  Icon: IconTerminal2,       docs: '1 dev prompt' },
]

const AGENT_DONE_THRESHOLD: Record<AgentType, number> = {
  ba: 10, ux: 11, pe: 12,
}

export function AgentPipelineStrip({ currentAgent, docsComplete }: AgentPipelineStripProps) {
  function getAgentState(id: AgentType): 'done' | 'active' | 'pending' {
    if (docsComplete >= AGENT_DONE_THRESHOLD[id]) return 'done'
    if (currentAgent === id) return 'active'
    return 'pending'
  }

  return (
    <div
      role="list"
      aria-label="Generation pipeline"
      className="flex items-center justify-between gap-0 w-full max-w-sm mx-auto mb-6"
    >
      {AGENTS.map((agent, idx) => {
        const state = getAgentState(agent.id)
        const isLast = idx === AGENTS.length - 1
        return (
          <div key={agent.id} className="flex items-center flex-1">
            {/* Agent node */}
            <div
              role="listitem"
              aria-label={`${agent.label}: ${state}`}
              aria-current={state === 'active' ? 'true' : undefined}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <div className={cn(
                'w-11 h-11 rounded-full flex items-center justify-center transition-all',
                state === 'done'    && 'bg-[#EAF3DE] border border-[0.5px] border-green-300',
                state === 'active'  && 'bg-[#FAEEDA] border-2 border-[#BA7517] ring-4 ring-[#BA7517]/20 animate-pulse',
                state === 'pending' && 'bg-[#F7F5F0] border border-[0.5px] border-border',
              )}>
                {state === 'done' ? (
                  <IconCheck size={18} className="text-[#3B6D11]" aria-hidden="true" />
                ) : (
                  <agent.Icon
                    size={18}
                    className={cn(
                      state === 'active'  ? 'text-[#BA7517]' : 'text-[#6B7280]'
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="text-center">
                <p className={cn(
                  'text-[11px] font-medium font-sans whitespace-nowrap',
                  state === 'done'   ? 'text-[#3B6D11]' :
                  state === 'active' ? 'text-[#BA7517]' : 'text-[#6B7280]'
                )}>
                  {agent.label}
                </p>
                <p className="text-[10px] text-[#6B7280] font-sans">{agent.docs}</p>
              </div>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className={cn(
                'flex-1 h-[0.5px] mx-2 -mt-5',
                docsComplete >= AGENT_DONE_THRESHOLD[agent.id]
                  ? 'bg-green-300'
                  : 'bg-border'
              )} aria-hidden="true" />
            )}
          </div>
        )
      })}
    </div>
  )
}
