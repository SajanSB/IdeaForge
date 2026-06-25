import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconCreditCard, IconReceipt, IconCopy, IconArrowRight } from '@tabler/icons-react'
import { usePaymentStore }   from '@/stores/usePaymentStore'
import { SettingsSubNav }    from '@/components/dashboard/SettingsSubNav'
import { ReceiptModal }      from '@/components/settings/ReceiptModal'
import { StorageUsageBar }   from '@/components/settings/StorageUsageBar'
import { MonoId }            from '@/components/brand/MonoId'
import { useClipboard }      from '@/hooks/useClipboard'
import { formatINR }         from '@/utils/estimateCalc'
import type { PaymentRecord } from '@/types/payment'

export function PaymentHistoryPage() {
  const navigate          = useNavigate()
  const { history }       = usePaymentStore()
  const { copy }          = useClipboard()

  const [receiptPayment, setReceiptPayment] = useState<PaymentRecord | null>(null)

  useEffect(() => {
    document.title = 'Payment history — IdeaForge'
  }, [])

  function handleCopyOrderId(orderId: string) {
    copy(orderId, 'Order ID copied')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans mb-1">
        Settings
      </h1>
      <p className="text-[13px] text-[#6B7280] font-sans mb-5">
        Manage your account and preferences.
      </p>

      <SettingsSubNav />

      {/* ── Payment history section ───────────────────────────────────────── */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[15px] font-medium text-[#0F0F0F] font-sans">
              Payment history
            </h2>
            <p className="text-[12px] text-[#6B7280] font-sans mt-0.5">
              All payments made on this device.
            </p>
          </div>
          {history.length > 0 && (
            <span className="text-[11px] font-mono text-[#BA7517]">
              {history.length} payment{history.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {history.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-14 text-center bg-white border border-[0.5px] border-border rounded-xl">
            <div className="w-12 h-12 rounded-full bg-[#F7F5F0] flex items-center justify-center mb-4">
              <IconCreditCard size={20} className="text-[#6B7280]" aria-hidden="true" />
            </div>
            <p className="text-[14px] font-medium text-[#0F0F0F] font-sans mb-1">
              No payments yet
            </p>
            <p className="text-[13px] text-[#6B7280] font-sans mb-4 max-w-xs leading-relaxed">
              Your payment history will appear here after your first generation.
            </p>
            <button
              type="button"
              onClick={() => navigate('/idea/new')}
              className="text-[13px] text-[#BA7517] hover:text-[#A06010] font-medium font-sans transition-colors"
            >
              Start your first generation →
            </button>
          </div>
        ) : (
          // Payment list
          <div className="space-y-3">
            {history.map(payment => {
              const dateStr = payment.paidAt
                ? new Intl.DateTimeFormat('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  }).format(new Date(payment.paidAt))
                : '—'

              return (
                <div
                  key={payment.paymentId}
                  className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EAF3DE] text-[#27500A] border border-[0.5px] border-green-200">
                        ✓ Paid
                      </span>
                      <span className="text-[11px] text-[#6B7280] font-sans">{dateStr}</span>
                      <span className="text-[11px] capitalize text-[#6B7280] font-sans">· {payment.gateway}</span>
                    </div>
                    <span className="text-[18px] font-medium text-[#BA7517] font-sans tabular-nums">
                      {formatINR(payment.amountInr)}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="px-4 py-3 space-y-2">
                    {/* Order ID row */}
                    {payment.gatewayOrderId && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] text-[#6B7280] font-sans flex-shrink-0">
                          Order ID
                        </span>
                        <div className="flex items-center gap-2 min-w-0">
                          <MonoId className="text-[10px] truncate">
                            {payment.gatewayOrderId}
                          </MonoId>
                          <button
                            type="button"
                            onClick={() => handleCopyOrderId(payment.gatewayOrderId)}
                            aria-label="Copy order ID"
                            className="flex-shrink-0 text-[#6B7280] hover:text-[#BA7517] transition-colors"
                          >
                            <IconCopy size={12} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Project link */}
                    {payment.projectId && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] text-[#6B7280] font-sans">Project</span>
                        <button
                          type="button"
                          onClick={() => navigate(`/idea/${payment.projectId}/documents`)}
                          className="flex items-center gap-1 text-[12px] text-[#BA7517] hover:text-[#A06010] transition-colors font-sans"
                        >
                          PRJ-{payment.projectId.slice(0, 8).toUpperCase()}
                          <IconArrowRight size={11} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="flex items-center justify-end px-4 py-2.5 border-t border-[0.5px] border-border">
                    <button
                      type="button"
                      onClick={() => setReceiptPayment(payment)}
                      className="flex items-center gap-1.5 text-[12px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors font-sans"
                    >
                      <IconReceipt size={13} aria-hidden="true" />
                      View receipt
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Storage usage section ─────────────────────────────────────────── */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0]">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
            Browser storage
          </p>
        </div>
        <div className="px-5 py-5">
          <StorageUsageBar />
          <p className="text-[11px] text-[#6B7280] font-sans mt-3 leading-relaxed">
            Generated documents are stored in your browser. If you clear browser data,
            documents may be lost. Use Export ZIP in the document viewer to save permanent copies.
          </p>
        </div>
      </div>

      {/* Receipt modal */}
      <ReceiptModal
        payment={receiptPayment}
        isOpen={!!receiptPayment}
        onClose={() => setReceiptPayment(null)}
      />
    </div>
  )
}
