"use client";

import React, { useState } from "react";
import { RegulationDto, GlossaryDto } from "../types/transit-models";

/**
 * Resultado de búsqueda combinado
 * Puede ser una regulación o un término del glosario
 */
interface SearchResult {
  type: "regulation" | "glossary";
  data: RegulationDto | GlossaryDto;
}

/**
 * SmartSearch Component
 *
 * Componente de búsqueda inteligente que busca simultáneamente en regulaciones y glosario.
 * Implementa debounce para optimizar las llamadas a la API.
 *
 * Requirements: 7.1
 */
const SmartSearch: React.FC = () => {
  // Estados del componente
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Maneja el cambio en el input de búsqueda
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input de búsqueda */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Buscar regulaciones o términos del glosario..."
          className="w-full px-4 py-3 pr-10 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          aria-label="Búsqueda inteligente"
        />

        {/* Icono de búsqueda */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Placeholder para resultados (se implementará en tareas posteriores) */}
      {loading && <div className="mt-2 text-sm text-gray-500">Buscando...</div>}

      {results.length > 0 && (
        <div className="mt-2 text-sm text-gray-500">
          {results.length} resultado(s) encontrado(s)
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
