import { cn } from '@/utils/cn'
import type { DateRange } from '@/services/adminService'

interface DateRangeToggleProps {
  value:    DateRange
  onChange: (range: DateRange) => void
}

const OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'this_month', label: 'This month' },
  { value: 'last_30',    label: 'Last 30 days' },
  { value: 'all_time',   label: 'All time' },
]

export function DateRangeToggle({ value, onChange }: DateRangeToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Date range"
      className="flex items-center gap-1 bg-[#F7F5F0] p-1 rounded-lg border border-[0.5px] border-border w-fit"
    >
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 h-7 rounded-md text-[12px] font-sans transition-colors',
            value === opt.value
              ? 'bg-white text-[#0F0F0F] font-medium'
              : 'text-[#6B7280] hover:text-[#0F0F0F]'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
