import { type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const SECTION_PAD = 'section-pad'
export const SECTION_PAD_SM = 'section-pad-sm'

const ICON_SIZES = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5', xl: 'h-6 w-6' } as const
const BOX_SIZES = { sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-11 w-11', xl: 'h-14 w-14' } as const

export function GradientIcon({
  icon: Icon,
  className,
  size = 'md',
}: {
  icon: LucideIcon
  className?: string
  size?: keyof typeof ICON_SIZES
}) {
  return <Icon className={cn('icon-gradient shrink-0', ICON_SIZES[size], className)} />
}

export function GradientIconBox({
  icon: Icon,
  className,
  iconSize = 'md',
  boxSize = 'md',
}: {
  icon: LucideIcon
  className?: string
  iconSize?: keyof typeof ICON_SIZES
  boxSize?: keyof typeof BOX_SIZES
}) {
  return (
    <span className={cn('icon-box-gradient', BOX_SIZES[boxSize], className)}>
      <GradientIcon icon={Icon} size={iconSize} />
    </span>
  )
}

export function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const icon = { sm: 'h-7 w-7 text-xs', md: 'h-8 w-8 text-sm', lg: 'h-9 w-9 text-sm' }[size]
  const text = { sm: 'text-base', md: '', lg: 'text-lg' }[size]

  return (
    <span className={cn('inline-flex items-center gap-2.5 font-semibold tracking-tight text-foreground', text)}>
      <span
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-lg bg-primary font-mono text-primary-foreground',
          icon,
        )}
      >
        I
      </span>
      IdeaForge
    </span>
  )
}

export function BrandLogoLink({
  to = '/',
  size = 'md',
  className,
}: {
  to?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <Link to={to} className={cn('transition-opacity hover:opacity-90', className)}>
      <BrandLogo size={size} />
    </Link>
  )
}

export function PillBadge({
  children,
  icon: Icon,
  className,
  live = false,
}: {
  children: React.ReactNode
  icon?: LucideIcon
  className?: string
  live?: boolean
}) {
  return (
    <span className={cn('pill-badge', className)}>
      {live ? (
        <span className="ai-live-dot" aria-hidden />
      ) : (
        Icon && <GradientIcon icon={Icon} size="sm" />
      )}
      {children}
    </span>
  )
}

export function Callout({
  children,
  icon: Icon,
  tone = 'primary',
  className,
}: {
  children: React.ReactNode
  icon?: LucideIcon
  tone?: 'primary' | 'danger'
  className?: string
}) {
  return (
    <div
      className={cn(
        'callout',
        tone === 'primary' ? 'callout-primary' : 'callout-danger',
        className,
      )}
    >
      {Icon && tone === 'danger' ? (
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
      ) : (
        Icon && <GradientIcon icon={Icon} size="md" className="mt-0.5 shrink-0" />
      )}
      <span>{children}</span>
    </div>
  )
}

export function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-stat min-w-[88px] px-4 py-3 text-center lg:text-left">
      <p className="stat-gradient text-xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-chrome-muted">{label}</p>
    </div>
  )
}
