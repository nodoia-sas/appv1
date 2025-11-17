import { auth0 } from '../../../../lib/auth0'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const id = req.query.id || (req.body && req.body.id)
  if (!id) return res.status(400).json({ error: 'Missing vehicle id' })

  const apiBase = process.env.API_URL || 'http://localhost:8010'
  try {
    const upstreamUrl = new URL(`/transitia/api/v1/vehicles/remove/${encodeURIComponent(id)}`, apiBase).toString()

    let token = null
    try {
      const tokenResponse = await auth0.getAccessToken(req, res)
      token = tokenResponse?.token || tokenResponse?.access_token || tokenResponse?.accessToken || null
    } catch (e) {
      console.log('[hooks/vehicles/delete] getAccessToken failed:', String(e?.message || e))
    }

    const headers = {
      accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    console.log('[hooks/vehicles/delete] proxy ->', upstreamUrl, 'hasToken?', !!token)
    const upstreamRes = await fetch(upstreamUrl, { method: 'DELETE', headers })
    console.log('[hooks/vehicles/delete] upstream status', upstreamRes.status)

    const contentType = upstreamRes.headers.get('content-type') || ''
    const status = upstreamRes.status

    if (contentType.includes('application/json')) {
      const data = await upstreamRes.json()
      return res.status(status).json(data)
    }

    const text = await upstreamRes.text()
    return res.status(status).send(text)
  } catch (err) {
    console.error('Error proxying /hooks/vehicles/delete ->', err)
    return res.status(502).json({ error: 'Unable to contact upstream API' })
  }
}
