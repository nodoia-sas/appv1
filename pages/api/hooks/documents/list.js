import { auth0 } from '../../../../lib/auth0'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        if (res && typeof res.setHeader === 'function') res.setHeader('Allow', 'GET')
        if (res && typeof res.status === 'function') return res.status(405).json({ error: 'Method not allowed' })
        return
    }

    const apiBase = process.env.API_URL || 'http://localhost:8010'
    try {
        const upstreamUrl = new URL('/transitia/api/v1/documents/list', apiBase)
        const defaults = {
            pageNumber: '1',
            pageSize: '50', // Fetch more by default
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
            console.log('[hooks/documents/list] getAccessToken failed:', String(e?.message || e))
        }

        const headers = {
            accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }

        console.log('[hooks/documents/list] proxy ->', upstreamUrl.toString())
        const upstreamRes = await fetch(upstreamUrl.toString(), { method: 'GET', headers })
        console.log('[hooks/documents/list] upstream status', upstreamRes.status)

        const contentType = upstreamRes.headers.get('content-type') || ''
        const status = upstreamRes.status

        if (contentType.includes('application/json')) {
            const data = await upstreamRes.json()
            // Adjust based on actual response structure. Vehicles returned data.data.
            // Assuming similar structure: { data: [...], meta: ... } or just [...]
            // If the backend follows the same pattern as vehicles, it might be data.data
            // But let's return the whole body or data property if it exists.
            // The vehicle list returned `data.data`. Let's try to be safe.
            const list = Array.isArray(data) ? data : (data.data || [])
            return res.status(status).json(list)
        }

        const text = await upstreamRes.text()
        return res.status(status).send(text)
    } catch (err) {
        console.error('Error proxying /hooks/documents/list ->', err)
        return res.status(502).json({ error: 'Unable to contact upstream API' })
    }
}
