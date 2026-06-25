import { cn } from '@/utils/cn'

interface KPICardProps {
  label:       string
  value:       string | number
  sub?:        string
  delta?:      { value: number; positive: boolean }
  valueIsCode?: boolean   // true → IBM Plex Mono
  isLoading?:  boolean
}

export function KPICard({ label, value, sub, delta, valueIsCode, isLoading }: KPICardProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[0.5px] border-border rounded-xl p-5 animate-pulse">
        <div className="h-3 w-24 bg-[#F7F5F0] rounded mb-3" />
        <div className="h-8 w-20 bg-[#F7F5F0] rounded mb-2" />
        <div className="h-3 w-16 bg-[#F7F5F0] rounded" />
      </div>
    )
  }

  return (
    <article
      className="bg-white border border-[0.5px] border-border rounded-xl p-5"
      aria-label={`${label}: ${value}`}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans mb-2">
        {label}
      </p>
      <p className={cn(
        'font-medium text-[#0F0F0F] mb-1 tabular-nums',
        valueIsCode
          ? 'font-mono text-[22px]'
          : 'font-sans text-[28px] tracking-[-0.5px]'
      )}>
        {value}
      </p>
      {sub && (
        <p className="text-[11px] text-[#6B7280] font-sans">{sub}</p>
      )}
      {delta !== undefined && (
        <p
          className={cn(
            'text-[11px] font-medium mt-1',
            delta.positive ? 'text-[#3B6D11]' : 'text-red-600'
          )}
          aria-label={`${delta.positive ? 'Increase' : 'Decrease'} of ${Math.abs(delta.value)}% versus previous period`}
        >
          {delta.positive ? '↑' : '↓'} {Math.abs(delta.value)}% vs last period
        </p>
      )}
    </article>
  )
}
