import { create } from 'zustand'
import {
  calcTokenEstimate,
  DEFAULT_PRICING_CONFIG,
  type DocEstimate,
  type PricingConfig,
  type ComplexityLevel,
  type TokenEstimate,
} from '@/utils/estimateCalc'

export type { DocEstimate, PricingConfig, ComplexityLevel, TokenEstimate }

interface EstimateStore extends TokenEstimate {
  config: PricingConfig
  updateConfig: (newConfig: Partial<PricingConfig>) => void
  calculate: (ideaText: string) => void
  calculateWithConfig: (ideaText: string, cfg: PricingConfig, complexityOverride?: ComplexityLevel) => void
  calculateForComplexity: (level: ComplexityLevel, overrideConfig?: Partial<PricingConfig>) => {
    apiCostInr: number; platformFeeInr: number; gstInr: number; totalInr: number
  }
}

export const DEFAULT_CONFIG: PricingConfig = DEFAULT_PRICING_CONFIG

const EMPTY: TokenEstimate = {
  complexityLevel: 'Medium',
  documents: [],
  totalInputTokens: 0,
  totalOutputTokens: 0,
  rawInputTokens: 0,
  rawOutputTokens: 0,
  bufferedInputTokens: 0,
  bufferedOutputTokens: 0,
  qaApiCostInr: 0,
  apiCostInr: 0,
  platformFeeInr: 0,
  gstInr: 0,
  totalInr: 0,
  usdInrRate: DEFAULT_PRICING_CONFIG.usdInrRate,
}

export const useEstimateStore = create<EstimateStore>((set, get) => ({
  ...EMPTY,
  config: DEFAULT_CONFIG,

  updateConfig: (newConfig) => {
    set((state) => ({ config: { ...state.config, ...newConfig } }))
  },

  calculate: (ideaText: string) => {
    const result = calcTokenEstimate('store', ideaText, get().config)
    set(result)
  },

  // Atomically updates config + estimate in one set() — no timing gap
  calculateWithConfig: (ideaText: string, cfg: PricingConfig, complexityOverride?: ComplexityLevel) => {
    const result = calcTokenEstimate('store', ideaText, cfg, complexityOverride)
    set({ ...result, config: cfg })
  },

  calculateForComplexity: (level, overrideConfig = {}) => {
    const config = { ...get().config, ...overrideConfig }
    const text = level === 'Simple' ? 'x'.repeat(100)
               : level === 'Medium'  ? 'x'.repeat(500)
               : 'x'.repeat(1000)
    const r = calcTokenEstimate('tmp', text, config)
    return { apiCostInr: r.apiCostInr, platformFeeInr: r.platformFeeInr, gstInr: r.gstInr, totalInr: r.totalInr }
  },
}))
