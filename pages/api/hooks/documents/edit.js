import { proxyRequest } from '../../../../lib/proxy-api'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    const { id } = req.query
    if (!id) {
        return res.status(400).json({ error: 'Missing document ID' })
    }

    return proxyRequest(req, res, {
        method: 'PATCH',
        endpoint: `/transitia/api/v1/documents/edit/${id}`,
        isMultipart: true
    })
}
