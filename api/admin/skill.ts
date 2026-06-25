// api/admin/skill.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_WHITELIST = (process.env.ADMIN_EMAIL_WHITELIST ?? '')
  .split(',').map(e => e.trim()).filter(Boolean)

interface SkillBody {
  agentType:    'ba' | 'ux' | 'pe'
  skillContent: string
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  // 1. Validate JWT
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return new Response('Unauthorized', { status: 401 })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return new Response('Unauthorized', { status: 401 })

  // 2. Validate admin whitelist
  if (!ADMIN_WHITELIST.includes(user.email ?? '')) {
    return new Response('Forbidden — not an admin', { status: 403 })
  }

  // 3. Parse and validate body
  const body = await req.json() as SkillBody
  const { agentType, skillContent } = body

  if (!['ba', 'ux', 'pe'].includes(agentType)) {
    return new Response('Invalid agentType', { status: 400 })
  }
  if (!skillContent || skillContent.trim().length === 0) {
    return new Response('Skill content cannot be empty', { status: 400 })
  }
  if (skillContent.length > 50_000) {
    return new Response('Skill content exceeds 50,000 characters', { status: 400 })
  }

  try {
    // 4. Deactivate existing active skill for this agent
    const existingRes = await fetch(
      `${process.env.STRAPI_URL}/api/skills?filters[agent_type][$eq]=${agentType}&filters[is_active][$eq]=true`,
      { headers: { Authorization: `Bearer ${process.env.STRAPI_API_KEY}` } }
    )
    const existing = await existingRes.json() as { data: Array<{ id: number; attributes: { version: number } }> }
    const currentVersion = existing.data?.[0]?.attributes?.version ?? 0

    // Deactivate current
    if (existing.data?.[0]?.id) {
      await fetch(`${process.env.STRAPI_URL}/api/skills/${existing.data[0].id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
        body: JSON.stringify({ data: { is_active: false } }),
      })
    }

    // 5. Create new active skill record
    const newVersion = currentVersion + 1
    const createRes = await fetch(`${process.env.STRAPI_URL}/api/skills`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
      body: JSON.stringify({
        data: {
          agent_type:   agentType,
          content:      skillContent,
          version:      newVersion,
          published_by: user.email,
          published_at: new Date().toISOString(),
          is_active:    true,
        },
      }),
    })

    if (!createRes.ok) {
      const err = await createRes.text()
      throw new Error(`Strapi create failed: ${err}`)
    }

    return new Response(
      JSON.stringify({ success: true, version: newVersion, updatedAt: new Date().toISOString() }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Skill publish failed:', err)
    return new Response('Skill publish failed', { status: 500 })
  }
}
