import { IconBriefcase, IconLayoutDashboard, IconTerminal2 } from '@tabler/icons-react'
import { cn } from '@/utils/cn'
import type { AgentType } from '@/types/document'

const AGENT_CONFIG = {
  ba:  { label: 'BA agent',          Icon: IconBriefcase,      style: 'bg-ba-fill text-ba-text' },
  ux:  { label: 'UX agent',          Icon: IconLayoutDashboard, style: 'bg-ux-fill text-ux-text' },
  pe:  { label: 'Prompt engineer',   Icon: IconTerminal2,      style: 'bg-pe-fill text-pe-text' },
}

interface AgentPillProps {
  agent: AgentType
  className?: string
}

export function AgentPill({ agent, className }: AgentPillProps) {
  const { label, Icon, style } = AGENT_CONFIG[agent]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-[5px] rounded-full text-xs font-medium font-sans', style, className)}>
      <Icon size={13} aria-hidden="true" />
      {label}
    </span>
  )
}
