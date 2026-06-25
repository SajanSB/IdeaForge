import { useLocalStorageUsage } from '@/hooks/useLocalStorageUsage'
import { cn } from '@/utils/cn'
import { IconAlertCircle, IconDatabase } from '@tabler/icons-react'

export function StorageUsageBar() {
  const { usage } = useLocalStorageUsage()

  const barColor = usage.isCritical
    ? 'bg-red-500'
    : usage.isWarning
    ? 'bg-amber-500'
    : 'bg-[#BA7517]'

  const textColor = usage.isCritical
    ? 'text-red-600'
    : usage.isWarning
    ? 'text-amber-600'
    : 'text-[#6B7280]'

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconDatabase
            size={14}
            className="text-[#6B7280]"
            aria-hidden="true"
          />
          <span className="text-[13px] font-medium text-[#0F0F0F] font-sans">
            Browser storage
          </span>
        </div>
        <span className={cn('text-[12px] font-mono font-medium', textColor)}>
          {usage.usedMB} MB / ~5 MB
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 bg-[#F7F5F0] rounded-full overflow-hidden border border-[0.5px] border-border"
        role="meter"
        aria-valuenow={usage.percentUsed}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Browser storage: ${usage.percentUsed}% used`}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${usage.percentUsed}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-[11px] font-sans">
        <span className="text-[#6B7280]">
          {usage.usedKB} KB used · {usage.keyCount} keys · {usage.ideaforgeKeys.length} IdeaForge
        </span>
        <span className={cn('font-medium', textColor)}>
          {usage.percentUsed}% used
        </span>
      </div>

      {/* Warning message */}
      {(usage.isWarning || usage.isCritical) && (
        <div className={cn(
          'flex items-start gap-2 px-3 py-2.5 rounded-lg border border-[0.5px] text-[12px] font-sans',
          usage.isCritical
            ? 'bg-[#FCEBEB] border-red-200 text-red-700'
            : 'bg-[#FAEEDA] border-[#EF9F27] text-[#633806]'
        )}>
          <IconAlertCircle size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span className="leading-relaxed">
            {usage.isCritical
              ? 'Storage is almost full. Clear old project documents below to free space.'
              : 'Storage is getting full. Consider clearing older project documents.'
            }
          </span>
        </div>
      )}
    </div>
  )
}
