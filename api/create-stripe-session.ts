import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { calcTokenEstimate, DEFAULT_PRICING_CONFIG } from '../src/utils/estimateCalc'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27' as any,
})

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // ── 1. Verify Supabase JWT ─────────────────────────────────────────────
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401 })

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return new Response('Unauthorized', { status: 401 })

  // ── 2. Parse and validate request ──────────────────────────────────────
  const body = await req.json() as {
    projectId:  string
    ideaText:   string
    userEmail:  string
    successUrl: string
    cancelUrl:  string
  }

  if (!body.projectId || !body.ideaText || !body.userEmail || !body.successUrl || !body.cancelUrl) {
    return new Response('Missing required fields', { status: 400 })
  }

  // ── 3. Server-side price calculation ───────────────────────────────────
  const estimate = calcTokenEstimate(body.projectId, body.ideaText, DEFAULT_PRICING_CONFIG)
  const totalUsd = estimate.totalInr / estimate.usdInrRate
  const amountInCents = Math.round(totalUsd * 100)

  if (amountInCents < 50) {
    return new Response('Amount too low', { status: 400 })
  }

  try {
    // ── 4. Create Stripe Checkout Session ─────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'IdeaForge SDLC Documentation Suite',
              description: `Project: ${body.projectId.slice(0, 8)}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${body.successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancelUrl,
      customer_email: body.userEmail,
      metadata: {
        project_id: body.projectId,
        user_id:    user.id,
      },
    })

    return new Response(
      JSON.stringify({
        checkoutUrl: session.url,
        sessionId:   session.id,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Stripe session creation failed:', err)
    return new Response('Stripe session creation failed', { status: 500 })
  }
}
