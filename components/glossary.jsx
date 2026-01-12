"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Glossary({ initialTerms = [] }) {
  const [glossarySearchTerm, setGlossarySearchTerm] = useState("");

  // Filter terms based on search
  const filteredGlossaryTerms = initialTerms.filter(
    (term) =>
      term.term.toLowerCase().includes(glossarySearchTerm.toLowerCase()) ||
      term.explanation.toLowerCase().includes(glossarySearchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
        Glosario de Tránsito
      </h2>
      <Link
        href="/"
        className="mb-4 bg-slate-200 text-slate-800 py-2 px-4 rounded-full text-sm hover:bg-slate-300 transition-colors duration-200 shadow-sm inline-block border border-slate-300"
      >
        ← Volver al Inicio
      </Link>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar término en el glosario..."
          className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
          value={glossarySearchTerm}
          onChange={(e) => setGlossarySearchTerm(e.target.value)}
          aria-label="Buscar término en el glosario"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="11"
              cy="11"
              r="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
      <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {filteredGlossaryTerms.length === 0 ? (
          <p className="text-slate-600 text-center">
            No se encontraron términos para tu búsqueda.
          </p>
        ) : (
          filteredGlossaryTerms.map((term, index) => (
            <div
              key={index}
              className="bg-white p-4 my-2 rounded-xl shadow-md border border-slate-200 hover:border-indigo-200 transition-colors duration-200"
            >
              <h3 className="font-bold text-lg text-slate-800 mb-1">
                {term.term}
              </h3>
              <p className="text-slate-700 text-sm">{term.explanation}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
