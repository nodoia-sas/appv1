"use client";
import React from "react";
import { usePqr } from "../hooks/usePqr";

export default function Pqr({ setActiveScreen }) {
  const { pqrQuestion, setPqrQuestion, handleSubmit, loading } = usePqr();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
        Preguntas, Quejas y Reclamos (PQR)
      </h2>
      <button
        onClick={() => setActiveScreen && setActiveScreen("home")}
        className="mb-4 bg-slate-200 text-slate-800 py-2 px-4 rounded-full text-sm hover:bg-slate-300 transition-colors duration-200 shadow-sm border border-slate-300"
      >
        ← Volver al Inicio
      </button>
      <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        <p className="text-slate-700 mb-4">
          ¿Tienes alguna pregunta sobre tránsito que te gustaría que incluimos
          en nuestra sección de Conocimiento? ¡Escríbenos!
        </p>
        <textarea
          className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4 resize-none"
          rows={6}
          placeholder="Escribe tu mensaje aquí"
          value={pqrQuestion}
          onChange={(e) => setPqrQuestion(e.target.value)}
          aria-label="Campo para escribir tu pregunta, queja o reclamo"
          disabled={loading}
        ></textarea>
        <button
          onClick={handleSubmit}
          disabled={loading || !pqrQuestion.trim()}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : "Enviar Pregunta"}
        </button>
      </div>
    </div>
  );
}
