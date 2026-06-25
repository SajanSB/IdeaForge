import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { IconArrowLeft, IconArrowRight, IconAlertCircle, IconClock } from '@tabler/icons-react'
import { useIdeaStore } from '@/stores/useIdeaStore'
import { useEstimateStore } from '@/stores/useEstimateStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { calcTokenEstimate, DEFAULT_PRICING_CONFIG } from '@/utils/estimateCalc'
import { StepIndicator } from '@/components/layout/StepIndicator'
import { CostBreakdownCard } from '@/components/funnel/CostBreakdownCard'
import { DocTagStrip } from '@/components/funnel/DocTagStrip'
import { GatewaySelector } from '@/components/funnel/GatewaySelector'
import { AuthGateModal } from '@/components/auth/AuthGateModal'
import type { Gateway } from '@/types/payment'

export function TokenEstimatePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const { ideaText, projectId: storedProjectId } = useIdeaStore()
  const { estimate, selectedGateway, setEstimate, setGateway } = useEstimateStore()
  const { isAuthenticated } = useAuthStore()

  const [isCalculating, setIsCalculating] = useState(false)
  const [calcError, setCalcError] = useState<string | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const resolvedProjectId = projectId ?? storedProjectId ?? ''

  useEffect(() => {
    document.title = 'Cost estimate — IdeaForge'
  }, [])

  // Guard — need idea text
  useEffect(() => {
    if (!ideaText || ideaText.trim().length < 50) {
      navigate('/idea/new', { replace: true })
    }
  }, [ideaText, navigate])

  const runCalculation = useCallback(() => {
    if (!ideaText || !resolvedProjectId) return

    setIsCalculating(true)
    setCalcError(null)

    try {
      // Simulate a brief loading state so the skeleton feels intentional
      // The actual calc is synchronous and instant
      const result = calcTokenEstimate(resolvedProjectId, ideaText, DEFAULT_PRICING_CONFIG)
      setEstimate(result)
    } catch (err) {
      console.error('Estimate calculation failed:', err)
      setCalcError('Unable to calculate cost. Please go back and try again.')
    } finally {
      // Small delay so skeleton doesn't flash for <50ms
      setTimeout(() => setIsCalculating(false), 300)
    }
  }, [ideaText, resolvedProjectId, setEstimate])

  // Calculate estimate on mount
  // If we already have an estimate for this project, skip recalculation
  useEffect(() => {
    if (!ideaText || !resolvedProjectId) return
    if (estimate?.projectId === resolvedProjectId) return  // already calculated

    runCalculation()
  }, [ideaText, resolvedProjectId, estimate?.projectId, runCalculation])

  const handleGatewayChange = useCallback((gateway: Gateway) => {
    setGateway(gateway)
  }, [setGateway])

  const handlePayClick = useCallback(() => {
    if (!estimate) return

    if (!isAuthenticated) {
      // Open auth gate modal — user must sign in before payment
      setAuthModalOpen(true)
    } else {
      // Already authenticated — go straight to payment
      navigate(`/idea/${resolvedProjectId}/payment`)
    }
  }, [estimate, isAuthenticated, resolvedProjectId, navigate])

  const handleAuthSuccess = useCallback(() => {
    setAuthModalOpen(false)
    // Brief delay so modal close animation completes
    setTimeout(() => {
      navigate(`/idea/${resolvedProjectId}/payment`)
    }, 200)
  }, [resolvedProjectId, navigate])

  // ── Loading state — skeleton ──────────────────────────────────────────────
  if (isCalculating) {
    return (
      <div>
        <StepIndicator currentStep={4} />
        <div className="mb-6">
          <div className="h-7 w-64 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="bg-white border border-[0.5px] border-border rounded-xl p-5 mb-4">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
            <div className="pt-3 border-t border-border flex justify-between">
              <div className="h-6 w-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-8 w-28 bg-[#FAEEDA] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (calcError) {
    return (
      <div>
        <StepIndicator currentStep={4} />
        <div className="bg-white border border-[0.5px] border-border rounded-xl p-6 flex items-start gap-4">
          <IconAlertCircle
            size={20}
            className="text-red-500 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-[14px] font-medium text-[#0F0F0F] mb-1 font-sans">
              Couldn't calculate cost
            </p>
            <p className="text-[13px] text-[#6B7280] mb-4 font-sans">
              {calcError}
            </p>
            <button
              type="button"
              onClick={runCalculation}
              className="px-4 h-9 rounded-lg text-[13px] font-medium font-sans bg-[#BA7517] text-[#FFF8ED] hover:bg-[#A06010] transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main screen ───────────────────────────────────────────────────────────
  if (!estimate) return null

  return (
    <div>
      {/* Step indicator */}
      <StepIndicator currentStep={4} />

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans mb-2">
          Your generation estimate
        </h1>
        <p className="text-[14px] text-[#6B7280] leading-relaxed font-sans">
          Review the cost breakdown before proceeding. You'll only be charged this amount — no hidden fees.
        </p>
      </div>

      {/* Cost breakdown card */}
      <div className="mb-4">
        <CostBreakdownCard estimate={estimate} />
      </div>

      {/* Gateway selector */}
      <div className="mb-4">
        <GatewaySelector
          selected={selectedGateway}
          onChange={handleGatewayChange}
        />
      </div>

      {/* What you'll receive */}
      <div className="mb-6">
        <DocTagStrip />
      </div>

      {/* Time estimate note */}
      <div className="flex items-center gap-2 mb-5">
        <IconClock size={14} className="text-[#6B7280] flex-shrink-0" aria-hidden="true" />
        <p className="text-[12px] text-[#6B7280] font-sans">
          Generation takes 10–15 minutes. You'll receive an email when your documents are ready.
        </p>
      </div>

      {/* CTA */}
      <div className="sticky bottom-0 bg-[#F7F5F0] pt-3 pb-4 sm:pb-0 sm:static sm:bg-transparent">
        <button
          type="button"
          onClick={handlePayClick}
          aria-label={`Pay ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(estimate.totalInr)} and generate documents`}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 h-12 rounded-xl text-[15px] font-medium font-sans bg-[#BA7517] text-[#FFF8ED] hover:bg-[#A06010] active:scale-[0.98] transition-all"
        >
          Pay {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(estimate.totalInr)} & generate
          <IconArrowRight size={16} aria-hidden="true" />
        </button>

        {/* Back link */}
        <Link
          to={`/idea/${resolvedProjectId}/review`}
          className="flex items-center gap-1.5 mt-3 text-[13px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors font-sans w-fit"
        >
          <IconArrowLeft size={14} aria-hidden="true" />
          Edit my answers
        </Link>
      </div>

      {/* Auth gate modal */}
      <AuthGateModal
        isOpen={authModalOpen}
        projectId={resolvedProjectId}
        returnUrl={`/idea/${resolvedProjectId}/payment`}
        onSuccess={handleAuthSuccess}
        onDismiss={() => setAuthModalOpen(false)}
      />
    </div>
  )
}
