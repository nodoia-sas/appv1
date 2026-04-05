import { proxyRequest } from '../../../../lib/proxy-api'
import { rateLimit } from '../../../../lib/rate-limit'

const limiter = rateLimit({ windowMs: 60_000, max: 30, keyPrefix: 'vehicles-add' })

export default async function handler(req, res) {
  if (!limiter(req, res)) return
  return proxyRequest(req, res, {
    method: 'POST',
    endpoint: '/transitia/api/v1/vehicles/add'
  })
}
