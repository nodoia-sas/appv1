import { auth0 } from '../../../../lib/auth0'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const apiBase = process.env.API_URL || 'http://localhost:8010'

    try {
        const upstreamUrl = new URL('/transitia/api/v1/documents/add', apiBase)

        let token = null
        try {
            const tokenResponse = await auth0.getAccessToken(req, res)
            token = tokenResponse?.accessToken || tokenResponse?.access_token || tokenResponse?.token || null
        } catch (e) {
            console.log('[hooks/documents/add] getAccessToken failed:', String(e?.message || e))
        }

        const headers = {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // Forward Content-Type (multipart/form-data; boundary=...)
            'content-type': req.headers['content-type'],
            'accept': 'application/json, */*'
        }

        console.log('[hooks/documents/add] proxy ->', upstreamUrl.toString())

        const upstreamRes = await fetch(upstreamUrl.toString(), {
            method: 'POST',
            headers,
            body: req,
            duplex: 'half'
        })

        console.log('[hooks/documents/add] upstream status', upstreamRes.status)

        const contentType = upstreamRes.headers.get('content-type') || ''
        const status = upstreamRes.status

        if (contentType.includes('application/json')) {
            const data = await upstreamRes.json()
            return res.status(status).json(data)
        }

        const text = await upstreamRes.text()
        return res.status(status).send(text)

    } catch (err) {
        console.error('Error proxying /hooks/documents/add ->', err)
        return res.status(502).json({ error: 'Unable to contact upstream API' })
    }
}
