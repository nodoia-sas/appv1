import { proxyRequest } from '../../../../lib/proxy-api'
import { validate, idParamSchema } from '../../../../lib/validate'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    const params = validate(res, idParamSchema, { id: req.query.id })
    if (!params) return

    return proxyRequest(req, res, {
        method: 'PATCH',
        endpoint: `/transitia/api/v1/documents/edit/${encodeURIComponent(params.id)}`,
        isMultipart: true
    })
}
