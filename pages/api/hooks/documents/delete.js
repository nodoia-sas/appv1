import { proxyRequest } from '../../../../lib/proxy-api'
import { validate, idParamSchema } from '../../../../lib/validate'
import { rateLimit } from '../../../../lib/rate-limit'

const limiter = rateLimit({ windowMs: 60_000, max: 30, keyPrefix: 'documents-delete' })

export default async function handler(req, res) {
    if (!limiter(req, res)) return
    const rawId = req.query.id || (req.body && req.body.id)
    const params = validate(res, idParamSchema, { id: rawId })
    if (!params) return

    return proxyRequest(req, res, {
        method: 'DELETE',
        endpoint: `/transitia/api/v1/documents/remove/${encodeURIComponent(params.id)}`
    })
}
