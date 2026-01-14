"use client";
import React from "react";
import Link from "next/link";

/**
 * Regulations Component
 * Displays a list of traffic regulations with navigation
 */
export default function Regulations({
  regulationsData,
  setSelectedRegulation,
}) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
        Normatividad Vial
      </h2>
      <Link
        href="/"
        className="mb-4 bg-slate-200 text-slate-800 py-2 px-4 rounded-full text-sm hover:bg-slate-300 transition-colors duration-200 shadow-sm inline-block border border-slate-300"
      >
        ← Volver al Inicio
      </Link>
      <p className="text-slate-600 text-center mb-6">
        Principales normas de tránsito en Colombia.
      </p>
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {regulationsData.map((regulation) => (
          <div
            key={regulation.id}
            className="bg-white p-5 rounded-xl shadow-md border border-slate-200 transition-all duration-200 hover:shadow-lg hover:border-indigo-200"
          >
            <h3 className="font-semibold text-slate-800 text-lg mb-2">
              {regulation.title}
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {regulation.summary}
            </p>
            <Link
              href={`/regulations/${regulation.id}`}
              className="mt-4 inline-block bg-indigo-500 text-white py-2 px-4 rounded-full text-sm hover:bg-indigo-600 transition-colors duration-200 shadow-sm hover:shadow-md"
              aria-label={`Ver detalle de ${regulation.title}`}
            >
              Ver en detalle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
