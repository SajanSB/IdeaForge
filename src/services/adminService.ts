const STRAPI_URL = import.meta.env.VITE_STRAPI_URL as string
const TOKEN      = import.meta.env.VITE_STRAPI_PUBLIC_TOKEN as string

// ── Generic fetch helper ──────────────────────────────────────────────────────

async function strapiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StrapiPayment {
  id:                  number
  project_id:          string
  user_id:             string
  gateway:             'razorpay' | 'stripe'
  gateway_order_id:    string
  gateway_payment_id:  string
  amount_inr:          number
  currency:            string
  status:              'pending' | 'paid' | 'failed' | 'refunded'
  paid_at:             string | null
  created_at:          string
}

export interface StrapiProject {
  id:           number
  project_id:   string
  user_id:      string
  idea_snippet: string
  industry:     string | null
  status:       'generating' | 'complete' | 'failed'
  created_at:   string
  completed_at: string | null
}

export interface StrapiTokenLog {
  id:            number
  project_id:    string
  user_id:       string
  agent_type:    'ba' | 'ux' | 'pe'
  doc_type:      string
  model:         string
  input_tokens:  number
  output_tokens: number
  cost_usd:      number
  created_at:    string
}

export interface StrapiGenerationLog {
  id:             number
  project_id:     string
  user_id:        string
  status:         'in_progress' | 'complete' | 'failed'
  docs_completed: number
  failed_at_doc:  string | null
  error_type:     string | null
  error_message:  string | null
  retry_count:    number
  started_at:     string
  completed_at:   string | null
}

export interface StrapiSkill {
  id:           number
  agent_type:   'ba' | 'ux' | 'pe'
  content:      string
  version:      number
  published_by: string
  published_at: string
  is_active:    boolean
}

export interface StrapiUser {
  id:           number
  supabase_uid: string
  email:        string
  display_name: string | null
  role:         string | null
  industry:     string | null
  suspended:    boolean
  created_at:   string
}

export interface StrapiPlatformConfig {
  margin_pct:        number
  buffer_multiplier: number
  gst_enabled:       boolean
  usd_inr_rate:      number
  updated_at:        string
}

// ── Analytics queries ─────────────────────────────────────────────────────────

export type DateRange = 'this_month' | 'last_30' | 'all_time'

function buildDateFilter(range: DateRange): string {
  const now = new Date()
  if (range === 'this_month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return `&filters[created_at][$gte]=${start.toISOString()}`
  }
  if (range === 'last_30') {
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return `&filters[created_at][$gte]=${start.toISOString()}`
  }
  // all_time — cap at 12 months (SR-066)
  const start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  return `&filters[created_at][$gte]=${start.toISOString()}`
}

export const adminService = {

  // ── Analytics ──────────────────────────────────────────────────────────────

  getPayments: async (range: DateRange, page = 1, pageSize = 20) => {
    const filter = buildDateFilter(range)
    return strapiGet<{ data: Array<{ id: number; attributes: StrapiPayment }>; meta: { pagination: { total: number; page: number; pageSize: number } } }>(
      `/api/payments?populate=*${filter}&sort=created_at:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    )
  },

  getAllPayments: async (range: DateRange) =>
    strapiGet<{ data: Array<{ id: number; attributes: StrapiPayment }> }>(
      `/api/payments?${buildDateFilter(range)}&sort=created_at:desc&pagination[pageSize]=500`
    ),

  getProjects: async (range: DateRange, page = 1, pageSize = 20) => {
    const filter = buildDateFilter(range)
    return strapiGet<{ data: Array<{ id: number; attributes: StrapiProject }>; meta: { pagination: { total: number } } }>(
      `/api/projects?${filter}&sort=created_at:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    )
  },

  getTokenLogs: async (range: DateRange) =>
    strapiGet<{ data: Array<{ id: number; attributes: StrapiTokenLog }> }>(
      `/api/token-logs?${buildDateFilter(range)}&pagination[pageSize]=1000`
    ),

  // ── Skills ─────────────────────────────────────────────────────────────────

  getActiveSkill: async (agentType: 'ba' | 'ux' | 'pe') =>
    strapiGet<{ data: Array<{ id: number; attributes: StrapiSkill }> }>(
      `/api/skills?filters[agent_type][$eq]=${agentType}&filters[is_active][$eq]=true&sort=version:desc&pagination[limit]=1`
    ),

  // ── Platform config ────────────────────────────────────────────────────────

  getPlatformConfig: async () =>
    strapiGet<{ data: { id: number; attributes: StrapiPlatformConfig } }>(
      `/api/platform-config`
    ),

  // ── Users ──────────────────────────────────────────────────────────────────

  getUsers: async (search = '', page = 1, pageSize = 20) => {
    const searchFilter = search ? `&filters[email][$containsi]=${encodeURIComponent(search)}` : ''
    return strapiGet<{ data: Array<{ id: number; attributes: StrapiUser }>; meta: { pagination: { total: number } } }>(
      `/api/users?${searchFilter}&sort=created_at:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    )
  },

  // ── Dispute resolution ─────────────────────────────────────────────────────

  getUserPayments: async (userId: string) =>
    strapiGet<{ data: Array<{ id: number; attributes: StrapiPayment }> }>(
      `/api/payments?filters[user_id][$eq]=${userId}&sort=created_at:desc&pagination[pageSize]=50`
    ),

  getProjectTokenLogs: async (projectId: string) =>
    strapiGet<{ data: Array<{ id: number; attributes: StrapiTokenLog }> }>(
      `/api/token-logs?filters[project_id][$eq]=${projectId}&sort=created_at:asc&pagination[pageSize]=20`
    ),

  getProjectGenerationLog: async (projectId: string) =>
    strapiGet<{ data: Array<{ id: number; attributes: StrapiGenerationLog }> }>(
      `/api/generation-logs?filters[project_id][$eq]=${projectId}&sort=created_at:desc&pagination[limit]=1`
    ),

  getUserProjects: async (userId: string) =>
    strapiGet<{ data: Array<{ id: number; attributes: StrapiProject }> }>(
      `/api/projects?filters[user_id][$eq]=${userId}&sort=created_at:desc&pagination[pageSize]=50`
    ),
}
