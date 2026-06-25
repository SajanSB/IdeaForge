import { IconCreditCard, IconWorld } from '@tabler/icons-react'
import { cn } from '@/utils/cn'
import type { Gateway } from '@/types/payment'

interface GatewaySelectorProps {
  selected: Gateway
  onChange: (gateway: Gateway) => void
}

const GATEWAYS: {
  id: Gateway
  label: string
  sub: string
  Icon: React.ComponentType<any>
}[] = [
  {
    id:    'razorpay',
    label: 'Razorpay',
    sub:   'India · UPI, cards, net banking',
    Icon:  IconCreditCard,
  },
  {
    id:    'stripe',
    label: 'Stripe',
    sub:   'International · USD, cards',
    Icon:  IconWorld,
  },
]

export function GatewaySelector({ selected, onChange }: GatewaySelectorProps) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans mb-2">
        Payment method
      </p>
      <div
        role="radiogroup"
        aria-label="Payment gateway"
        className="grid grid-cols-2 gap-2"
      >
        {GATEWAYS.map(({ id, label, sub, Icon }) => {
          const isSelected = selected === id
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(id)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border border-[0.5px]',
                'text-left transition-all duration-150',
                isSelected
                  ? 'border-[#BA7517] bg-[#FAEEDA]'
                  : 'border-border bg-white hover:bg-[#F7F5F0]',
              )}
            >
              {/* Radio dot */}
              <div className={cn(
                'w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center',
                isSelected
                  ? 'border-[#BA7517]'
                  : 'border-border',
              )}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#BA7517]" />
                )}
              </div>
              {/* Icon */}
              <Icon size={18} className={cn(
                'flex-shrink-0',
                isSelected ? 'text-[#BA7517]' : 'text-[#6B7280]'
              )} aria-hidden="true" />
              {/* Label */}
              <div className="flex-1 min-w-0">
                <div className={cn(
                  'text-[13px] font-medium font-sans truncate',
                  isSelected ? 'text-[#633806]' : 'text-[#0F0F0F]',
                )}>
                  {label}
                </div>
                <div className={cn(
                  'text-[11px] font-sans truncate mt-0.5',
                  isSelected ? 'text-[#854F0B]' : 'text-[#6B7280]',
                )}>
                  {sub}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
