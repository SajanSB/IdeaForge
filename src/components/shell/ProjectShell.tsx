import { useParams, useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { TopNav } from '@/components/layout/TopNav'
import { FlowStepper } from '@/components/flow/FlowStepper'
import type { FlowStepKey } from '@/lib/flowConstants'

function stepFromPath(pathname: string): FlowStepKey {
  if (pathname.includes('/elicitation')) return 'qa'
  if (pathname.includes('/review') && !pathname.includes('/review-docs')) return 'review'
  if (pathname.includes('/estimate')) return 'estimate'
  if (pathname.includes('/generating') || pathname.includes('/review-docs') || pathname.includes('/documents')) return 'generate'
  return 'idea'
}

function FlowStepperSection({
  currentStep,
  projectId,
}: {
  currentStep: FlowStepKey
  projectId?: string
}) {
  return (
    <div className="px-4 pt-5 sm:px-6 sm:pt-6">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 sm:px-5 sm:py-5">
        <FlowStepper currentStep={currentStep} projectId={projectId} variant="onboarding" />
      </div>
    </div>
  )
}

export function ProjectShell() {
  const { id } = useParams()
  const location = useLocation()

  const currentStep = stepFromPath(location.pathname)
  const isReadingLayout =
    location.pathname.includes('/review-docs') || location.pathname.includes('/documents')

  return (
    <div
      className={
        isReadingLayout
          ? 'relative flex h-dvh flex-col overflow-hidden forge-chrome text-foreground'
          : 'relative flex min-h-screen flex-col forge-chrome text-foreground'
      }
    >
      <TopNav />
      {!isReadingLayout && <FlowStepperSection currentStep={currentStep} projectId={id} />}
      <main
        className={
          isReadingLayout
            ? 'flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-3 sm:px-6 sm:pt-4'
            : 'flex flex-1 justify-center px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-5'
        }
      >
        <Outlet />
      </main>
    </div>
  )
}

export function ProjectShellNew() {
  return (
    <div className="relative flex min-h-screen flex-col forge-chrome text-foreground">
      <TopNav />
      <FlowStepperSection currentStep="idea" />
      <main className="flex flex-1 justify-center px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-5">
        <Outlet />
      </main>
    </div>
  )
}
