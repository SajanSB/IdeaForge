import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useIdeaStore } from '@/stores/useIdeaStore'
import { useElicitationStore } from '@/stores/useElicitationStore'
import { fetchElicitationQuestions } from '@/services/claudeProxyService'
import { StepIndicator } from '@/components/layout/StepIndicator'
import { QuestionThread } from '@/components/funnel/QuestionThread'
import { AnswerInput } from '@/components/funnel/AnswerInput'
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react'

const TYPING_INDICATOR_DURATION = 1500 // ms — minimum time to show "typing"

export function ElicitationPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const {
    ideaText,
    industry,
    techPreference,
    projectId: storedProjectId,
  } = useIdeaStore()

  const {
    questions,
    answers,
    currentIndex,
    isComplete,
    questionsLoaded,
    setQuestions,
    saveAnswer,
    advance,
    reset: resetElicitation,
  } = useElicitationStore()

  const [answerText, setAnswerText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const resolvedProjectId = projectId ?? storedProjectId ?? ''

  // Set page title
  useEffect(() => {
    document.title = 'Elicitation Q&A — IdeaForge'
  }, [])

  // Guard — if no idea text, send back to start
  useEffect(() => {
    if (!ideaText || ideaText.trim().length < 50) {
      navigate('/idea/new', { replace: true })
    }
  }, [ideaText, navigate])

  const loadQuestions = useCallback(async () => {
    if (!ideaText || !resolvedProjectId) return
    setIsLoadingQuestions(true)
    setApiError(null)

    // Show typing indicator while loading
    setIsTyping(true)

    try {
      const result = await fetchElicitationQuestions({
        projectId: resolvedProjectId,
        ideaText,
        industry: industry ?? '',
        techPreference: techPreference ?? 'Any',
      })

      // Minimum typing indicator time for UX feel
      await new Promise(r => setTimeout(r, TYPING_INDICATOR_DURATION))

      setIsTyping(false)
      setQuestions(resolvedProjectId, result.questions)
    } catch (err) {
      console.error('Failed to load questions:', err)
      setIsTyping(false)
      setApiError("The BA agent couldn't generate questions. Please try again.")
    } finally {
      setIsLoadingQuestions(false)
    }
  }, [ideaText, resolvedProjectId, industry, techPreference, setQuestions])

  // Load questions on mount — either from store (if already loaded) or from API
  useEffect(() => {
    if (!resolvedProjectId || !ideaText) return

    // If this project already has questions loaded in the store, use them
    if (questionsLoaded && questions.length > 0) return

    loadQuestions()
  }, [resolvedProjectId, ideaText, questionsLoaded, questions.length, loadQuestions])

  // Navigate to review when elicitation is complete
  useEffect(() => {
    if (isComplete) {
      navigate(`/idea/${resolvedProjectId}/review`)
    }
  }, [isComplete, resolvedProjectId, navigate])

  const handleRetry = useCallback(async () => {
    setRetryCount(c => c + 1)
    resetElicitation()
    await loadQuestions()
  }, [resetElicitation, loadQuestions])

  const handleSubmitAnswer = useCallback(async () => {
    if (isSubmitting || answerText.trim().length === 0) return
    setIsSubmitting(true)

    // Save the answer
    saveAnswer(currentIndex, answerText.trim())
    setAnswerText('')

    // Show typing indicator before next question
    if (currentIndex < questions.length - 1) {
      setIsTyping(true)
      await new Promise(r => setTimeout(r, TYPING_INDICATOR_DURATION))
      setIsTyping(false)
    }

    // Move to next question (or complete)
    advance()
    setIsSubmitting(false)
  }, [isSubmitting, answerText, currentIndex, questions.length, saveAnswer, advance])

  const handleSkip = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    // Save null (skipped)
    saveAnswer(currentIndex, null)
    setAnswerText('')

    // Show typing indicator
    if (currentIndex < questions.length - 1) {
      setIsTyping(true)
      await new Promise(r => setTimeout(r, TYPING_INDICATOR_DURATION))
      setIsTyping(false)
    }

    advance()
    setIsSubmitting(false)
  }, [isSubmitting, currentIndex, questions.length, saveAnswer, advance])

  const isLastQuestion = currentIndex === questions.length - 1
  const totalQuestions = questions.length

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoadingQuestions && questions.length === 0) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-56px)]">
        <StepIndicator currentStep={2} />
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4">
          <div className="mb-6">
            <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans mb-1">
              Analysing your idea
            </h1>
            <p className="text-[13px] text-[#6B7280] font-sans">
              The BA agent is reading your idea and preparing tailored questions...
            </p>
          </div>
          {/* Typing indicator shown while questions load */}
          <div className="flex items-start gap-3 mt-4">
            <div className="w-7 h-7 rounded-full bg-[#FAEEDA] flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-[10px] font-mono font-medium text-[#BA7517]">BA</span>
            </div>
            <div className="bg-white border border-[0.5px] border-border rounded-xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#6B7280]"
                    style={{
                      animation: 'typingDot 1.2s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes typingDot {
                  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
                  30% { opacity: 1; transform: translateY(-3px); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (apiError && questions.length === 0) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-56px)]">
        <StepIndicator currentStep={2} />
        <div className="max-w-2xl mx-auto w-full px-4 mt-8">
          <div className="bg-white border border-[0.5px] border-border rounded-xl p-6 flex items-start gap-4">
            <IconAlertCircle
              size={20}
              className="text-red-500 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className="text-[14px] font-medium text-[#0F0F0F] mb-1 font-sans">
                Couldn't load questions
              </p>
              <p className="text-[13px] text-[#6B7280] mb-4 font-sans">
                {apiError}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-[13px] font-medium font-sans bg-[#BA7517] text-[#FFF8ED] hover:bg-[#A06010] transition-colors"
              >
                <IconRefresh size={14} aria-hidden="true" />
                Try again
              </button>
              {retryCount > 0 && (
                <p className="mt-3 text-[12px] text-[#6B7280] font-sans">
                  Using fallback questions on next retry.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main conversation UI ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">

      {/* Step indicator + progress */}
      <div className="max-w-2xl mx-auto w-full px-4">
        <div className="flex items-center justify-between mb-0">
          <div className="flex-1">
            <StepIndicator currentStep={2} />
          </div>
          {/* Question progress pill */}
          {totalQuestions > 0 && (
            <div className="mb-8 ml-4 flex-shrink-0">
              <span className="text-[11px] font-mono text-[#6B7280] bg-white border border-[0.5px] border-border px-2.5 py-1 rounded-full whitespace-nowrap">
                Question {Math.min(currentIndex + 1, totalQuestions)} of {totalQuestions}
              </span>
            </div>
          )}
        </div>

        {/* Page heading */}
        <div className="mb-4">
          <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans mb-1">
            A few clarifying questions
          </h1>
          <p className="text-[13px] text-[#6B7280] font-sans">
            Answer as much or as little as you like. You can skip any question.
          </p>
        </div>
      </div>

      {/* Conversation thread — scrollable flex area */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-2xl mx-auto w-full px-4">
        <QuestionThread
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          isTyping={isTyping}
        />
      </div>

      {/* Answer input — sticky at bottom */}
      <div className="max-w-2xl mx-auto w-full px-4 sticky bottom-0">
        {questions.length > 0 && !isTyping && (
          <AnswerInput
            value={answerText}
            onChange={setAnswerText}
            onSubmit={handleSubmitAnswer}
            onSkip={handleSkip}
            isLast={isLastQuestion}
            isLoading={isSubmitting}
            questionIndex={currentIndex}
          />
        )}
      </div>

    </div>
  )
}
