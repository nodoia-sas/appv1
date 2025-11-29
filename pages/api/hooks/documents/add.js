import { proxyRequest } from '../../../../lib/proxy-api'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    return proxyRequest(req, res, {
        method: 'POST',
        endpoint: '/transitia/api/v1/documents/add',
        isMultipart: true
    })
}
