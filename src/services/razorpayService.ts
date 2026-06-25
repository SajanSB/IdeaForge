import type { RazorpayOptions, RazorpayResponse } from '@/types/payment'
import { supabase } from '@/services/supabaseClient'

// ── Load Razorpay.js script ───────────────────────────────────────────────

let razorpayLoadPromise: Promise<boolean> | null = null

export function loadRazorpayScript(): Promise<boolean> {
  if (razorpayLoadPromise) return razorpayLoadPromise

  razorpayLoadPromise = new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src     = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async   = true
    script.onload  = () => resolve(true)
    script.onerror = () => {
      razorpayLoadPromise = null   // allow retry on next call
      resolve(false)
    }
    document.head.appendChild(script)
  })

  return razorpayLoadPromise
}

// ── Create Razorpay order via proxy ──────────────────────────────────────

interface CreateOrderParams {
  projectId:  string
  ideaText:   string
}

interface CreateOrderResult {
  orderId:    string
  amount:     number       // paise
  currency:   string
  amountInr:  number       // rupees
}

export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<CreateOrderResult> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error('Not authenticated')

  const response = await fetch('/api/create-order', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      projectId:  params.projectId,
      ideaText:   params.ideaText,
      gateway:    'razorpay',
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Order creation failed: ${response.status} — ${text}`)
  }

  return response.json() as Promise<CreateOrderResult>
}

// ── Open Razorpay checkout modal ──────────────────────────────────────────

interface OpenCheckoutParams {
  orderId:    string
  amountInr:  number
  userEmail:  string
  projectId:  string
  onSuccess:  (response: RazorpayResponse) => void
  onDismiss:  () => void
}

export async function openRazorpayCheckout(params: OpenCheckoutParams): Promise<void> {
  const loaded = await loadRazorpayScript()
  if (!loaded) throw new Error('Failed to load Razorpay checkout script')

  if (!window.Razorpay) throw new Error('Razorpay not available')

  const options: RazorpayOptions = {
    key:         (import.meta.env.VITE_RAZORPAY_KEY_ID || '') as string,
    amount:      Math.round(params.amountInr * 100),   // convert to paise
    currency:    'INR',
    name:        'IdeaForge',
    description: `SDLC documentation suite — ${params.projectId.slice(0, 8)}`,
    order_id:    params.orderId,
    prefill: {
      email: params.userEmail,
    },
    theme: {
      color: '#BA7517',    // amber primary
    },
    handler: params.onSuccess,
    modal: {
      ondismiss: params.onDismiss,
      escape:    true,
      animation: true,
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}

// ── Verify payment via proxy ──────────────────────────────────────────────

interface VerifyPaymentParams {
  paymentId:   string
  orderId:     string
  signature:   string
  projectId:   string
  ideaSnippet: string
  amountInr:   number
}

interface VerifyPaymentResult {
  verified:     boolean
  sessionToken: string
  error?:       string
}

export async function verifyRazorpayPayment(
  params: VerifyPaymentParams
): Promise<VerifyPaymentResult> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error('Not authenticated')

  const response = await fetch('/api/verify-payment', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      razorpay_payment_id: params.paymentId,
      razorpay_order_id:   params.orderId,
      razorpay_signature:  params.signature,
      projectId:           params.projectId,
      ideaSnippet:         params.ideaSnippet,
      amountInr:           params.amountInr,
    }),
  })

  if (response.status === 402) {
    return { verified: false, sessionToken: '', error: 'Payment signature could not be verified.' }
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Verification failed: ${response.status} — ${text}`)
  }

  return response.json() as Promise<VerifyPaymentResult>
}
