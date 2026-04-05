/**
 * Rate limiter en memoria usando ventana deslizante.
 * Adecuado para un solo proceso (dev/producción serverless con instancia única).
 * Para multi-instancia se necesitaría Redis.
 */

const store = new Map()

/**
 * @param {Object} options
 * @param {number} options.windowMs  - Ventana de tiempo en ms (default: 60_000)
 * @param {number} options.max       - Máximo de requests por ventana (default: 20)
 * @param {string} [options.keyPrefix] - Prefijo para diferenciar limiters
 */
export function rateLimit({ windowMs = 60_000, max = 20, keyPrefix = '' } = {}) {
  return function check(req, res) {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'unknown'
    const key = `${keyPrefix}:${ip}`
    const now = Date.now()

    const entry = store.get(key) || { count: 0, resetAt: now + windowMs }

    if (now > entry.resetAt) {
      entry.count = 0
      entry.resetAt = now + windowMs
    }

    entry.count += 1
    store.set(key, entry)

    const remaining = Math.max(0, max - entry.count)
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)

    res.setHeader('X-RateLimit-Limit', max)
    res.setHeader('X-RateLimit-Remaining', remaining)
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000))

    if (entry.count > max) {
      res.setHeader('Retry-After', retryAfter)
      res.status(429).json({ error: 'Too many requests. Please try again later.' })
      return false
    }

    return true
  }
}

// Limpieza periódica para evitar fugas de memoria
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 5 * 60_000)
