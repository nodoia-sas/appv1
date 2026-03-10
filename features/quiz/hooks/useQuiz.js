/**
 * useQuiz Hook
 * Manages quiz state, progress, and game logic
 */

import { useEffect, useState, useCallback } from "react";
import { quizService } from "../services/quizService";

export function useQuiz() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load quiz questions and restore progress on mount
  useEffect(() => {
    let mounted = true;

    const initializeQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizService.fetchQuizQuestions();
        const baseQuestions = Array.isArray(data)
          ? data.map((q) => ({ ...q, selected: null, correct: null }))
          : quizService.getDefaultQuestions();

        // Try to restore saved progress
        const savedProgress = quizService.loadQuizProgress();
        if (
          savedProgress &&
          Array.isArray(savedProgress.quizQuestions) &&
          savedProgress.quizQuestions.length > 0
        ) {
          if (mounted) {
            setQuizQuestions(savedProgress.quizQuestions);
            setCurrentQuestionIndex(savedProgress.currentQuestionIndex || 0);
            setCurrentScore(savedProgress.currentScore || 0);
            setQuizStarted(Boolean(savedProgress.quizStarted));
            setQuizCompleted(Boolean(savedProgress.quizCompleted));
          }
        } else {
          if (mounted) {
            setQuizQuestions(baseQuestions);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load quiz");
          console.error("Error loading quiz:", err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeQuiz();

    return () => {
      mounted = false;
    };
  }, []);

  // Persist quiz progress to localStorage
  useEffect(() => {
    if (!loading) {
      quizService.saveQuizProgress({
        quizQuestions,
        currentQuestionIndex,
        currentScore,
        quizStarted,
        quizCompleted,
      });
    }
  }, [
    quizQuestions,
    currentQuestionIndex,
    currentScore,
    quizStarted,
    quizCompleted,
    loading,
  ]);

  const selectRandomQuizQuestions = useCallback(() => {
    const selected = quizService.selectRandomQuestions(quizQuestions, 20);
    setQuizQuestions(selected);
    setCurrentScore(0);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
  }, [quizQuestions]);

  const startQuiz = () => {
    setQuizStarted(true);
    if (
      quizQuestions.length === 0 ||
      !quizQuestions[0].selected === undefined
    ) {
      selectRandomQuizQuestions();
    }
  };

  const handleAnswer = (questionId, selectedOption) => {
    const updatedQuestions = quizQuestions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            selected: selectedOption,
            correct: selectedOption === q.answer,
          }
        : q
    );
    setQuizQuestions(updatedQuestions);

    const answeredQuestion = updatedQuestions.find((q) => q.id === questionId);
    if (answeredQuestion && answeredQuestion.correct) {
      setCurrentScore((prev) => prev + 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setQuizCompleted(false);
    }
  };

  const resetQuiz = () => {
    selectRandomQuizQuestions();
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
  };

  const getKnowledgeRange = (score) => {
    const totalQuestions = quizQuestions.length;
    if (totalQuestions === 0) return "N/A";
    if (score === totalQuestions)
      return "Experto: ¡Dominas las normas de tránsito!";
    if (score >= totalQuestions * 0.8)
      return "Avanzado: ¡Excelente conocimiento vial!";
    if (score >= totalQuestions * 0.5)
      return "Intermedio: Vas por buen camino, ¡sigue practicando!";
    return "Principiante: Es hora de revisar las regulaciones, ¡puedes mejorar!";
  };

  return {
    quizQuestions,
    quizStarted,
    currentQuestionIndex,
    currentScore,
    quizCompleted,
    loading,
    error,
    startQuiz,
    handleAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    resetQuiz,
    getKnowledgeRange,
  };
}
