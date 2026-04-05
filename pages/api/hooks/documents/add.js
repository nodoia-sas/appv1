import { proxyRequest } from '../../../../lib/proxy-api'
import { rateLimit } from '../../../../lib/rate-limit'

export const config = {
    api: {
        bodyParser: false,
    },
}

const limiter = rateLimit({ windowMs: 60_000, max: 30, keyPrefix: 'documents-add' })

export default async function handler(req, res) {
    if (!limiter(req, res)) return
    return proxyRequest(req, res, {
        method: 'POST',
        endpoint: '/transitia/api/v1/documents/add',
        isMultipart: true
    })
}
