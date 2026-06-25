import { IconCheck, IconAlertCircle } from '@tabler/icons-react'
import { DocTag } from '@/components/brand/DocTag'
import { cn } from '@/utils/cn'
import { DOC_NAMES } from '@/types/document'
import type { DocType } from '@/types/document'

interface SidebarItemProps {
  docType:   DocType
  isActive:  boolean
  hasContent: boolean
  onClick:   () => void
}

export function SidebarItem({ docType, isActive, hasContent, onClick }: SidebarItemProps) {
  const isDevPrompt = docType === 'DEVPROMPT'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2.5 text-left',
        'transition-colors duration-100',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-[#BA7517]',
        isActive
          ? 'border-l-2 border-[#BA7517] bg-[#FAEEDA]/30 rounded-r-lg -ml-px pl-[11px]'
          : 'rounded-lg hover:bg-[#F7F5F0]',
      )}
    >
      {/* Status icon */}
      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
        {hasContent
          ? <IconCheck size={13} className="text-[#3B6D11]" aria-hidden="true" />
          : <IconAlertCircle size={13} className="text-[#6B7280]/50" aria-hidden="true" />
        }
      </span>

      {/* Doc name */}
      <span className={cn(
        'flex-1 min-w-0 text-[13px] font-sans truncate',
        isActive          ? 'text-[#0F0F0F] font-medium' :
        hasContent        ? 'text-[#0F0F0F]' : 'text-[#6B7280]/60',
        isDevPrompt       && 'font-medium',   // extra weight for Dev Prompt
      )}>
        {DOC_NAMES[docType]}
      </span>

      {/* Doc tag — always visible */}
      <DocTag
        type={docType}
        size="sm"
        className={cn(!hasContent && 'opacity-40')}
      />
    </button>
  )
}
