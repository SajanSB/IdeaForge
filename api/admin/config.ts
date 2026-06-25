// api/admin/config.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_WHITELIST = (process.env.ADMIN_EMAIL_WHITELIST ?? '')
  .split(',').map(e => e.trim()).filter(Boolean)

interface ConfigBody {
  marginPct:        number
  bufferMultiplier: number
  gstEnabled:       boolean
  usdInrRate:       number
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
  const body = await req.json() as ConfigBody
  const { marginPct, bufferMultiplier, gstEnabled, usdInrRate } = body

  if (typeof marginPct !== 'number' || marginPct < 0 || marginPct > 500) {
    return new Response('Invalid marginPct (must be 0 - 500)', { status: 400 })
  }
  if (typeof bufferMultiplier !== 'number' || bufferMultiplier < 1.0 || bufferMultiplier > 3.0) {
    return new Response('Invalid bufferMultiplier (must be 1.0 - 3.0)', { status: 400 })
  }
  if (typeof gstEnabled !== 'boolean') {
    return new Response('Invalid gstEnabled (must be boolean)', { status: 400 })
  }
  if (typeof usdInrRate !== 'number' || usdInrRate < 50 || usdInrRate > 150) {
    return new Response('Invalid usdInrRate (must be 50 - 150)', { status: 400 })
  }

  try {
    // 4. Update platform config in Strapi
    const updateRes = await fetch(`${process.env.STRAPI_URL}/api/platform-config`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.STRAPI_API_KEY}` },
      body: JSON.stringify({
        data: {
          margin_pct:        marginPct,
          buffer_multiplier: bufferMultiplier,
          gst_enabled:       gstEnabled,
          usd_inr_rate:      usdInrRate,
          updated_at:        new Date().toISOString(),
        },
      }),
    })

    if (!updateRes.ok) {
      const err = await updateRes.text()
      throw new Error(`Strapi config update failed: ${err}`)
    }

    return new Response(
      JSON.stringify({ success: true, updatedAt: new Date().toISOString() }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Config update failed:', err)
    return new Response('Config update failed', { status: 500 })
  }
}
