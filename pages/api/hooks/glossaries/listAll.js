import { proxyRequest } from '../../../../lib/proxy-api'

export default async function handler(req, res) {
    // Proxy GET requests to the backend
    // URL: http://localhost:8010/transitia/api/v1/glossaries/listAll
    await proxyRequest(req, res, {
        method: 'GET',
        endpoint: 'transitia/api/v1/glossaries/listAll'
    })
}
