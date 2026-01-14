/**
 * Quiz Feature Types
 */

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  imageUrl?: string;
  selected?: string | null;
  correct?: boolean | null;
}

export interface QuizState {
  quizQuestions: QuizQuestion[];
  quizStarted: boolean;
  currentQuestionIndex: number;
  currentScore: number;
  quizCompleted: boolean;
  loading: boolean;
  error: string | null;
}

export interface QuizProgress {
  quizQuestions: QuizQuestion[];
  currentQuestionIndex: number;
  currentScore: number;
  quizStarted: boolean;
  quizCompleted: boolean;
  updatedAt?: string;
}
