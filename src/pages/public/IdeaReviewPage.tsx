import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  IconArrowLeft,
  IconArrowRight,
  IconEdit,
  IconCheck,
  IconMinus,
} from '@tabler/icons-react'
import { useIdeaStore } from '@/stores/useIdeaStore'
import { useElicitationStore } from '@/stores/useElicitationStore'
import { StepIndicator } from '@/components/layout/StepIndicator'
import { cn } from '@/utils/cn'

export function IdeaReviewPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const { ideaText, industry, techPreference, setStatus } = useIdeaStore()
  const { getTranscript } = useElicitationStore()

  useEffect(() => {
    document.title = 'Review your idea — IdeaForge'
  }, [])

  // Guard — no idea text means user landed here directly
  useEffect(() => {
    if (!ideaText || ideaText.trim().length < 50) {
      navigate('/idea/new', { replace: true })
    }
  }, [ideaText, navigate])

  function handleProceed() {
    setStatus('estimating')
    navigate(`/idea/${projectId}/estimate`)
  }

  function handleEditAnswers() {
    navigate(`/idea/${projectId}/elicitation`)
  }

  const transcript = getTranscript()
  const answeredCount = transcript.filter(p => p.answer !== null).length
  const skippedCount = transcript.filter(p => p.answer === null).length

  return (
    <div>
      <StepIndicator currentStep={3} />

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans mb-2">
          Review your idea
        </h1>
        <p className="text-[13px] text-[#6B7280] font-sans">
          Check everything looks right before we calculate your cost.
          {answeredCount > 0 && (
            <span className="ml-1">
              You answered {answeredCount} question{answeredCount !== 1 ? 's' : ''}
              {skippedCount > 0 && ` and skipped ${skippedCount}`}.
            </span>
          )}
        </p>
      </div>

      {/* Idea summary card */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0] flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
            Your idea
          </span>
          <Link
            to="/idea/new"
            className="inline-flex items-center gap-1 text-[12px] text-[#BA7517] hover:text-[#A06010] transition-colors font-sans"
            aria-label="Edit your idea text"
          >
            <IconEdit size={12} aria-hidden="true" />
            Edit idea
          </Link>
        </div>
        <div className="px-5 py-4">
          <p className="text-[14px] font-sans leading-relaxed text-[#0F0F0F] whitespace-pre-wrap">
            {ideaText}
          </p>
          {/* Metadata pills */}
          {(industry || techPreference !== 'Any') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[0.5px] border-border">
              {industry && (
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F7F5F0] border border-[0.5px] border-border text-[#6B7280] font-sans">
                  {industry}
                </span>
              )}
              {techPreference && techPreference !== 'Any' && (
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F7F5F0] border border-[0.5px] border-border text-[#6B7280] font-sans">
                  {techPreference}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Q&A transcript */}
      {transcript.length > 0 && (
        <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0] flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
              Your answers ({transcript.length} questions)
            </span>
            <button
              type="button"
              onClick={handleEditAnswers}
              className="inline-flex items-center gap-1 text-[12px] text-[#BA7517] hover:text-[#A06010] transition-colors font-sans"
              aria-label="Edit your Q&A answers"
            >
              <IconEdit size={12} aria-hidden="true" />
              Edit answers
            </button>
          </div>
          <div className="divide-y divide-border">
            {transcript.map((pair, i) => (
              <div key={i} className="px-5 py-4">
                {/* Question */}
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-[10px] font-mono font-medium text-[#BA7517] flex-shrink-0 mt-0.5 pt-[1px]">
                    Q{i + 1}
                  </span>
                  <p className="text-[13px] font-sans text-[#6B7280] leading-relaxed">
                    {pair.question}
                  </p>
                </div>
                {/* Answer */}
                <div className="flex items-start gap-2 ml-6">
                  <span className={cn(
                    'flex-shrink-0 mt-0.5',
                    pair.answer !== null ? 'text-[#639922]' : 'text-[#6B7280]'
                  )}>
                    {pair.answer !== null
                      ? <IconCheck size={14} aria-hidden="true" />
                      : <IconMinus size={14} aria-hidden="true" />
                    }
                  </span>
                  {pair.answer !== null ? (
                    <p className="text-[13px] font-sans text-[#0F0F0F] leading-relaxed whitespace-pre-wrap">
                      {pair.answer}
                    </p>
                  ) : (
                    <p className="text-[12px] font-mono italic text-[#6B7280]">
                      Skipped
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Primary CTA */}
        <button
          type="button"
          onClick={handleProceed}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-lg text-[14px] font-medium font-sans bg-[#BA7517] text-[#FFF8ED] hover:bg-[#A06010] active:scale-[0.98] transition-all w-full sm:w-auto justify-center"
        >
          Calculate cost & generate
          <IconArrowRight size={16} aria-hidden="true" />
        </button>

        {/* Back link */}
        <button
          type="button"
          onClick={handleEditAnswers}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors font-sans"
        >
          <IconArrowLeft size={14} aria-hidden="true" />
          Edit answers
        </button>
      </div>

      {/* Reassurance note */}
      <p className="mt-4 text-[12px] text-[#6B7280] font-sans">
        You'll see the exact cost before any payment is required.
      </p>

    </div>
  )
}
