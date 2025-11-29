import { proxyRequest } from '../../../../lib/proxy-api'

export default async function handler(req, res) {
  const id = req.query.id || (req.body && req.body.id)
  if (!id) return res.status(400).json({ error: 'Missing vehicle id' })

  return proxyRequest(req, res, {
    method: 'DELETE',
    endpoint: `/transitia/api/v1/vehicles/remove/${encodeURIComponent(id)}`
  })
}
