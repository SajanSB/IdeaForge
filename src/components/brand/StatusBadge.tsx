import { cn } from '@/utils/cn'

export type BadgeStatus = 'complete' | 'generating' | 'failed' | 'draft' | 'paid' | 'pending'

const STATUS_CONFIG: Record<BadgeStatus, { label: string; dotClass: string; containerClass: string }> = {
  complete:   { label: 'Complete',   dotClass: 'bg-green-600',  containerClass: 'bg-green-50 text-green-900 border-green-200' },
  generating: { label: 'Generating', dotClass: 'bg-blue-500 animate-status-pulse', containerClass: 'bg-blue-50 text-blue-900 border-blue-200' },
  failed:     { label: 'Failed',     dotClass: 'bg-red-500',    containerClass: 'bg-red-50 text-red-900 border-red-200' },
  draft:      { label: 'Draft',      dotClass: 'bg-gray-400',   containerClass: 'bg-gray-100 text-gray-600 border-gray-200' },
  paid:       { label: 'Paid',       dotClass: 'bg-green-600',  containerClass: 'bg-green-50 text-green-900 border-green-200' },
  pending:    { label: 'Pending',    dotClass: 'bg-gray-400',   containerClass: 'bg-gray-100 text-gray-500 border-gray-200' },
}

interface StatusBadgeProps {
  status: BadgeStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, dotClass, containerClass } = STATUS_CONFIG[status]
  return (
    <span
      aria-label={`Status: ${label}`}
      className={cn('inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11px] font-medium border', containerClass, className)}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotClass)} aria-hidden="true" />
      {label}
    </span>
  )
}
