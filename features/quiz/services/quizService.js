/**
 * Quiz Service
 * Handles quiz data fetching and business logic
 */

const DEFAULT_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál es la edad mínima para conducir?",
    options: ["16", "18", "21"],
    answer: "18",
  },
  {
    id: 2,
    question: "¿Qué documento es obligatorio portar?",
    options: ["Licencia", "Pasaporte", "Cédula"],
    answer: "Licencia",
  },
];

const STORAGE_KEY = "transit-quiz-progress";

/**
 * Fetch quiz questions from API or return defaults
 * @param {string} apiUrl - Optional API endpoint
 * @returns {Promise<Array>} Quiz questions
 */
export async function fetchQuizQuestions(apiUrl) {
  try {
    if (apiUrl) {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : DEFAULT_QUIZ_QUESTIONS;
      }
    }
  } catch (e) {
    console.warn("fetchQuizQuestions failed, falling back to default", e);
  }
  return DEFAULT_QUIZ_QUESTIONS;
}

/**
 * Save quiz progress to localStorage
 * @param {Object} progress - Quiz progress data
 */
export function saveQuizProgress(progress) {
  try {
    if (typeof window !== "undefined") {
      const payload = {
        ...progress,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  } catch (e) {
    console.error("Failed to save quiz progress:", e);
  }
}

/**
 * Load quiz progress from localStorage
 * @returns {Object|null} Saved quiz progress or null
 */
export function loadQuizProgress() {
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch (e) {
    console.error("Failed to load quiz progress:", e);
  }
  return null;
}

/**
 * Clear quiz progress from localStorage
 */
export function clearQuizProgress() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.error("Failed to clear quiz progress:", e);
  }
}

/**
 * Select random questions from a pool
 * @param {Array} questions - Pool of questions
 * @param {number} count - Number of questions to select
 * @returns {Array} Random selection of questions
 */
export function selectRandomQuestions(questions, count = 20) {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((q) => ({
    ...q,
    selected: null,
    correct: null,
  }));
}

export const quizService = {
  fetchQuizQuestions,
  saveQuizProgress,
  loadQuizProgress,
  clearQuizProgress,
  selectRandomQuestions,
  getDefaultQuestions: () => DEFAULT_QUIZ_QUESTIONS,
};
