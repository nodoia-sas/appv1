import { proxyRequest } from '../../../../lib/proxy-api'

export default async function handler(req, res) {
  return proxyRequest(req, res, {
    method: 'POST',
    endpoint: '/transitia/api/v1/vehicles/add'
  })
}
