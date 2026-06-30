// ── Document meta ─────────────────────────────────────────────────────────────

export type ComplexityLevel = 'Simple' | 'Medium' | 'Complex'

export interface DocEstimate {
  id: string
  name: string
  shortCode: string
  agent: 'BA Agent' | 'UX Agent' | 'Prompt Engineer'
  inputTokens: number
  outputTokens: number
}

export interface PricingConfig {
  usdInrRate: number
  platformFeeInr: number
  gstRate: number
  bufferMultiplier: number
}

export interface TokenEstimate {
  complexityLevel: ComplexityLevel
  documents: DocEstimate[]
  totalInputTokens: number
  totalOutputTokens: number
  bufferedInputTokens: number
  bufferedOutputTokens: number
  qaApiCostInr: number
  apiCostInr: number
  platformFeeInr: number
  gstInr: number
  totalInr: number
  usdInrRate: number
  rawInputTokens: number
  rawOutputTokens: number
}

// ── Document meta ─────────────────────────────────────────────────────────────

const DOC_META: Omit<DocEstimate, 'inputTokens' | 'outputTokens'>[] = [
  { id: 'brd',       name: 'Business Requirements Document',    shortCode: 'BRD',   agent: 'BA Agent' },
  { id: 'frd',       name: 'Functional Requirements Document',  shortCode: 'FRD',   agent: 'BA Agent' },
  { id: 'srs',       name: 'System Requirements Specification', shortCode: 'SRS',   agent: 'BA Agent' },
  { id: 'bmp',       name: 'Business Model Process',            shortCode: 'BMP',   agent: 'BA Agent' },
  { id: 'usr',       name: 'User Stories',                      shortCode: 'USR',   agent: 'BA Agent' },
  { id: 'pfd',       name: 'Process Flow Diagrams',             shortCode: 'PFD',   agent: 'BA Agent' },
  { id: 'uc',        name: 'Use Cases',                         shortCode: 'UC',    agent: 'BA Agent' },
  { id: 'dmd',       name: 'Data Model Document',               shortCode: 'DMD',   agent: 'BA Agent' },
  { id: 'uat',       name: 'UAT Plan',                          shortCode: 'UAT',   agent: 'BA Agent' },
  { id: 'rtm',       name: 'Requirements Traceability Matrix',  shortCode: 'RTM',   agent: 'BA Agent' },
  { id: 'uiux',      name: 'UI/UX Specification',               shortCode: 'UI/UX', agent: 'UX Agent' },
  { id: 'devprompt', name: 'AI Dev Prompt',                     shortCode: 'DEV',   agent: 'Prompt Engineer' },
]

// ── Token baselines ───────────────────────────────────────────────────────────

const BASE_DOC_TOKENS: Record<string, { input: number; output: number }> = {
  brd:       { input: 1800, output: 2200 },
  frd:       { input: 2500, output: 3200 },
  srs:       { input: 2200, output: 2800 },
  bmp:       { input: 1400, output: 1800 },
  usr:       { input: 2000, output: 2600 },
  pfd:       { input: 1800, output: 2200 },
  uc:        { input: 1800, output: 2200 },
  dmd:       { input: 1600, output: 2000 },
  uat:       { input: 2000, output: 2500 },
  rtm:       { input: 2200, output: 2800 },
  uiux:      { input: 3500, output: 4500 },
  devprompt: { input: 4500, output: 5000 },
}

// ── Q&A elicitation token model ──────────────────────────────────────────────
//
// The BA Agent decides how many questions to ask based on idea complexity.
// We estimate the question count per complexity tier rather than hardcoding "6".
//
// Per-question cost (one Claude API call per question):
//   Input:  ~500 tokens  (idea text context ~350 + system prompt ~150)
//   Output: ~180 tokens  (the generated question text)
//
// Estimated question counts by complexity:
//   Simple:  4 questions  (focused, single-purpose app)
//   Medium:  6 questions  (moderate scope, multiple flows)
//   Complex: 9 questions  (large platform, many roles/integrations)

export const QA_TOKENS_PER_QUESTION = {
  input:  500,
  output: 180,
}

export const QA_ESTIMATED_QUESTION_COUNT: Record<ComplexityLevel, number> = {
  Simple:  4,
  Medium:  6,
  Complex: 9,
}

function calcQATokensForComplexity(complexity: ComplexityLevel): { input: number; output: number } {
  const count = QA_ESTIMATED_QUESTION_COUNT[complexity]
  return {
    input:  count * QA_TOKENS_PER_QUESTION.input,
    output: count * QA_TOKENS_PER_QUESTION.output,
  }
}

const COMPLEXITY_MULTIPLIER: Record<ComplexityLevel, number> = {
  Simple:  1.0,
  Medium:  1.55,
  Complex: 2.3,
}

// Claude Sonnet 4.6 pricing
const INPUT_PRICE_PER_M_USD  = 3.0
const OUTPUT_PRICE_PER_M_USD = 15.0

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  usdInrRate:      83.5,
  platformFeeInr:  149,
  gstRate:         0.18,
  bufferMultiplier: 1.4,
}

// ── Complexity detection ──────────────────────────────────────────────────────

export function detectComplexity(ideaText: string): ComplexityLevel {
  const len = ideaText.trim().length
  if (len > 900) return 'Complex'
  if (len > 250) return 'Medium'
  return 'Simple'
}

// ── Core calculation ──────────────────────────────────────────────────────────

export function calcTokenEstimate(
  _projectId: string,
  ideaText: string,
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
  complexityOverride?: ComplexityLevel,
): TokenEstimate {
  const complexityLevel = complexityOverride ?? detectComplexity(ideaText)
  const multiplier = COMPLEXITY_MULTIPLIER[complexityLevel]

  // Per-document tokens
  const documents: DocEstimate[] = DOC_META.map((doc) => ({
    ...doc,
    inputTokens:  Math.round(BASE_DOC_TOKENS[doc.id].input  * multiplier),
    outputTokens: Math.round(BASE_DOC_TOKENS[doc.id].output * multiplier),
  }))

  const rawInputTokens  = documents.reduce((s, d) => s + d.inputTokens,  0)
  const rawOutputTokens = documents.reduce((s, d) => s + d.outputTokens, 0)

  // Apply buffer to document generation tokens only
  const bufferedDocInput  = Math.round(rawInputTokens  * config.bufferMultiplier)
  const bufferedDocOutput = Math.round(rawOutputTokens * config.bufferMultiplier)

  // Q&A tokens added flat — complexity-aware count, not buffered (known cost)
  const qaTokens = calcQATokensForComplexity(complexityLevel)
  const bufferedInputTokens  = bufferedDocInput  + qaTokens.input
  const bufferedOutputTokens = bufferedDocOutput + qaTokens.output

  // Q&A cost (for breakdown display)
  const qaCostUsd = (qaTokens.input  / 1_000_000) * INPUT_PRICE_PER_M_USD
                  + (qaTokens.output / 1_000_000) * OUTPUT_PRICE_PER_M_USD
  const qaApiCostInr = qaCostUsd * config.usdInrRate

  // Total API cost (docs + Q&A)
  const totalCostUsd = (bufferedInputTokens  / 1_000_000) * INPUT_PRICE_PER_M_USD
                     + (bufferedOutputTokens / 1_000_000) * OUTPUT_PRICE_PER_M_USD
  const apiCostInr    = totalCostUsd * config.usdInrRate
  const platformFeeInr = config.platformFeeInr
  const gstInr         = (apiCostInr + platformFeeInr) * config.gstRate
  const totalInr       = apiCostInr + platformFeeInr + gstInr

  return {
    complexityLevel,
    documents,
    totalInputTokens:   rawInputTokens,
    totalOutputTokens:  rawOutputTokens,
    rawInputTokens,
    rawOutputTokens,
    bufferedInputTokens,
    bufferedOutputTokens,
    qaApiCostInr,
    apiCostInr,
    platformFeeInr,
    gstInr,
    totalInr,
    usdInrRate: config.usdInrRate,
  }
}

// ── Display helpers ───────────────────────────────────────────────────────────

export function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatTokenCount(n: number): string {
  return n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n)
}

export function calcQACostInr(
  complexity: ComplexityLevel = 'Medium',
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
): number {
  const qaTokens = calcQATokensForComplexity(complexity)
  const costUsd  = (qaTokens.input  / 1_000_000) * INPUT_PRICE_PER_M_USD
                 + (qaTokens.output / 1_000_000) * OUTPUT_PRICE_PER_M_USD
  return Math.round(costUsd * config.usdInrRate * 100) / 100
}

export function estimatedQAQuestionCount(complexity: ComplexityLevel): number {
  return QA_ESTIMATED_QUESTION_COUNT[complexity]
}
