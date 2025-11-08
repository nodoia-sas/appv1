"use client"
import React, { useEffect, useState, useCallback } from "react"
import { DEFAULT_QUIZ_QUESTIONS, fetchQuizQuestions } from "../lib/quiz-utils"

export default function Quiz({ setActiveScreen }) {
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentScore, setCurrentScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await fetchQuizQuestions()
      const base = Array.isArray(data) ? data.map((q) => ({ ...q, selected: null, correct: null })) : DEFAULT_QUIZ_QUESTIONS

      // Try to restore saved progress if available
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('transit-quiz-progress') : null
        if (raw) {
          const saved = JSON.parse(raw)
          if (saved && Array.isArray(saved.quizQuestions) && saved.quizQuestions.length > 0) {
            if (mounted) {
              setQuizQuestions(saved.quizQuestions)
              setCurrentQuestionIndex(saved.currentQuestionIndex || 0)
              setCurrentScore(saved.currentScore || 0)
              setQuizStarted(Boolean(saved.quizStarted))
              setQuizCompleted(Boolean(saved.quizCompleted))
            }
            return
          }
        }
      } catch (e) {
        // ignore and continue with base questions
      }

      if (mounted) setQuizQuestions(base)
    })()
    return () => (mounted = false)
  }, [])

  const selectRandomQuizQuestions = useCallback(() => {
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random())
    const selected20 = shuffled.slice(0, 20).map((q) => ({ ...q, selected: null, correct: null }))
    setQuizQuestions(selected20)
    setCurrentScore(0)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
  }, [quizQuestions])

  useEffect(() => {
    if (quizStarted && quizQuestions.length === 0) selectRandomQuizQuestions()
  }, [quizStarted, quizQuestions.length, selectRandomQuizQuestions])

  const handleQuizAnswer = (questionId, selectedOption) => {
    const updatedQuizQuestions = quizQuestions.map((q) =>
      q.id === questionId ? { ...q, selected: selectedOption, correct: selectedOption === q.answer } : q,
    )
    setQuizQuestions(updatedQuizQuestions)
    const answeredQuestion = updatedQuizQuestions.find((q) => q.id === questionId)
    if (answeredQuestion && answeredQuestion.correct) setCurrentScore((prev) => prev + 1)
  }

  // Persist quiz progress to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const payload = {
          quizQuestions,
          currentQuestionIndex,
          currentScore,
          quizStarted,
          quizCompleted,
          updatedAt: new Date().toISOString(),
        }
        localStorage.setItem('transit-quiz-progress', JSON.stringify(payload))
      }
    } catch (e) {
      // ignore
    }
  }, [quizQuestions, currentQuestionIndex, currentScore, quizStarted, quizCompleted])

  const resetQuiz = () => {
    selectRandomQuizQuestions()
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
      setQuizCompleted(false)
    }
  }

  const getKnowledgeRange = (score) => {
    const totalQuestions = quizQuestions.length
    if (totalQuestions === 0) return "N/A"
    if (score === totalQuestions) return "Experto: ¡Dominas las normas de tránsito!"
    if (score >= totalQuestions * 0.8) return "Avanzado: ¡Excelente conocimiento vial!"
    if (score >= totalQuestions * 0.5) return "Intermedio: Vas por buen camino, ¡sigue practicando!"
    return "Principiante: Es hora de revisar las regulaciones, ¡puedes mejorar!"
  }

  const currentQuestion = quizQuestions && quizQuestions.length > 0 ? quizQuestions[currentQuestionIndex] : null

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Quiz de Tránsito</h2>
      <button
        onClick={() => {
          setActiveScreen("home")
          setQuizStarted(false)
        }}
        className="mb-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md"
      >
        ← Volver al Inicio
      </button>

      {!quizStarted ? (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 text-center mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Aprende y pon a prueba tus conocimientos de tránsito</h3>
          <p className="text-gray-600 mb-6">Responde 20 preguntas aleatorias para evaluar tu dominio de las normas viales.</p>
          <button
            onClick={() => {
              setQuizStarted(true)
              selectRandomQuizQuestions()
            }}
            className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Comenzar Quiz
          </button>
        </div>
      ) : quizCompleted ? (
        <div className="bg-blue-100 p-5 rounded-xl shadow-md border border-blue-300 text-center mt-8">
          <h3 className="text-xl font-bold text-blue-800 mb-3">¡Quiz Completado!</h3>
          <p className="text-lg text-blue-700 mb-2">
            Tu puntuación: <span className="font-bold">{currentScore} / {quizQuestions.length}</span>
          </p>
          <p className="text-lg text-blue-700 font-semibold">{getKnowledgeRange(currentScore)}</p>
          <button
            onClick={resetQuiz}
            className="mt-5 bg-blue-600 text-white py-2 px-5 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Reiniciar Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            {currentQuestion && currentQuestion.imageUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={currentQuestion.imageUrl || "/placeholder.svg"}
                  alt="Imagen relacionada con el quiz"
                  className="rounded-lg max-h-32 object-cover"
                />
              </div>
            )}
            <h4 className="font-semibold text-gray-800 mb-3">{currentQuestion ? currentQuestion.question : ""}</h4>
            <div className="space-y-2">
              {currentQuestion && currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(currentQuestion.id, option)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 shadow-sm
                    ${
                      currentQuestion.selected === option
                        ? currentQuestion.correct
                          ? "bg-green-100 border-green-500 text-green-800"
                          : "bg-red-100 border-red-500 text-red-800"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  disabled={currentQuestion.selected !== null}
                >
                  {option}
                </button>
              ))}
            </div>
            {currentQuestion && currentQuestion.selected !== null && (
              <p className={`mt-3 text-sm font-semibold ${currentQuestion.correct ? "text-green-600" : "text-red-600"}`}>
                {currentQuestion.correct ? "¡Correcto!" : `Incorrecto. La respuesta correcta es: ${currentQuestion.answer}`}
              </p>
            )}
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-full text-sm hover:bg-gray-400 transition-colors duration-200 shadow-md disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-600 text-sm flex items-center">{currentQuestionIndex + 1} / {quizQuestions.length}</span>
            <button
              onClick={goToNextQuestion}
              disabled={currentQuestion && currentQuestion.selected === null && currentQuestionIndex < quizQuestions.length - 1}
              className="bg-blue-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:opacity-50"
            >
              {currentQuestionIndex === quizQuestions.length - 1 ? "Finalizar Quiz" : "Siguiente"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
