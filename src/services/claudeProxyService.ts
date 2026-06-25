import { supabase } from '@/services/supabaseClient'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ElicitationParams {
  projectId: string
  ideaText: string
  industry: string
  techPreference: string
}

export interface ElicitationResult {
  questions: string[]
}

export interface GenerateParams {
  projectId: string
  agentType: 'ba' | 'ux' | 'pe'
  documentIndex: string
  ideaText: string
  qaTranscript: Array<{ question: string; answer: string | null }>
  priorContext?: string
  paymentId: string
  paymentSignature: string
  orderId: string
  sessionToken?: string
}

export interface GenerateResult {
  content: string
  inputTokens: number
  outputTokens: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function callProxy<T>(
  body: Record<string, unknown>,
  requiresAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (requiresAuth) {
    const token = await getAuthToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Proxy error ${response.status}: ${text}`)
  }

  return response.json() as Promise<T>
}

// ── Elicitation (free — no payment required) ─────────────────────────────────

const FALLBACK_QUESTIONS = [
  'Who are the primary users of this application — will they be technical (developers, admins) or non-technical (end users, consumers)?',
  'What is the main problem this application solves? Describe the current pain point in one or two sentences.',
  'How many distinct user roles will the application have, and what is the most critical action each role needs to perform?',
  'What platforms does this application need to run on — web browser, mobile app, desktop, or a combination?',
  'Do you have any existing systems, databases, or third-party services that this application must integrate with?',
  'What does success look like for this application 6 months after launch? Name one or two specific, measurable outcomes.',
]

export async function fetchElicitationQuestions(
  params: ElicitationParams
): Promise<ElicitationResult> {
  try {
    const result = await callProxy<{ content: string }>(
      {
        agentType: 'elicitation',
        projectId: params.projectId,
        ideaText: params.ideaText,
        industry: params.industry,
        techPreference: params.techPreference,
      },
      false // no auth required for elicitation
    )

    // The proxy returns the questions as a JSON array string
    try {
      const parsed = JSON.parse(result.content) as unknown
      if (Array.isArray(parsed) && parsed.length >= 4) {
        return { questions: parsed as string[] }
      }
    } catch {
      // Content is not JSON — extract questions from text
      const lines = result.content
        .split('\n')
        .map(l => l.replace(/^\d+\.\s*/, '').trim())
        .filter(l => l.length > 20 && l.includes('?'))
      if (lines.length >= 4) return { questions: lines.slice(0, 8) }
    }

    throw new Error('Invalid question format from API')
  } catch (err) {
    console.warn('Elicitation API failed, using fallback questions:', err)
    return { questions: FALLBACK_QUESTIONS }
  }
}

// ── Document generation (requires payment) ───────────────────────────────────

export async function generateDocument(params: GenerateParams): Promise<GenerateResult> {
  const token = await getAuthToken()
  if (!token) throw new Error('Not authenticated')

  return callProxy<GenerateResult>(
    {
      projectId: params.projectId,
      agentType: params.agentType,
      documentIndex: params.documentIndex,
      ideaText: params.ideaText,
      qaTranscript: params.qaTranscript,
      priorContext: params.priorContext ?? '',
      paymentId: params.paymentId,
      paymentSignature: params.paymentSignature,
      orderId: params.orderId,
      sessionToken: params.sessionToken,
    },
    true // requires auth
  )
}
