import { formatINR } from '@/utils/estimateCalc'
import type { StrapiPayment } from '@/services/adminService'

interface GenerationTableProps {
  payments: StrapiPayment[]
  isLoading?: boolean
  onRowClick: (payment: StrapiPayment) => void
}

export function GenerationTable({ payments, isLoading, onRowClick }: GenerationTableProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex gap-4 px-5 py-3 animate-pulse">
            <div className="flex-1 h-4 bg-[#F7F5F0] rounded" />
            <div className="w-20 h-4 bg-[#F7F5F0] rounded" />
            <div className="w-16 h-4 bg-[#F7F5F0] rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="py-16 text-center text-[13px] text-[#6B7280] font-sans">
        No generations in this period.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] font-sans" aria-label="Recent generations">
        <thead className="bg-[#F7F5F0]">
          <tr>
            {['Project ID', 'User', 'Amount', 'Status', 'Date'].map(col => (
              <th
                key={col}
                scope="col"
                className="text-left px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] border-b border-[0.5px] border-border whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {payments.map(payment => (
            <tr
              key={payment.gateway_order_id}
              className="hover:bg-[#F7F5F0] cursor-pointer"
              onClick={() => onRowClick(payment)}
              aria-label={`View dispute for project ${payment.project_id}`}
            >
              <td className="px-4 py-3">
                <span className="font-mono text-[11px] text-[#BA7517]">
                  PRJ-{payment.project_id.slice(0, 8).toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-[#6B7280] text-[12px] max-w-[140px] truncate">
                {payment.user_id.slice(0, 12)}...
              </td>
              <td className="px-4 py-3 font-mono font-medium text-[#0F0F0F]">
                {formatINR(payment.amount_inr)}
              </td>
              <td className="px-4 py-3">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  payment.status === 'paid' ? 'bg-[#EAF3DE] text-[#27500A]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {payment.status}
                </span>
              </td>
              <td className="px-4 py-3 text-[#6B7280] text-[12px] whitespace-nowrap">
                {payment.paid_at
                  ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(payment.paid_at))
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
