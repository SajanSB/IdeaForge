import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  onPaper?: boolean
}

export function PageHeader({ title, description, action, className, onPaper }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6', className)}>
      <div>
        <h1 className={cn('headline-md', onPaper ? 'text-paper-ink' : 'text-foreground')}>{title}</h1>
        {description && (
          <p className={cn('body-md mt-1', onPaper ? 'text-paper-ink-muted' : 'text-chrome-muted')}>{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="h-10 w-10 text-chrome-subtle mb-4" />}
      <h3 className="headline-sm text-foreground">{title}</h3>
      {description && <p className="body-md text-chrome-muted mt-2 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  sub,
  className,
}: {
  label: string
  value: string | number
  sub?: string
  className?: string
}) {
  return (
    <div className={cn('chrome-card p-5', className)}>
      <p className="label-mono text-chrome-subtle uppercase tracking-widest text-[10px]">{label}</p>
      <p className="text-2xl font-semibold text-foreground mt-2 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-chrome-muted mt-1">{sub}</p>}
    </div>
  )
}
