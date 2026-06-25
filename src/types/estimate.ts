export type ComplexityLevel = 'simple' | 'medium' | 'complex'

export interface TokenEstimate {
  projectId:            string
  complexityLevel:      ComplexityLevel
  moduleCount:          number
  model:                string
  rawInputTokens:       number
  rawOutputTokens:      number
  bufferedInputTokens:  number
  bufferedOutputTokens: number
  apiCostUsd:           number
  apiCostInr:           number
  platformFeeInr:       number
  gstInr:               number
  totalInr:             number
  usdInrRate:           number
  calculatedAt:         string
}
