import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PaymentRecord, PaymentStatus, Gateway } from '@/types/payment'
import { generateProjectId } from '@/utils/generateProjectId'

interface PaymentStore {
  current:       PaymentRecord | null
  history:       PaymentRecord[]
  status:        PaymentStatus
  errorMessage:  string | null

  initPayment:   (projectId: string, gateway: Gateway, amountInr: number) => PaymentRecord
  setOrderId:    (orderId: string) => void
  setPaid:       (paymentId: string, signature: string, sessionToken: string) => void
  setFailed:     (message: string) => void
  setVerifying:  () => void
  addToHistory:  (record: PaymentRecord) => void
  resetCurrent:  () => void
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      current:      null,
      history:      [],
      status:       'idle',
      errorMessage: null,

      initPayment: (projectId, gateway, amountInr) => {
        const record: PaymentRecord = {
          paymentId:        generateProjectId(),
          projectId,
          gateway,
          gatewayOrderId:   '',
          gatewayPaymentId: '',
          gatewaySignature: '',
          amountInr,
          currency:         gateway === 'razorpay' ? 'INR' : 'USD',
          status:           'pending',
        }
        set({ current: record, status: 'pending', errorMessage: null })
        return record
      },

      setOrderId: (orderId) =>
        set(s => ({
          current: s.current ? { ...s.current, gatewayOrderId: orderId } : null,
        })),

      setVerifying: () => set({ status: 'verifying' }),

      setPaid: (paymentId, signature, sessionToken) =>
        set(s => {
          const updated: PaymentRecord = {
            ...s.current!,
            gatewayPaymentId: paymentId,
            gatewaySignature: signature,
            sessionToken,
            status:           'paid',
            paidAt:           new Date().toISOString(),
          }
          return {
            current:  updated,
            history:  [updated, ...s.history],
            status:   'paid',
          }
        }),

      setFailed: (message) =>
        set(s => ({
          current:      s.current ? { ...s.current, status: 'failed' } : null,
          status:       'failed',
          errorMessage: message,
        })),

      addToHistory: (record) =>
        set(s => ({ history: [record, ...s.history] })),

      resetCurrent: () =>
        set({ current: null, status: 'idle', errorMessage: null }),
    }),
    {
      name: 'ideaforge_v1_payments',
      // History persists in localStorage; current payment is session-only
      partialize: (s) => ({ history: s.history }),
    }
  )
)
