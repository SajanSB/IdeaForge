import type { TokenEstimate, ComplexityLevel } from '@/types/estimate'

// ── Complexity detection ──────────────────────────────────────────────────────

/**
 * Detect idea complexity from raw text length and keyword signals.
 * This is a fast heuristic — not AI-based. The 1.4× buffer compensates
 * for any inaccuracy.
 */
export function detectComplexity(ideaText: string): ComplexityLevel {
  const text = ideaText.trim()
  const wordCount = text.split(/\s+/).length

  // Keyword signals of high complexity
  const complexKeywords = [
    'integration', 'api', 'enterprise', 'multi-tenant', 'microservice',
    'machine learning', 'ai', 'real-time', 'websocket', 'blockchain',
    'payment gateway', 'analytics', 'dashboard', 'reporting', 'erp', 'crm',
    'marketplace', 'multi-vendor', 'role-based', 'rbac', 'audit',
  ]
  const mediumKeywords = [
    'admin', 'user', 'management', 'saas', 'subscription', 'notification',
    'email', 'upload', 'search', 'filter', 'export', 'import', 'schedule',
    'booking', 'calendar', 'profile', 'settings', 'billing', 'invoice',
  ]

  const lowerText = text.toLowerCase()
  const complexHits = complexKeywords.filter(k => lowerText.includes(k)).length
  const mediumHits  = mediumKeywords.filter(k => lowerText.includes(k)).length

  // Length + keyword scoring
  if (wordCount > 150 || complexHits >= 3) return 'complex'
  if (wordCount > 60  || complexHits >= 1 || mediumHits >= 3) return 'medium'
  return 'simple'
}

/**
 * Estimate module count from idea text.
 * Used for display and token scaling only.
 */
export function estimateModuleCount(ideaText: string, complexity: ComplexityLevel): number {
  const base = { simple: 5, medium: 10, complex: 18 }[complexity]
  // Each 100 words beyond the first 50 adds ~1 implied module
  const wordCount = ideaText.trim().split(/\s+/).length
  const extra = Math.floor(Math.max(0, wordCount - 50) / 100)
  return Math.min(base + extra, 30)
}

// ── Token base estimates ──────────────────────────────────────────────────────
//
// These values represent the expected raw (pre-buffer) token usage for the
// full 13-document suite across all three agents. Derived from real generation
// runs on comparable idea sizes.
//
//   simple  = short idea, single product, 3–6 modules
//   medium  = standard SaaS/app, 6–15 modules
//   complex = enterprise, multi-tenant, 15+ modules or heavy integrations

const BASE_TOKENS: Record<ComplexityLevel, { input: number; output: number }> = {
  simple:  { input:  80_000, output:  90_000 },
  medium:  { input: 130_000, output: 150_000 },
  complex: { input: 200_000, output: 230_000 },
}

// Claude Sonnet 4.6 pricing (June 2026)
const MODEL_RATES = {
  'claude-sonnet-4-6': { inputPerMTok: 3.00, outputPerMTok: 15.00 },
}

// ── Main calculation function ─────────────────────────────────────────────────

export interface PricingConfig {
  model:                 string    // e.g. 'claude-sonnet-4-6'
  bufferMultiplier:      number    // default 1.4
  platformMarginPct:     number    // e.g. 100 = 100%
  usdInrRate:            number    // e.g. 84
  gstPct:                number    // e.g. 18
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  model:             'claude-sonnet-4-6',
  bufferMultiplier:  1.4,
  platformMarginPct: 100,
  usdInrRate:        84,
  gstPct:            18,
}

export function calcTokenEstimate(
  projectId:   string,
  ideaText:    string,
  config:      PricingConfig = DEFAULT_PRICING_CONFIG
): TokenEstimate {
  const complexity   = detectComplexity(ideaText)
  const moduleCount  = estimateModuleCount(ideaText, complexity)
  const base         = BASE_TOKENS[complexity]
  const rates        = MODEL_RATES[config.model as keyof typeof MODEL_RATES]
                       ?? MODEL_RATES['claude-sonnet-4-6']

  // Apply buffer
  const bufferedInput  = Math.round(base.input  * config.bufferMultiplier)
  const bufferedOutput = Math.round(base.output * config.bufferMultiplier)

  // USD cost
  const apiCostUsd = (bufferedInput  / 1_000_000) * rates.inputPerMTok
                   + (bufferedOutput / 1_000_000) * rates.outputPerMTok

  // INR conversion
  const apiCostInr       = apiCostUsd * config.usdInrRate
  const platformFeeInr   = apiCostInr * (config.platformMarginPct / 100)
  const subtotalInr      = apiCostInr + platformFeeInr
  const gstInr           = subtotalInr * (config.gstPct / 100)
  const totalInr         = subtotalInr + gstInr

  return {
    projectId,
    complexityLevel:       complexity,
    moduleCount,
    model:                 config.model,
    rawInputTokens:        base.input,
    rawOutputTokens:       base.output,
    bufferedInputTokens:   bufferedInput,
    bufferedOutputTokens:  bufferedOutput,
    apiCostUsd:            Math.round(apiCostUsd    * 10_000) / 10_000,
    apiCostInr:            Math.round(apiCostInr    * 100)    / 100,
    platformFeeInr:        Math.round(platformFeeInr * 100)   / 100,
    gstInr:                Math.round(gstInr         * 100)   / 100,
    totalInr:              Math.round(totalInr        * 100)   / 100,
    usdInrRate:            config.usdInrRate,
    calculatedAt:          new Date().toISOString(),
  }
}

// ── Formatting helpers ────────────────────────────────────────────────────────

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style:                 'currency',
    currency:              'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`
  if (tokens >= 1_000)     return `${Math.round(tokens / 1_000)}K`
  return tokens.toLocaleString()
}
