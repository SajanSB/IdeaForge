import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { TokenEstimate } from '@/types/estimate'
import type { Gateway } from '@/types/payment'

interface EstimateStore {
  estimate:          TokenEstimate | null
  selectedGateway:   Gateway
  setEstimate:       (estimate: TokenEstimate) => void
  setGateway:        (gateway: Gateway) => void
  reset:             () => void
}

export const useEstimateStore = create<EstimateStore>()(
  persist(
    (set) => ({
      estimate:        null,
      selectedGateway: 'razorpay',

      setEstimate: (estimate) => set({ estimate }),
      setGateway:  (gateway)  => set({ selectedGateway: gateway }),
      reset:       ()         => set({ estimate: null, selectedGateway: 'razorpay' }),
    }),
    {
      name:    'ideaforge_v1_estimate',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
