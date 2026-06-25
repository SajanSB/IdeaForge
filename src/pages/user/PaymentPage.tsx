import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  IconLock, IconShield, IconAlertCircle, IconCheck,
  IconArrowLeft, IconCreditCard, IconWorld,
} from '@tabler/icons-react'
import { toast } from 'sonner'
import { useIdeaStore } from '@/stores/useIdeaStore'
import { useEstimateStore } from '@/stores/useEstimateStore'
import { usePaymentStore } from '@/stores/usePaymentStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { createRazorpayOrder, openRazorpayCheckout, verifyRazorpayPayment } from '@/services/razorpayService'
import { createStripeCheckoutSession, redirectToStripeCheckout } from '@/services/stripeService'
import { formatINR } from '@/utils/estimateCalc'
import { cn } from '@/utils/cn'
import { supabase } from '@/services/supabaseClient'
import type { RazorpayResponse } from '@/types/payment'

type PaymentStep =
  | 'idle'           // default — showing summary
  | 'creating_order' // calling /api/create-order or stripe session
  | 'checkout_open'  // Razorpay modal is open
  | 'verifying'      // calling /api/verify-payment
  | 'paid'           // verification success
  | 'failed'         // payment or verification failed

export function PaymentPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const { ideaText, projectId: storedProjectId } = useIdeaStore()
  const { estimate, selectedGateway } = useEstimateStore()
  const { user } = useAuthStore()
  const { initPayment, setOrderId, setPaid, setFailed } = usePaymentStore()
  const { addProject } = useProjectStore()

  const [step, setStep] = useState<PaymentStep>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const resolvedProjectId = projectId ?? storedProjectId ?? ''

  useEffect(() => {
    document.title = 'Payment — IdeaForge'
  }, [])

  // Guard — must have estimate and idea text
  useEffect(() => {
    if (!estimate || !ideaText) {
      navigate(`/idea/${resolvedProjectId}/estimate`, { replace: true })
    }
  }, [estimate, ideaText, resolvedProjectId, navigate])

  // Guard — must be authenticated
  useEffect(() => {
    if (!user) {
      navigate(`/login?returnUrl=/idea/${resolvedProjectId}/payment`, { replace: true })
    }
  }, [user, resolvedProjectId, navigate])

  // ── Stripe payment verification handler ────────────────────────────────

  const handleStripeVerification = useCallback(async (sessionId: string) => {
    if (!estimate || !user || !ideaText) return

    setStep('verifying')
    setErrorMessage(null)

    try {
      // Initialize payment record
      initPayment(resolvedProjectId, 'stripe', estimate.totalInr)
      setOrderId(sessionId)

      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('Not authenticated')

      // Verify signature/status server-side
      const response = await fetch('/api/verify-payment', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          gateway: 'stripe',
          stripe_session_id: sessionId,
          projectId: resolvedProjectId,
          ideaSnippet: ideaText.slice(0, 200),
          amountInr: estimate.totalInr,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Verification failed: ${response.status} — ${text}`)
      }

      const verifyResult = await response.json() as {
        verified: boolean
        sessionToken: string
        paymentId: string
        error?: string
      }

      if (!verifyResult.verified) {
        setStep('failed')
        setFailed(verifyResult.error ?? 'Stripe payment verification failed.')
        setErrorMessage(verifyResult.error ?? 'Payment could not be verified. Please contact support.')
        return
      }

      // Update payment store with verified state
      setPaid(
        verifyResult.paymentId,
        '', // Stripe doesn't use Razorpay HMAC signature in the same way
        verifyResult.sessionToken
      )

      // Add project to local history
      addProject({
        projectId:       resolvedProjectId,
        userId:          user.id,
        ideaText,
        industry:        (useIdeaStore.getState().industry as any) ?? '',
        techPreference:  useIdeaStore.getState().techPreference,
        status:          'generating',
        docsComplete:    0,
        createdAt:       new Date().toISOString(),
        updatedAt:       new Date().toISOString(),
      })

      setStep('paid')
      toast.success('Payment confirmed! Starting your document generation...')

      // Navigate to generation after brief success moment
      setTimeout(() => {
        navigate(`/idea/${resolvedProjectId}/generating`)
      }, 1200)

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Verification request failed'
      setStep('failed')
      setFailed(msg)
      setErrorMessage(`Payment verification error: ${msg}. Please contact support@ideaforge.ai with your checkout session ID: ${sessionId}`)
    }
  }, [estimate, user, ideaText, resolvedProjectId, initPayment, setOrderId, setPaid, setFailed, addProject, navigate])

  // ── Handle Stripe return from success/cancel ──────────────────────────

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stripeSuccess = params.get('stripe_success') === '1'
    const sessionId = params.get('session_id')
    const stripeCancelled = params.get('stripe_cancelled') === '1'

    if (stripeSuccess && sessionId) {
      handleStripeVerification(sessionId)
    } else if (stripeCancelled) {
      toast.info('Payment cancelled.')
      // Clear URL params
      navigate(`/idea/${resolvedProjectId}/payment`, { replace: true })
    }
  }, [handleStripeVerification, resolvedProjectId, navigate])

  // ── Razorpay payment flow ─────────────────────────────────────────────

  const handleRazorpayPayment = useCallback(async () => {
    if (!estimate || !user || !ideaText) return

    setStep('creating_order')
    setErrorMessage(null)

    try {
      // 1. Create order server-side (gets order_id from Razorpay)
      const orderResult = await createRazorpayOrder({
        projectId: resolvedProjectId,
        ideaText,
      })

      // 2. Init payment record in store
      initPayment(resolvedProjectId, 'razorpay', orderResult.amountInr)
      setOrderId(orderResult.orderId)

      setStep('checkout_open')

      // 3. Open Razorpay checkout modal
      await openRazorpayCheckout({
        orderId:   orderResult.orderId,
        amountInr: orderResult.amountInr,
        userEmail: user.email ?? '',
        projectId: resolvedProjectId,

        onSuccess: async (response: RazorpayResponse) => {
          setStep('verifying')

          try {
            // 4. Verify signature server-side
            const verifyResult = await verifyRazorpayPayment({
              paymentId:   response.razorpay_payment_id,
              orderId:     response.razorpay_order_id,
              signature:   response.razorpay_signature,
              projectId:   resolvedProjectId,
              ideaSnippet: ideaText.slice(0, 200),
              amountInr:   orderResult.amountInr,
            })

            if (!verifyResult.verified) {
              setStep('failed')
              setFailed(verifyResult.error ?? 'Payment verification failed.')
              setErrorMessage(verifyResult.error ?? 'Payment could not be verified. Please contact support.')
              return
            }

            // 5. Update payment store with verified state
            setPaid(
              response.razorpay_payment_id,
              response.razorpay_signature,
              verifyResult.sessionToken
            )

            // 6. Add project to local history
            addProject({
              projectId:       resolvedProjectId,
              userId:          user.id,
              ideaText,
              industry:        (useIdeaStore.getState().industry as any) ?? '',
              techPreference:  useIdeaStore.getState().techPreference,
              status:          'generating',
              docsComplete:    0,
              createdAt:       new Date().toISOString(),
              updatedAt:       new Date().toISOString(),
            })

            setStep('paid')
            toast.success('Payment confirmed! Starting your document generation...')

            // 7. Navigate to generation after brief success moment
            setTimeout(() => {
              navigate(`/idea/${resolvedProjectId}/generating`)
            }, 1200)

          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Verification request failed'
            setStep('failed')
            setFailed(msg)
            setErrorMessage(`Payment verification error: ${msg}. Please contact support@ideaforge.ai with your payment ID: ${response.razorpay_payment_id}`)
          }
        },

        onDismiss: () => {
          // User closed the Razorpay modal without paying
          setStep('idle')
          toast.info('Payment cancelled. Your estimate is still saved.')
        },
      })

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not start payment'
      setStep('failed')
      setErrorMessage(msg)
      toast.error('Could not start payment. Please try again.')
    }
  }, [estimate, user, ideaText, resolvedProjectId, initPayment, setOrderId, setPaid, setFailed, addProject, navigate])

  // ── Stripe payment flow ───────────────────────────────────────────────

  const handleStripePayment = useCallback(async () => {
    if (!estimate || !user || !ideaText) return

    setStep('creating_order')
    setErrorMessage(null)

    try {
      const result = await createStripeCheckoutSession({
        projectId:  resolvedProjectId,
        ideaText,
        userEmail:  user.email ?? '',
        successUrl: `${window.location.origin}/idea/${resolvedProjectId}/payment?stripe_success=1`,
        cancelUrl:  `${window.location.origin}/idea/${resolvedProjectId}/payment?stripe_cancelled=1`,
      })

      redirectToStripeCheckout(result.checkoutUrl)
      // Browser navigates away — no further code executes
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not start payment'
      setStep('failed')
      setErrorMessage(msg)
      toast.error('Could not start Stripe checkout. Please try again.')
    }
  }, [estimate, user, ideaText, resolvedProjectId])

  // ── Handle Pay button click (Bypassed for testing) ───────────────────

  const handleBypassPayment = useCallback(() => {
    if (!estimate || !user || !ideaText) return

    setStep('verifying')

    // Simulate verification delay to show UI progress transitions
    setTimeout(() => {
      initPayment(resolvedProjectId, selectedGateway, estimate.totalInr)
      setPaid('bypass_payment_id', 'bypass_signature', 'bypass_token')

      addProject({
        projectId:       resolvedProjectId,
        userId:          user.id,
        ideaText,
        industry:        (useIdeaStore.getState().industry as any) ?? '',
        techPreference:  useIdeaStore.getState().techPreference,
        status:          'generating',
        docsComplete:    0,
        createdAt:       new Date().toISOString(),
        updatedAt:       new Date().toISOString(),
      })

      setStep('paid')
      toast.success('Bypass enabled: Payment mock confirmed! Starting generation...')

      setTimeout(() => {
        navigate(`/idea/${resolvedProjectId}/generating`)
      }, 1200)
    }, 1000)
  }, [estimate, user, ideaText, resolvedProjectId, selectedGateway, initPayment, setPaid, addProject, navigate])

  function handlePayClick() {
    // Keep references to prevent unused compiler warnings during bypass testing
    if (false as boolean) {
      console.log(handleRazorpayPayment, handleStripePayment)
    }
    handleBypassPayment()
  }

  if (!estimate || !user) return null

  // ── Paid / success state ──────────────────────────────────────────────
  if (step === 'paid') {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 bg-[#F7F5F0]">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-[#EAF3DE] flex items-center justify-center mx-auto mb-5 border border-[0.5px] border-green-200">
            <IconCheck size={28} className="text-[#3B6D11]" aria-hidden="true" />
          </div>
          <h1 className="text-[22px] font-medium text-[#0F0F0F] mb-2 font-sans">
            Payment confirmed
          </h1>
          <p className="text-[14px] text-[#6B7280] font-sans">
            Starting your document generation...
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-[#BA7517] border-t-transparent animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  const isProcessing = step === 'creating_order' || step === 'checkout_open' || step === 'verifying'

  // ── Main payment UI ───────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10 bg-[#F7F5F0]">

      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate(`/idea/${resolvedProjectId}/estimate`)}
        disabled={isProcessing}
        className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors font-sans mb-6 disabled:opacity-40"
      >
        <IconArrowLeft size={14} aria-hidden="true" />
        Back to estimate
      </button>

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans mb-1">
          Complete your payment
        </h1>
        <p className="text-[14px] text-[#6B7280] font-sans">
          Your documents will start generating immediately after payment.
        </p>
      </div>

      {/* Order summary card */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0]">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
            Order summary
          </p>
        </div>
        <div className="px-5 py-5">
          {/* Project idea snippet */}
          <p className="text-[13px] text-[#0F0F0F] font-sans leading-relaxed mb-4 pb-4 border-b border-[0.5px] border-border line-clamp-2">
            {ideaText?.slice(0, 120)}{(ideaText?.length ?? 0) > 120 ? '...' : ''}
          </p>

          {/* Cost lines */}
          <div className="space-y-2.5 mb-4">
            <div className="flex justify-between text-[14px] font-sans">
              <span className="text-[#6B7280]">Anthropic API cost</span>
              <span className="text-[#0F0F0F] font-medium tabular-nums">{formatINR(estimate.apiCostInr)}</span>
            </div>
            <div className="flex justify-between text-[14px] font-sans">
              <span className="text-[#6B7280]">Platform fee</span>
              <span className="text-[#0F0F0F] font-medium tabular-nums">{formatINR(estimate.platformFeeInr)}</span>
            </div>
            <div className="flex justify-between text-[14px] font-sans">
              <span className="text-[#6B7280]">GST (18%)</span>
              <span className="text-[#0F0F0F] font-medium tabular-nums">{formatINR(estimate.gstInr)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-[0.5px] border-border">
            <span className="text-[15px] font-medium text-[#0F0F0F] font-sans">Total due</span>
            <span className="text-[32px] font-medium text-[#BA7517] font-sans tracking-[-0.5px] tabular-nums">
              {formatINR(estimate.totalInr)}
            </span>
          </div>

          {/* What's included */}
          <div className="mt-4 pt-4 border-t border-[0.5px] border-border">
            <p className="text-[12px] text-[#6B7280] font-sans">
              Includes 13 SDLC documents: BRD, FRD, SRS, BMP, User Stories, Process Flows, Use Cases, Data Mapping, UAT, RTM, UI/UX Spec, AI Dev Prompt, and Elicitation transcript.
            </p>
          </div>
        </div>
      </div>

      {/* Selected gateway display */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl px-5 py-4 mb-4 flex items-center gap-3">
        {selectedGateway === 'razorpay'
          ? <IconCreditCard size={18} className="text-[#BA7517]" aria-hidden="true" />
          : <IconWorld size={18} className="text-[#BA7517]" aria-hidden="true" />
        }
        <div>
          <p className="text-[13px] font-medium text-[#0F0F0F] font-sans">
            {selectedGateway === 'razorpay' ? 'Razorpay' : 'Stripe'}
          </p>
          <p className="text-[11px] text-[#6B7280] font-sans">
            {selectedGateway === 'razorpay'
              ? 'UPI · cards · net banking · wallets'
              : 'International · credit/debit cards'
            }
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/idea/${resolvedProjectId}/estimate`)}
          disabled={isProcessing}
          className="ml-auto text-[12px] text-[#BA7517] hover:text-[#A06010] transition-colors font-sans disabled:opacity-40"
        >
          Change
        </button>
      </div>

      {/* Error state */}
      {step === 'failed' && errorMessage && (
        <div className="bg-[#FCEBEB] border border-[0.5px] border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
          <IconAlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-[13px] font-medium text-red-800 mb-1 font-sans">Payment failed</p>
            <p className="text-[12px] text-red-700 font-sans leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Processing state indicator */}
      {isProcessing && (
        <div className="bg-[#E6F1FB] border border-[0.5px] border-blue-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin flex-shrink-0" aria-hidden="true" />
          <p className="text-[13px] text-blue-800 font-sans">
            {step === 'creating_order' && 'Preparing your order...'}
            {step === 'checkout_open' && 'Complete payment in the checkout window...'}
            {step === 'verifying' && 'Verifying your payment...'}
          </p>
        </div>
      )}

      {/* Pay CTA */}
      <button
        type="button"
        onClick={handlePayClick}
        disabled={isProcessing}
        aria-busy={isProcessing}
        aria-label={`Pay ${formatINR(estimate.totalInr)} and generate 13 SDLC documents`}
        className={cn(
          'w-full h-12 rounded-xl text-[15px] font-medium font-sans',
          'flex items-center justify-center gap-2',
          'transition-all duration-150',
          isProcessing
            ? 'bg-[#BA7517]/40 text-[#FFF8ED]/70 cursor-not-allowed'
            : 'bg-[#BA7517] text-[#FFF8ED] hover:bg-[#A06010] active:scale-[0.98]'
        )}
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-[#FFF8ED]/50 border-t-[#FFF8ED] animate-spin" aria-hidden="true" />
            <span>
              {step === 'creating_order' && 'Preparing...'}
              {step === 'checkout_open' && 'Checkout open...'}
              {step === 'verifying' && 'Verifying...'}
            </span>
          </>
        ) : (
          <>
            <IconLock size={16} aria-hidden="true" />
            <span>Pay {formatINR(estimate.totalInr)}</span>
          </>
        )}
      </button>

      {/* Retry after failure */}
      {step === 'failed' && (
        <button
          type="button"
          onClick={() => { setStep('idle'); setErrorMessage(null) }}
          className="w-full mt-2 h-10 rounded-xl text-[13px] font-medium font-sans border border-[0.5px] border-border bg-white text-[#0F0F0F] hover:bg-[#F7F5F0] transition-colors"
        >
          Try again
        </button>
      )}

      {/* Security badges */}
      <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <IconLock size={13} className="text-[#6B7280]" aria-hidden="true" />
          <span className="text-[11px] text-[#6B7280] font-sans">Secure checkout</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconShield size={13} className="text-[#6B7280]" aria-hidden="true" />
          <span className="text-[11px] text-[#6B7280] font-sans">Payment verified server-side</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconCreditCard size={13} className="text-[#6B7280]" aria-hidden="true" />
          <span className="text-[11px] text-[#6B7280] font-sans">Card details never stored</span>
        </div>
      </div>

      {/* Refund policy note */}
      <p className="text-[11px] text-[#6B7280] text-center mt-4 font-sans leading-relaxed">
        Generation begins immediately after payment. If generation fails, a full refund is initiated within 2 business days.
      </p>

    </div>
  )
}
