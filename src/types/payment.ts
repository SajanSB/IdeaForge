export type Gateway = 'razorpay' | 'stripe'

export type PaymentStatus = 'idle' | 'pending' | 'verifying' | 'paid' | 'failed' | 'refunded'

export interface PaymentRecord {
  paymentId:         string          // internal UUID
  projectId:         string
  gateway:           Gateway
  gatewayOrderId:    string          // Razorpay order_id or Stripe session_id
  gatewayPaymentId:  string          // Razorpay payment_id or Stripe payment_intent_id
  gatewaySignature:  string          // Razorpay HMAC signature
  amountInr:         number          // e.g. 193.52
  currency:          'INR' | 'USD'
  status:            PaymentStatus
  paidAt?:           string          // ISO datetime
  sessionToken?:     string          // returned by /api/verify-payment; used to unlock generation
}

// Razorpay JS types — extends Window
export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id:   string
  razorpay_signature:  string
}

export interface RazorpayOptions {
  key:         string
  amount:      number       // in paise (INR × 100)
  currency:    string
  name:        string
  description: string
  order_id:    string
  prefill: {
    name?:   string
    email?:  string
    contact?: string
  }
  theme: { color: string }
  handler:     (response: RazorpayResponse) => void
  modal: {
    ondismiss: () => void
    escape:    boolean
    animation: boolean
  }
}

export interface RazorpayInstance {
  open(): void
  on(event: string, handler: () => void): void
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}
