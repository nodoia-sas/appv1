import { auth0 } from '../../../../lib/auth0'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    // guard in case res is undefined to avoid TypeError
    if (res && typeof res.setHeader === 'function') res.setHeader('Allow', 'GET')
    if (res && typeof res.status === 'function') return res.status(405).json({ error: 'Method not allowed' })
    console.error('[hooks/vehicles/list] Invalid handler invocation - missing res')
    return
  }

  const apiBase = process.env.API_URL || 'http://localhost:8010'
  try {
    const upstreamUrl = new URL('/transitia/api/v1/vehicles/list', apiBase)
    const defaults = {
      pageNumber: '1',
      pageSize: '10',
      orderBy: 'createdAt',
      sort: 'DESC',
    }
    const incoming = req.query || {}
    const params = { ...defaults, ...incoming }
    Object.keys(params).forEach((k) => {
      if (params[k] !== undefined) upstreamUrl.searchParams.set(k, String(params[k]))
    })

    let token = null
    try {
      const tokenResponse = await auth0.getAccessToken(req, res)
      token = tokenResponse?.token || tokenResponse?.access_token || tokenResponse?.accessToken || null
    } catch (e) {
      console.log('[hooks/vehicles/list] getAccessToken failed:', String(e?.message || e))
    }

    const headers = {
      accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    console.log('[hooks/vehicles/list] proxy ->', upstreamUrl.toString())
    console.log('token: ', token)
    const upstreamRes = await fetch(upstreamUrl.toString(), { method: 'GET', headers })
    console.log('[hooks/vehicles/list] upstream status', upstreamRes.status)

    const contentType = upstreamRes.headers.get('content-type') || ''
    const status = upstreamRes.status

    if (contentType.includes('application/json')) {
      const data = await upstreamRes.json()
      return res.status(status).json(data.data)
    }

    const text = await upstreamRes.text()
    return res.status(status).send(text)
  } catch (err) {
    console.error('Error proxying /hooks/vehicles/list ->', err)
    return res.status(502).json({ error: 'Unable to contact upstream API' })
  }
}
