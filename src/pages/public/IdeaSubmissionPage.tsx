import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowRight, IconInfoCircle } from '@tabler/icons-react'
import { useIdeaStore } from '@/stores/useIdeaStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { StepIndicator } from '@/components/layout/StepIndicator'
import { IdeaTextarea } from '@/components/funnel/IdeaTextarea'
import { CharacterCount } from '@/components/funnel/CharacterCount'
import { HintExpander } from '@/components/funnel/HintExpander'
import { MetadataRow } from '@/components/funnel/MetadataRow'
import { cn } from '@/utils/cn'
import type { Industry, TechPreference } from '@/types/project'

const MIN_CHARS = 50
const MAX_CHARS = 2000

export function IdeaSubmissionPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  // Read existing state from the store (handles page refresh / back navigation)
  const {
    ideaText: savedText,
    industry: savedIndustry,
    techPreference: savedTech,
    setIdea,
    initProject,
    projectId: existingProjectId,
  } = useIdeaStore()

  // Local form state — initialised from store
  const [ideaText, setIdeaText] = useState(savedText)
  const [industry, setIndustry] = useState<Industry | ''>(savedIndustry)
  const [techPreference, setTechPreference] = useState<TechPreference>(savedTech)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Your idea — IdeaForge'
  }, [])

  const canSubmit = ideaText.trim().length >= MIN_CHARS
  const charCount = ideaText.length

  function handleTextChange(value: string) {
    setIdeaText(value)
  }

  function handleUseExample(exampleText: string) {
    setIdeaText(exampleText)
  }

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)

    try {
      // Save to Zustand store (sessionStorage-backed)
      setIdea(ideaText.trim(), industry, techPreference)

      // Generate a new project ID or reuse existing one
      const projectId = existingProjectId ?? initProject()

      // Small delay so the "Saving..." state is visible — feels intentional
      await new Promise(r => setTimeout(r, 300))

      navigate(`/idea/${projectId}/elicitation`)
    } catch (err) {
      console.error('Failed to save idea:', err)
      setIsSubmitting(false)
    }
  }, [canSubmit, isSubmitting, ideaText, industry, techPreference, existingProjectId, setIdea, initProject, navigate])

  // Allow submitting with Enter + Cmd/Ctrl on textarea
  function handleTextareaKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div onKeyDown={handleTextareaKeyDown}>

      {/* Step indicator */}
      <StepIndicator currentStep={1} />

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans mb-2">
          Describe your application idea
        </h1>
        <p className="text-[14px] text-[#6B7280] leading-relaxed font-sans">
          Tell us what you want to build. The more context you give, the better your documents will be.
          You don't need to structure this — just write naturally.
        </p>
      </div>

      {/* Textarea label (visually shown for screen readers and visual users) */}
      <label
        htmlFor="idea-text"
        className="block text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans mb-2"
      >
        Application idea
        <span className="ml-1 text-[#6B7280]/60 normal-case tracking-normal font-normal text-[11px]">
          · min {MIN_CHARS} characters
        </span>
      </label>

      {/* Main textarea */}
      <IdeaTextarea
        value={ideaText}
        onChange={handleTextChange}
        maxLength={MAX_CHARS}
        minLength={MIN_CHARS}
        autoFocus={true}
      />

      {/* Character count */}
      <CharacterCount
        current={charCount}
        max={MAX_CHARS}
        min={MIN_CHARS}
      />

      {/* Keyboard shortcut hint — desktop only */}
      <p className="text-[11px] text-[#6B7280]/70 text-right mt-1 font-sans hidden sm:block">
        ⌘ + Enter to continue
      </p>

      {/* Hint expander */}
      <HintExpander onUseExample={handleUseExample} />

      {/* Metadata dropdowns */}
      <MetadataRow
        industry={industry}
        techPreference={techPreference}
        onIndustryChange={setIndustry}
        onTechChange={setTechPreference}
      />

      {/* CTA */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          // Use aria-disabled instead of disabled so keyboard users can still focus it
          aria-disabled={!canSubmit || isSubmitting}
          aria-describedby={!canSubmit ? 'cta-disabled-reason' : undefined}
          className={cn(
            'inline-flex items-center gap-2 px-6 h-11 rounded-lg text-[14px] font-medium font-sans',
            'transition-all duration-150 active:scale-[0.98]',
            'w-full sm:w-auto justify-center sm:justify-start',
            canSubmit && !isSubmitting
              ? 'bg-[#BA7517] text-[#FFF8ED] hover:bg-[#A06010] cursor-pointer'
              : 'bg-[#BA7517]/40 text-[#FFF8ED]/70 cursor-not-allowed',
          )}
        >
          {isSubmitting ? (
            <>
              <span
                className="w-4 h-4 rounded-full border-2 border-[#FFF8ED]/60 border-t-[#FFF8ED] animate-spin"
                aria-hidden="true"
              />
              Saving...
            </>
          ) : (
            <>
              Start elicitation
              <IconArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>

        {/* Screen reader explanation when button is disabled */}
        {!canSubmit && (
          <p
            id="cta-disabled-reason"
            className="sr-only"
          >
            Please enter at least {MIN_CHARS} characters to continue.
            You have entered {charCount} characters so far.
          </p>
        )}

        {/* Visual helper text below button */}
        {!canSubmit && charCount > 0 && (
          <p className="mt-2 text-[12px] text-[#6B7280] font-sans">
            {MIN_CHARS - charCount} more character{(MIN_CHARS - charCount) === 1 ? '' : 's'} needed to continue
          </p>
        )}
      </div>

      {/* Guest notice — shown to unauthenticated users */}
      {!isAuthenticated && (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 flex items-start gap-2.5 px-4 py-3 bg-white border border-[0.5px] border-border rounded-xl"
        >
          <IconInfoCircle
            size={15}
            className="text-[#6B7280] flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-[12px] text-[#6B7280] leading-relaxed font-sans">
            Your progress is saved in this browser session — no account needed until you're ready to pay.
          </p>
        </div>
      )}

    </div>
  )
}
