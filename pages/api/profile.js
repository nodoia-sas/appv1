import { auth0 } from '../../lib/auth0'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiBase = process.env.API_URL || 'http://localhost:8010'
  try {
    const upstream = new URL('/transitia/api/v1/users/profile', apiBase).toString()

    // Try to obtain access token from Auth0 session (server-side)
    let token = null
    try {
      const tokenResponse = await auth0.getAccessToken(req, res)
      // console.log('tokenResponse:', tokenResponse)
      token = tokenResponse?.token || tokenResponse?.access_token || null
    } catch (e) {
      console.log('[api/profile] getAccessToken failed:', String(e?.message || e))
    }

    const headers = {
      accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    console.log('[api/profile] proxy ->', upstream, 'hasToken?', !!token)
    const upstreamRes = await fetch(upstream, { method: 'GET', headers })
    console.log('[api/profile] upstream status', upstreamRes.status)

    const contentType = upstreamRes.headers.get('content-type') || ''
    const status = upstreamRes.status

    if (contentType.includes('application/json')) {
      const data = await upstreamRes.json()
      return res.status(status).json(data)
    }

    const text = await upstreamRes.text()
    return res.status(status).send(text)
  } catch (err) {
    console.error('Error proxying /api/profile ->', err)
    return res.status(502).json({ error: 'Unable to contact upstream API' })
  }
}
