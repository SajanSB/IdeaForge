import { IconCheck, IconX } from '@tabler/icons-react'
import { DocTag } from '@/components/brand/DocTag'
import { cn } from '@/utils/cn'
import type { DocType, DocStatus } from '@/types/document'
import { DOC_NAMES } from '@/types/document'

interface ChecklistItemProps {
  docType:    DocType
  status:     DocStatus
  tokenCount: number
}

export function ChecklistItem({ docType, status, tokenCount }: ChecklistItemProps) {
  const isDone    = status === 'complete'
  const isActive  = status === 'generating'
  const isFailed  = status === 'failed'
  const isPending = status === 'pending'

  return (
    <div
      role="listitem"
      aria-label={`${DOC_NAMES[docType]}: ${status}`}
      className={cn(
        'flex items-center gap-3 px-5 py-3.5',
        'transition-colors duration-200',
        isActive && 'bg-[#FAEEDA]/40',
      )}
    >
      {/* Status icon */}
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {isDone && (
          <div className="w-5 h-5 rounded-full bg-[#EAF3DE] border border-[0.5px] border-green-300 flex items-center justify-center">
            <IconCheck size={11} className="text-[#3B6D11]" aria-hidden="true" />
          </div>
        )}
        {isActive && (
          <div
            className="w-4 h-4 rounded-full border-2 border-[#BA7517] border-t-transparent animate-spin"
            aria-label={`Generating: ${DOC_NAMES[docType]}`}
            role="status"
          />
        )}
        {isFailed && (
          <div className="w-5 h-5 rounded-full bg-[#FCEBEB] border border-[0.5px] border-red-300 flex items-center justify-center">
            <IconX size={11} className="text-red-500" aria-hidden="true" />
          </div>
        )}
        {isPending && (
          <div className="w-4 h-4 rounded-full border border-border bg-white" />
        )}
      </div>

      {/* DocTag */}
      <div className="flex-shrink-0">
        <DocTag type={docType} size="sm" />
      </div>

      {/* Doc Name */}
      <span className={cn(
        'text-[13px] font-sans font-medium',
        isPending && 'text-[#6B7280]/60',
        isActive  && 'text-[#BA7517]',
        isDone    && 'text-[#0F0F0F]',
        isFailed  && 'text-red-800'
      )}>
        {DOC_NAMES[docType]}
      </span>

      {/* Live token stream indicator */}
      {isActive && tokenCount > 0 && (
        <span className="ml-auto font-mono text-[10px] text-[#BA7517] animate-pulse">
          {tokenCount.toLocaleString()} tokens streaming...
        </span>
      )}
    </div>
  )
}
