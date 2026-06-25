import Razorpay from 'razorpay'
import { createClient } from '@supabase/supabase-js'
import { calcTokenEstimate, DEFAULT_PRICING_CONFIG } from '../src/utils/estimateCalc'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
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
    gateway:    'razorpay' | 'stripe'
  }

  if (!body.projectId || !body.ideaText || !body.gateway) {
    return new Response('Missing required fields', { status: 400 })
  }

  // ── 3. Server-side price calculation (do NOT trust client amount) ──────
  // The server independently calculates the price using the same formula
  // as the client. This prevents price manipulation.
  const estimate = calcTokenEstimate(body.projectId, body.ideaText, DEFAULT_PRICING_CONFIG)
  const amountInPaise = Math.round(estimate.totalInr * 100)  // Razorpay uses paise

  if (amountInPaise < 100) {
    return new Response('Amount too low', { status: 400 })
  }

  try {
    // ── 4. Create Razorpay order ─────────────────────────────────────────
    const order = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: 'INR',
      receipt:  `ideaforge_${body.projectId.slice(0, 8)}`,
      notes: {
        project_id: body.projectId,
        user_id:    user.id,
        user_email: user.email ?? '',
      },
    })

    return new Response(
      JSON.stringify({
        orderId:     order.id,
        amount:      order.amount,
        currency:    order.currency,
        amountInr:   estimate.totalInr,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Razorpay order creation failed:', err)
    return new Response('Order creation failed', { status: 500 })
  }
}
