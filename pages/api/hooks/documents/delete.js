import { proxyRequest } from '../../../../lib/proxy-api'

export default async function handler(req, res) {
    const id = req.query.id || (req.body && req.body.id)
    if (!id) return res.status(400).json({ error: 'Missing document id' })

    return proxyRequest(req, res, {
        method: 'DELETE',
        endpoint: `/transitia/api/v1/documents/remove/${encodeURIComponent(id)}`
    })
}
