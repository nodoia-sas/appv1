import { proxyRequest } from '../../../../lib/proxy-api'

export default async function handler(req, res) {
    const defaults = {
        pageNumber: '1',
        pageSize: '50',
        orderBy: 'createdAt',
        sort: 'DESC',
    }
    const incoming = req.query || {}
    const queryParams = { ...defaults, ...incoming }

    return proxyRequest(req, res, {
        method: 'GET',
        endpoint: '/transitia/api/v1/documents/list',
        queryParams,
        transformResponse: (data) => Array.isArray(data) ? data : (data.data || [])
    })
}
