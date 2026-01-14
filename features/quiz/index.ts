/**
 * Quiz Feature - Barrel Export
 * Public API for the quiz feature
 */

export { default as Quiz } from "./components/Quiz";
export { useQuiz } from "./hooks/useQuiz";
export { quizService } from "./services/quizService";
export type { QuizQuestion, QuizState, QuizProgress } from "./types";
