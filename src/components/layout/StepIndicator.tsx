import { IconCheck } from '@tabler/icons-react'
import { cn } from '@/utils/cn'

interface Step { label: string }
interface StepIndicatorProps {
  currentStep: number
  steps?: Step[]
}

const DEFAULT_STEPS: Step[] = [
  { label: 'Idea' }, { label: 'Q&A' }, { label: 'Review' }, { label: 'Cost' }, { label: 'Pay' },
]

export function StepIndicator({ currentStep, steps = DEFAULT_STEPS }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div role="list" aria-label="Progress steps" className="flex items-center">
        {steps.map((step, i) => {
          const stepNum = i + 1
          const isDone   = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isPending = stepNum > currentStep
          return (
            <div key={step.label} role="listitem" className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  aria-label={`Step ${stepNum} of ${steps.length}: ${step.label}. ${isDone ? 'Complete' : isActive ? 'Current' : 'Upcoming'}`}
                  aria-current={isActive ? 'step' : undefined}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-colors',
                    isDone   && 'bg-green-50 border-green-300 text-green-700',
                    isActive && 'bg-amber-tint border-amber-primary text-amber-primary',
                    isPending && 'bg-white border-border text-muted-foreground',
                  )}
                >
                  {isDone ? <IconCheck size={14} aria-hidden="true" /> : stepNum}
                </div>
                <span className={cn(
                  'text-[10px] mt-1.5 text-center w-8',
                  isDone   && 'text-green-700',
                  isActive && 'text-amber-primary',
                  isPending && 'text-muted-foreground',
                )}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'h-[0.5px] flex-1 mx-1 -mt-4',
                  isDone ? 'bg-green-300' : 'bg-border'
                )} aria-hidden="true" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
