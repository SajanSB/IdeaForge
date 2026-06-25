import crypto from 'crypto'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27' as any,
})

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

interface VerifyPaymentBody {
  gateway?:            'razorpay' | 'stripe'
  // Razorpay fields
  razorpay_payment_id?: string
  razorpay_order_id?:   string
  razorpay_signature?:  string
  // Stripe fields
  stripe_session_id?:   string

  projectId:           string
  ideaSnippet:         string   // first 200 chars of idea
  amountInr:           number
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // ── 1. Verify Supabase JWT ─────────────────────────────────────────────
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401 })

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return new Response('Unauthorized', { status: 401 })

  // ── 2. Parse body ──────────────────────────────────────────────────────
  const body = await req.json() as VerifyPaymentBody
  const {
    gateway = 'razorpay',
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    stripe_session_id,
    projectId,
    ideaSnippet,
    amountInr,
  } = body

  if (!projectId) {
    return new Response('Missing project ID', { status: 400 })
  }

  let verified = false
  let gatewayOrderId = ''
  let gatewayPaymentId = ''
  let gatewaySignature = ''

  // ── 3. Verify Payment based on Gateway ─────────────────────────────────
  if (gateway === 'stripe') {
    if (!stripe_session_id) {
      return new Response('Missing Stripe Session ID', { status: 400 })
    }

    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(stripe_session_id)
      if (stripeSession.payment_status !== 'paid') {
        return new Response(
          JSON.stringify({ verified: false, error: 'Stripe payment was not completed.' }),
          { status: 402, headers: { 'Content-Type': 'application/json' } }
        )
      }

      if (stripeSession.metadata?.project_id !== projectId) {
        return new Response(
          JSON.stringify({ verified: false, error: 'Project ID mismatch for checkout session.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      verified = true
      gatewayOrderId = stripe_session_id
      // Use payment_intent ID if available, otherwise fallback to session ID
      gatewayPaymentId = (typeof stripeSession.payment_intent === 'string'
        ? stripeSession.payment_intent
        : stripeSession.id) || ''
    } catch (err) {
      console.error('Stripe verification failed:', err)
      return new Response(
        JSON.stringify({ verified: false, error: 'Stripe API checkout session lookup failed.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } else {
    // Razorpay flow
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new Response('Missing required payment fields', { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      console.error('Razorpay signature mismatch', {
        projectId,
        userId: user.id,
        orderId: razorpay_order_id,
      })
      return new Response(
        JSON.stringify({ verified: false, error: 'Payment signature is invalid' }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      )
    }

    verified = true
    gatewayOrderId = razorpay_order_id
    gatewayPaymentId = razorpay_payment_id
    gatewaySignature = razorpay_signature
  }

  if (!verified) {
    return new Response(
      JSON.stringify({ verified: false, error: 'Payment verification failed' }),
      { status: 402, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // ── 4. Write Payment record to Strapi ─────────────────────────────────
  try {
    if (process.env.STRAPI_URL && process.env.STRAPI_API_KEY) {
      await fetch(`${process.env.STRAPI_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            project_id:          projectId,
            user_id:             user.id,
            gateway:             gateway,
            gateway_order_id:    gatewayOrderId,
            gateway_payment_id:  gatewayPaymentId,
            gateway_signature:   gatewaySignature,
            amount_inr:          amountInr,
            currency:            gateway === 'razorpay' ? 'INR' : 'USD',
            status:              'paid',
            paid_at:             new Date().toISOString(),
          },
        }),
      })

      // ── 5. Write Project record to Strapi ──────────────────────────────
      await fetch(`${process.env.STRAPI_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            project_id:    projectId,
            user_id:       user.id,
            idea_snippet:  ideaSnippet.slice(0, 200),
            status:        'generating',
            created_at:    new Date().toISOString(),
          },
        }),
      })
    }
  } catch (strapiError) {
    // Strapi write failure should NOT block payment — log and continue
    // The payment is verified; we just couldn't write the audit record
    console.error('Strapi write failed after payment verification:', strapiError)
  }

  // ── 6. Generate a signed session token ────────────────────────────────
  // This token is passed with every /api/generate call to prove payment was made.
  // It's a simple HMAC of (projectId + userId + gatewayPaymentId) using RAZORPAY_KEY_SECRET as secret
  const sessionToken = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'fallback_secret')
    .update(`${projectId}:${user.id}:${gatewayPaymentId}`)
    .digest('hex')

  return new Response(
    JSON.stringify({
      verified:     true,
      sessionToken,
      orderId:      gatewayOrderId,
      paymentId:    gatewayPaymentId,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
