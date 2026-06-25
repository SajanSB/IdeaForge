import { supabase } from '@/services/supabaseClient'

interface CreateStripeSessionParams {
  projectId:   string
  ideaText:    string
  userEmail:   string
  successUrl:  string
  cancelUrl:   string
}

interface StripeSessionResult {
  checkoutUrl: string
  sessionId:   string
}

export async function createStripeCheckoutSession(
  params: CreateStripeSessionParams
): Promise<StripeSessionResult> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error('Not authenticated')

  const response = await fetch('/api/create-stripe-session', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Stripe session creation failed: ${response.status} — ${text}`)
  }

  return response.json() as Promise<StripeSessionResult>
}

// Redirect the browser to the Stripe Checkout hosted page
export function redirectToStripeCheckout(checkoutUrl: string): void {
  window.location.href = checkoutUrl
}
