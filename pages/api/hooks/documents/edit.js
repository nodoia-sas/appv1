import { auth0 } from '../../../../lib/auth0'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        res.setHeader('Allow', 'PATCH')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { id } = req.query
    if (!id) {
        return res.status(400).json({ error: 'Missing document ID' })
    }

    const apiBase = process.env.API_URL || 'http://localhost:8010'

    try {
        const upstreamUrl = new URL(`/transitia/api/v1/documents/edit/${id}`, apiBase)

        let token = null
        try {
            const tokenResponse = await auth0.getAccessToken(req, res)
            token = tokenResponse?.accessToken || tokenResponse?.access_token || tokenResponse?.token || null
        } catch (e) {
            console.log('[hooks/documents/edit] getAccessToken failed:', String(e?.message || e))
        }

        const headers = {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // Forward Content-Type (multipart/form-data; boundary=...)
            'content-type': req.headers['content-type'],
            'accept': 'application/json, */*'
        }

        console.log('[hooks/documents/edit] proxy ->', upstreamUrl.toString())

        // In Node 18+ (Next 15), fetch accepts a ReadableStream as body.
        // req is an IncomingMessage which is a ReadableStream.
        const upstreamRes = await fetch(upstreamUrl.toString(), {
            method: 'PATCH',
            headers,
            body: req,
            duplex: 'half' // Required for streaming bodies in node fetch
        })

        console.log('[hooks/documents/edit] upstream status', upstreamRes.status)

        const contentType = upstreamRes.headers.get('content-type') || ''
        const status = upstreamRes.status

        if (contentType.includes('application/json')) {
            const data = await upstreamRes.json()
            return res.status(status).json(data)
        }

        const text = await upstreamRes.text()
        return res.status(status).send(text)

    } catch (err) {
        console.error('Error proxying /hooks/documents/edit ->', err)
        return res.status(502).json({ error: 'Unable to contact upstream API' })
    }
}
