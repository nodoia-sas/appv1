"use client";

import React from "react";
import Link from "next/link";
import { useNotifications } from "@/src/hooks/useNotifications";

/**
 * UnderConstructionComponent - Displays under construction message
 *
 * Maintains the same functionality as the original component but uses
 * Next.js routing and the platform's notification system for consistency.
 */
const UnderConstructionComponent = () => {
  const { showNotification } = useNotifications();

  const handleSubscribe = () => {
    try {
      const subs = JSON.parse(
        localStorage.getItem("transit-knowledge-subs") || "[]"
      );
      subs.push({ id: Date.now().toString(), date: new Date().toISOString() });
      localStorage.setItem("transit-knowledge-subs", JSON.stringify(subs));
      showNotification("Te avisaremos cuando el módulo esté listo", "success");
    } catch (e) {
      showNotification("No se pudo suscribir en este momento", "error");
    }
  };

  return (
    <div className="py-8 bg-background min-h-screen">
      {/* Main content card - consistent with platform styling */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-slate-200">
        {/* Icon or illustration area */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z"
              />
            </svg>
          </div>
        </div>

        {/* Title and description */}
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Módulo en construcción
        </h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Estamos trabajando en esta funcionalidad. Pronto estará disponible con
          contenido actualizado y nuevas características.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 min-w-[140px] shadow-sm"
          >
            Volver al inicio
          </Link>
          <button
            onClick={handleSubscribe}
            className="px-6 py-3 bg-slate-100 text-slate-800 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200 min-w-[140px] border border-slate-200"
          >
            Avisarme cuando esté listo
          </button>
        </div>
      </div>

      {/* Additional info section */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 mb-4">
          Mientras tanto, puedes explorar otras funcionalidades disponibles:
        </p>

        {/* Quick links to available features */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            //href="/news"
            href="/under-construction"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors duration-200 min-w-[140px] shadow-sm"
          >
            📰 Noticias
          </Link>
          <Link
            href="/regulations"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors duration-200 min-w-[140px] shadow-sm"
          >
            📋 Normatividad
          </Link>
          <Link
            href="/glossary"
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors duration-200 min-w-[140px] shadow-sm"
          >
            📖 Glosario
          </Link>
          <Link
            //href="/quiz"
            href="/under-construction"
            className="px-4 py-2 text-sm bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors duration-200 min-w-[140px] shadow-sm"
          >
            🎯 Quiz
          </Link>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400">
          Versión beta — contenido sujeto a cambios
        </p>
      </div>
    </div>
  );
};

export default UnderConstructionComponent;
