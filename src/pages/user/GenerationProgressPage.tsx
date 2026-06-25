import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconActivity } from '@tabler/icons-react'
import { AgentPipelineStrip } from '@/components/generation/AgentPipelineStrip'
import { DocumentChecklist } from '@/components/generation/DocumentChecklist'
import { GenerationProgressBar } from '@/components/generation/GenerationProgressBar'
import { GenerationErrorCard } from '@/components/generation/GenerationErrorCard'
import { useGenerationOrchestrator } from '@/hooks/useGenerationOrchestrator'
import { useGenerationStore } from '@/stores/useGenerationStore'
import { useIdeaStore } from '@/stores/useIdeaStore'
import { useAuthStore } from '@/stores/useAuthStore'

export function GenerationProgressPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const { ideaText } = useIdeaStore()
  const { user } = useAuthStore()
  
  const {
    status,
    currentAgent,
    docsComplete,
    docProgress,
    estimatedMinutesLeft,
    errorMessage,
    failedAtDoc,
  } = useGenerationStore()

  const { runGeneration } = useGenerationOrchestrator()

  const resolvedProjectId = projectId || ''

  useEffect(() => {
    document.title = 'Generating Documents — IdeaForge'
  }, [])

  // Guards
  useEffect(() => {
    if (!ideaText) {
      navigate('/idea/new', { replace: true })
    }
  }, [ideaText, navigate])

  useEffect(() => {
    if (!user) {
      navigate(`/login?returnUrl=/idea/${resolvedProjectId}/generating`, { replace: true })
    }
  }, [user, resolvedProjectId, navigate])

  // Run the generation runner hook on mount
  useEffect(() => {
    if (ideaText && user && resolvedProjectId) {
      runGeneration()
    }
  }, [ideaText, user, resolvedProjectId, runGeneration])

  // Navigate to documents list on complete
  useEffect(() => {
    if (status === 'complete') {
      const timer = setTimeout(() => {
        navigate(`/idea/${resolvedProjectId}/documents`)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [status, resolvedProjectId, navigate])

  if (!ideaText || !user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10 bg-[#F7F5F0]">
      
      {/* Header */}
      <div className="space-y-1.5 text-center mb-8 select-none">
        <h1 className="text-[22px] font-medium tracking-[-0.3px] text-[#0F0F0F] flex items-center justify-center gap-2 font-sans">
          <IconActivity className="w-5 h-5 text-[#BA7517]" />
          <span>Generating your documents</span>
        </h1>
        <p className="text-[11px] text-[#6B7280] font-mono">
          PROJECT ID: {resolvedProjectId.slice(0, 18)}... · Scoping suite generation running
        </p>
      </div>

      {/* Agent Strip */}
      <AgentPipelineStrip
        currentAgent={currentAgent}
        docsComplete={docsComplete}
      />

      {/* Error Card */}
      {status === 'failed' && (
        <GenerationErrorCard
          message={errorMessage || 'An error occurred during document compilation.'}
          failedAtDoc={failedAtDoc}
          onRetry={runGeneration}
        />
      )}

      {/* Checklist */}
      <div className="mb-6">
        <DocumentChecklist docProgress={docProgress} />
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <GenerationProgressBar
          docsComplete={docsComplete}
          totalDocs={13}
        />
        <div className="flex justify-between text-[11px] text-[#6B7280] font-sans mt-1.5 px-0.5">
          <span>Estimated wait: {estimatedMinutesLeft} {estimatedMinutesLeft === 1 ? 'minute' : 'minutes'} remaining</span>
          <span>claude-3-5-sonnet-20241022</span>
        </div>
      </div>

      {/* Email notification alert */}
      <p className="text-[12px] text-[#6B7280] text-center font-sans">
        We'll email you a summary copy upon final compilation. Feel free to leave this page open.
      </p>

    </div>
  )
}
