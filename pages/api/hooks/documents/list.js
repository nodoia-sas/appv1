import { proxyRequest } from '../../../../lib/proxy-api'
import { validate, listQuerySchema } from '../../../../lib/validate'

export default async function handler(req, res) {
    const params = validate(res, listQuerySchema.extend({ pageSize: listQuerySchema.shape.pageSize.default(50) }), req.query)
    if (!params) return

    return proxyRequest(req, res, {
        method: 'GET',
        endpoint: '/transitia/api/v1/documents/list',
        queryParams: params,
        transformResponse: (data) => Array.isArray(data) ? data : (data.data || [])
    })
}
