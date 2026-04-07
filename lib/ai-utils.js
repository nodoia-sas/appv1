// Utilities for AI assistant: API call and local persistence
import { STORAGE_KEYS } from './storage-keys'
const CHAT_KEY = STORAGE_KEYS.AI_CHAT
const CHAT_MAX_MESSAGES = 50

export async function getAiResponse(prompt) {
  try {
    const response = await fetch('/api/ai-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      console.error('AI proxy error status:', response.status)
      return 'Hubo un error al conectar con el asistente de IA. Por favor, verifica tu conexión o intenta más tarde.'
    }

    const result = await response.json()
    return result?.text || 'Respuesta vacía del asistente de IA.'
  } catch (error) {
    console.error('Error calling AI proxy:', error)
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
    const trimmed = history.length > CHAT_MAX_MESSAGES
      ? history.slice(-CHAT_MAX_MESSAGES)
      : history
    localStorage.setItem(CHAT_KEY, JSON.stringify(trimmed))
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
