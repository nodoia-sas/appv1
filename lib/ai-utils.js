// Utilities for AI assistant: API call and local persistence
const CHAT_KEY = 'transit-ai-chat'

export async function getAiResponse(prompt) {
  try {
    const chatHistoryForApi = [{ role: 'user', parts: [{ text: prompt }] }]
    const payload = { contents: chatHistoryForApi }

    // NOTE: API key is left empty for local/dev. Replace with real key in production
    const apiKey = ''
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('AI API error status:', response.status)
      return 'Hubo un error al conectar con el asistente de IA. Por favor, verifica tu conexión o intenta más tarde.'
    }

    const result = await response.json()
    // Best-effort extract text from plausible response shapes
    const candidates = result?.candidates || []
    if (candidates.length > 0) {
      const parts = candidates[0]?.content?.parts || candidates[0]?.content || null
      if (Array.isArray(parts)) {
        return parts.map((p) => (p?.text ? p.text : p)).join('\n')
      }
      if (typeof parts === 'string') return parts
    }

    // Fallback: try result.output or result.content
    return result?.output || result?.content || 'Respuesta vacía del asistente de IA.'
  } catch (error) {
    console.error('Error calling AI API:', error)
    return 'Hubo un error al conectar con el asistente de IA. Por favor, verifica tu conexión o intenta más tarde.'
  }
}

export function loadChatHistory() {
  try {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(CHAT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.warn('Failed to load chat history', e)
    return []
  }
}

export function saveChatHistory(history) {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(CHAT_KEY, JSON.stringify(history))
  } catch (e) {
    console.warn('Failed to save chat history', e)
  }
}

export function clearChatHistory() {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem(CHAT_KEY)
  } catch (e) {
    console.warn('Failed to clear chat history', e)
  }
}

export default { getAiResponse, loadChatHistory, saveChatHistory, clearChatHistory }
