import { auth0 } from './auth0'

const getApiBase = () => process.env.API_URL || 'http://localhost:8010'

const getAuthToken = async (req, res) => {
    try {
        const tokenResponse = await auth0.getAccessToken(req, res)
        return tokenResponse?.accessToken || tokenResponse?.access_token || tokenResponse?.token || null
    } catch (e) {
        // console.warn('[getAuthToken] failed:', String(e?.message || e))
        return null
    }
}

/**
 * Helper to proxy requests to the upstream API
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 * @param {Object} options
 * @param {string} options.method - HTTP method (GET, POST, etc.)
 * @param {string} options.endpoint - Upstream endpoint path (e.g. '/transitia/api/v1/...')
 * @param {Object} [options.queryParams] - Query parameters to append
 * @param {boolean} [options.isMultipart] - If true, streams req as body and forwards content-type
 * @param {Object} [options.body] - Explicit body to send (as JSON). If null and not multipart, tries req.body
 * @param {Function} [options.transformResponse] - Function to transform the JSON response data before sending to client
 */
export async function proxyRequest(req, res, {
    method,
    endpoint,
    queryParams = {},
    isMultipart = false,
    body = null,
    transformResponse = (d) => d
}) {
    if (req.method !== method) {
        res.setHeader('Allow', method)
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const apiBase = getApiBase()
        const upstreamUrl = new URL(endpoint, apiBase)

        Object.entries(queryParams).forEach(([k, v]) => {
            if (v !== undefined) upstreamUrl.searchParams.set(k, String(v))
        })

        const token = await getAuthToken(req, res)
        const headers = {
            accept: 'application/json, */*',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }

        let requestBody = undefined
        let duplex = undefined

        if (isMultipart) {
            headers['content-type'] = req.headers['content-type']
            requestBody = req
            duplex = 'half'
        } else if (body) {
            headers['content-type'] = 'application/json'
            requestBody = JSON.stringify(body)
        } else if (req.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            headers['content-type'] = 'application/json'
            requestBody = JSON.stringify(req.body)
        }

        console.log(`[proxyRequest] ${method} -> ${upstreamUrl.toString()}`)

        const upstreamRes = await fetch(upstreamUrl.toString(), {
            method,
            headers,
            body: requestBody,
            ...(duplex ? { duplex } : {})
        })

        console.log(`[proxyRequest] upstream status: ${upstreamRes.status}`)

        const contentType = upstreamRes.headers.get('content-type') || ''
        const status = upstreamRes.status

        if (contentType.includes('application/json')) {
            const data = await upstreamRes.json()
            return res.status(status).json(transformResponse(data))
        }

        const text = await upstreamRes.text()
        return res.status(status).send(text)

    } catch (err) {
        console.error(`Error proxying ${endpoint} ->`, err)
        return res.status(502).json({ error: 'Unable to contact upstream API' })
    }
}
