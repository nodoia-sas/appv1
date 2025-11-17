import { auth0 } from '../../../../lib/auth0'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiBase = process.env.API_URL || 'http://localhost:8010'
  try {
    const upstream = new URL('/transitia/api/v1/vehicles/add', apiBase).toString()

    // Try to obtain access token from Auth0 session (server-side)
    let token = null
    try {
      const tokenResponse = await auth0.getAccessToken(req, res)
      // tokenResponse shape may vary
      token = tokenResponse?.accessToken || tokenResponse?.access_token || tokenResponse?.token || null
    } catch (e) {
      console.log('[hooks/vehicles/add] getAccessToken failed:', String(e?.message || e))
    }

    // Fallback: accept Authorization header forwarded from client
    const incomingAuth = req.headers?.authorization
    const authHeader = token ? `Bearer ${token}` : (incomingAuth ? incomingAuth : undefined)

    const headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    }

    console.log('[hooks/vehicles/add] proxy ->', upstream, 'hasToken?', !!token)

    const upstreamRes = await fetch(upstream, { method: 'POST', headers, body: JSON.stringify(req.body) })
    console.log('[hooks/vehicles/add] upstream status', upstreamRes.status)

    const contentType = upstreamRes.headers.get('content-type') || ''
    const status = upstreamRes.status

    if (contentType.includes('application/json')) {
      const data = await upstreamRes.json()
      return res.status(status).json(data)
    }

    const text = await upstreamRes.text()
    return res.status(status).send(text)
  } catch (err) {
    console.error('Error proxying /hooks/vehicles/add ->', err)
    return res.status(502).json({ error: 'Unable to contact upstream API' })
  }
}
