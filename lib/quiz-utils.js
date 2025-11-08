// Quiz utilities: default questions and fetch stub
export const DEFAULT_QUIZ_QUESTIONS = [
  { id: 1, question: "¿Cuál es la edad mínima para conducir?", options: ["16", "18", "21"], answer: "18" },
  { id: 2, question: "¿Qué documento es obligatorio portar?", options: ["Licencia", "Pasaporte", "Cédula"], answer: "Licencia" },
]

export async function fetchQuizQuestions(apiUrl) {
  // Stub for future API integration. Returns defaults for now.
  try {
    // If apiUrl provided, attempt to fetch; otherwise return defaults
    if (apiUrl) {
      const res = await fetch(apiUrl)
      if (res.ok) {
        const data = await res.json()
        return Array.isArray(data) ? data : DEFAULT_QUIZ_QUESTIONS
      }
    }
  } catch (e) {
    // ignore and fall back
  }
  return DEFAULT_QUIZ_QUESTIONS
}
