import { proxyRequest } from '../../../../lib/proxy-api'
import { validate, listQuerySchema } from '../../../../lib/validate'

export default async function handler(req, res) {
  const params = validate(res, listQuerySchema, req.query)
  if (!params) return

  return proxyRequest(req, res, {
    method: 'GET',
    endpoint: '/transitia/api/v1/vehicles/list',
    queryParams: params,
    transformResponse: (data) => data.data
  })
}
