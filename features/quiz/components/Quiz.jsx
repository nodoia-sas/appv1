"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuiz } from "../hooks/useQuiz";

export default function Quiz() {
  const {
    quizQuestions,
    quizStarted,
    currentQuestionIndex,
    currentScore,
    quizCompleted,
    startQuiz,
    handleAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    resetQuiz,
    getKnowledgeRange,
  } = useQuiz();

  const currentQuestion =
    quizQuestions && quizQuestions.length > 0
      ? quizQuestions[currentQuestionIndex]
      : null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
        Quiz de Tránsito
      </h2>
      <Link
        href="/"
        className="mb-4 bg-slate-200 text-slate-800 py-2 px-4 rounded-full text-sm hover:bg-slate-300 transition-colors duration-200 shadow-sm inline-block border border-slate-300"
      >
        ← Volver al Inicio
      </Link>

      {!quizStarted ? (
        <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 text-center mt-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            Aprende y pon a prueba tus conocimientos de tránsito
          </h3>
          <p className="text-slate-600 mb-6">
            Responde 20 preguntas aleatorias para evaluar tu dominio de las
            normas viales.
          </p>
          <button
            onClick={startQuiz}
            className="bg-indigo-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
          >
            Comenzar Quiz
          </button>
        </div>
      ) : quizCompleted ? (
        <div className="bg-indigo-50 p-5 rounded-xl shadow-md border border-indigo-200 text-center mt-8">
          <h3 className="text-xl font-bold text-indigo-800 mb-3">
            ¡Quiz Completado!
          </h3>
          <p className="text-lg text-indigo-700 mb-2">
            Tu puntuación:{" "}
            <span className="font-bold">
              {currentScore} / {quizQuestions.length}
            </span>
          </p>
          <p className="text-lg text-indigo-700 font-semibold">
            {getKnowledgeRange(currentScore)}
          </p>
          <button
            onClick={resetQuiz}
            className="mt-5 bg-indigo-600 text-white py-2 px-5 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
          >
            Reiniciar Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
            {currentQuestion && currentQuestion.imageUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={currentQuestion.imageUrl || "/placeholder.svg"}
                  alt="Imagen relacionada con el quiz"
                  className="rounded-lg max-h-32 object-cover"
                />
              </div>
            )}
            <h4 className="font-semibold text-slate-800 mb-3">
              {currentQuestion ? currentQuestion.question : ""}
            </h4>
            <div className="space-y-2">
              {currentQuestion &&
                currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(currentQuestion.id, option)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 shadow-sm
                    ${
                      currentQuestion.selected === option
                        ? currentQuestion.correct
                          ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                          : "bg-red-100 border-red-500 text-red-800"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                    disabled={currentQuestion.selected !== null}
                  >
                    {option}
                  </button>
                ))}
            </div>
            {currentQuestion && currentQuestion.selected !== null && (
              <p
                className={`mt-3 text-sm font-semibold ${
                  currentQuestion.correct ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {currentQuestion.correct
                  ? "¡Correcto!"
                  : `Incorrecto. La respuesta correcta es: ${currentQuestion.answer}`}
              </p>
            )}
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-slate-200 text-slate-800 py-2 px-4 rounded-full text-sm hover:bg-slate-300 transition-colors duration-200 shadow-sm disabled:opacity-50 border border-slate-300"
            >
              Anterior
            </button>
            <span className="text-slate-600 text-sm flex items-center">
              {currentQuestionIndex + 1} / {quizQuestions.length}
            </span>
            <button
              onClick={goToNextQuestion}
              disabled={
                currentQuestion &&
                currentQuestion.selected === null &&
                currentQuestionIndex < quizQuestions.length - 1
              }
              className="bg-indigo-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm disabled:opacity-50"
            >
              {currentQuestionIndex === quizQuestions.length - 1
                ? "Finalizar Quiz"
                : "Siguiente"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
