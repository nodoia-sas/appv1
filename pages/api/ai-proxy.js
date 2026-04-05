import { rateLimit } from '../../lib/rate-limit'

const limiter = rateLimit({ windowMs: 60_000, max: 20, keyPrefix: 'ai-proxy' })

export default async function handler(req, res) {
  if (!limiter(req, res)) return
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body || {}
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid prompt' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service not configured' })
  }

  const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-05-20'
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`

  try {
    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!response.ok) {
      return res.status(502).json({ error: 'AI service error' })
    }

    const result = await response.json()
    const candidates = result?.candidates || []
    let text = 'Respuesta vacía del asistente de IA.'

    if (candidates.length > 0) {
      const parts = candidates[0]?.content?.parts || candidates[0]?.content || null
      if (Array.isArray(parts)) {
        text = parts.map((p) => (p?.text ? p.text : p)).join('\n')
      } else if (typeof parts === 'string') {
        text = parts
      }
    }

    return res.status(200).json({ text })
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'AI service timed out' })
    }
    console.error('[ai-proxy] Error calling Gemini:', err?.message || err)
    return res.status(502).json({ error: 'Unable to contact AI service' })
  }
}
