import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { FLOW_STEPS, type FlowStepKey } from '@/lib/flowConstants'
import { cn } from '@/lib/utils'

type FlowStepperProps = {
  currentStep: FlowStepKey
  projectId?: string
  className?: string
  variant?: 'vertical' | 'horizontal' | 'onboarding'
}

function stepHref(step: (typeof FLOW_STEPS)[number], projectId?: string) {
  if (step.key === 'idea') return '/idea/new'
  if (!projectId) return '#'
  return `/idea/${projectId}/${step.path}`
}

function StepIndicator({
  done,
  active,
  step,
}: {
  done: boolean
  active: boolean
  step: number
}) {
  return (
    <span
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold sm:h-8 sm:w-8',
        done && 'bg-primary/20 text-primary',
        active && !done && 'bg-primary text-primary-foreground',
        !done && !active && 'bg-white/5 text-chrome-subtle',
      )}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : step}
    </span>
  )
}

export function FlowStepper({ currentStep, projectId, className, variant = 'vertical' }: FlowStepperProps) {
  const currentIdx = FLOW_STEPS.findIndex((s) => s.key === currentStep)
  const activeStep = FLOW_STEPS[currentIdx]

  if (variant === 'onboarding') {
    return (
      <nav className={cn(className)} aria-label="Project flow">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="section-label">Project workflow</p>
            <p className="mt-1.5 text-sm font-medium text-foreground sm:text-base">
              {activeStep?.label}
              <span className="hidden text-chrome-muted sm:inline"> — {activeStep?.description}</span>
            </p>
            <p className="mt-0.5 text-xs text-chrome-muted sm:hidden">{activeStep?.description}</p>
          </div>
          <p className="shrink-0 font-mono text-[11px] tabular-nums text-chrome-subtle">
            {currentIdx + 1}
            <span className="text-chrome-subtle/60"> / </span>
            {FLOW_STEPS.length}
          </p>
        </div>

        <div className="mt-4 flex gap-1 sm:gap-1.5">
          {FLOW_STEPS.map((step, i) => {
            const done = i < currentIdx
            const active = step.key === currentStep
            const href = stepHref(step, projectId)
            const canLink = done || active

            const segment = (
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div
                  className={cn(
                    'h-1 rounded-full transition-all duration-500',
                    done && 'bg-primary',
                    active && 'bg-primary shadow-[0_0_10px_rgba(196,137,42,0.45)]',
                    !done && !active && 'bg-white/10',
                  )}
                />
                <div className="hidden min-w-0 sm:block">
                  <p
                    className={cn(
                      'truncate text-[11px] font-medium leading-tight',
                      active ? 'text-foreground' : done ? 'text-chrome-muted' : 'text-chrome-subtle',
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            )

            return canLink && href !== '#' ? (
              <Link key={step.key} to={href} className="min-w-0 flex-1 focus-visible:outline-none">
                {segment}
              </Link>
            ) : (
              <div key={step.key} className="min-w-0 flex-1">
                {segment}
              </div>
            )
          })}
        </div>
      </nav>
    )
  }

  if (variant === 'horizontal') {
    return (
      <nav className={cn(className)} aria-label="Project flow">
        <ol className="flex w-full max-w-2xl mx-auto items-center">
          {FLOW_STEPS.map((step, i) => {
            const done = i < currentIdx
            const active = step.key === currentStep
            const href = stepHref(step, projectId)
            const canLink = done || active
            const isLast = i === FLOW_STEPS.length - 1

            const label = (
              <div className="flex min-w-0 flex-col items-center gap-1.5">
                <StepIndicator done={done} active={active} step={step.step} />
                <span
                  className={cn(
                    'hidden max-w-[4.5rem] truncate text-center text-[10px] font-medium sm:block sm:max-w-none sm:text-xs',
                    active ? 'text-foreground' : done ? 'text-chrome-muted' : 'text-chrome-subtle',
                  )}
                >
                  {step.label}
                </span>
              </div>
            )

            return (
              <li
                key={step.key}
                className="flex items-center"
              >
                {canLink && href !== '#' ? <Link to={href}>{label}</Link> : label}
                {!isLast && (
                  <div
                    className={cn(
                      'mx-1 h-px w-6 shrink-0 sm:mx-2 sm:w-10',
                      i < currentIdx ? 'bg-primary/30' : 'bg-white/10',
                    )}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  return (
    <nav className={cn('space-y-1', className)} aria-label="Project flow">
      <p className="label-mono text-chrome-subtle uppercase tracking-widest text-[10px] mb-3">Progress</p>
      {FLOW_STEPS.map((step, i) => {
        const done = i < currentIdx
        const active = step.key === currentStep
        const href = stepHref(step, projectId)
        const canLink = done || active

        const inner = (
          <div className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
            active && 'bg-primary/10 border border-primary/25',
            done && !active && 'opacity-70',
            !done && !active && 'opacity-40',
          )}>
            <span className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-mono font-semibold',
              done ? 'bg-primary/20 text-primary' : active ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-chrome-subtle',
            )}>
              {done ? <Check className="h-3 w-3" /> : step.step}
            </span>
            <span className={cn('text-sm font-medium', active ? 'text-foreground' : 'text-chrome-muted')}>
              {step.label}
            </span>
          </div>
        )

        if (canLink && href !== '#') {
          return <Link key={step.key} to={href}>{inner}</Link>
        }
        return <div key={step.key}>{inner}</div>
      })}
    </nav>
  )
}
