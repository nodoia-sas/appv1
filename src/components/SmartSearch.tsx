"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
 * Requirements: 7.1, 7.2, 3.5, 7.8
 */
const SmartSearch: React.FC = () => {
  // Hook de navegación de Next.js
  const router = useRouter();

  // Estados del componente
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Ref para almacenar el timeout del debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Maneja el click en un resultado de búsqueda
   * Navega a la página de detalle correspondiente y limpia los resultados
   * Requirements: 7.8
   */
  const handleResultClick = (result: SearchResult) => {
    if (result.type === "regulation") {
      const regulation = result.data as RegulationDto;
      // Navegar a la página de detalle de la regulación
      router.push(`/regulations/${regulation.id}`);
    } else if (result.type === "glossary") {
      const glossary = result.data as GlossaryDto;
      // Navegar a la página de glosario (actualmente no hay página de detalle individual)
      // Por ahora navegamos a la página principal del glosario
      router.push(`/glossary`);
    }

    // Limpiar resultados después de la navegación
    setResults([]);
    setQuery("");
  };

  /**
   * Maneja el cambio en el input de búsqueda
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  /**
   * Función que ejecuta la búsqueda dual en regulaciones y glosario
   * Llama ambas APIs en paralelo usando Promise.all
   * Requirements: 7.3
   */
  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      // Importar funciones de API dinámicamente para evitar problemas de importación circular
      const { searchRegulations, searchGlossaryTerms } = await import(
        "../services/api"
      );

      // Ejecutar ambas búsquedas en paralelo
      const [regulationsResponse, glossaryResponse] = await Promise.all([
        searchRegulations(searchQuery, 0),
        searchGlossaryTerms(searchQuery, 0),
      ]);

      // Combinar resultados en un array de SearchResult
      const combinedResults: SearchResult[] = [];

      // Agregar regulaciones al array de resultados
      if (
        regulationsResponse.content &&
        regulationsResponse.content.length > 0
      ) {
        regulationsResponse.content.forEach((regulation) => {
          combinedResults.push({
            type: "regulation",
            data: regulation,
          });
        });
      }

      // Agregar términos del glosario al array de resultados
      if (glossaryResponse.content && glossaryResponse.content.length > 0) {
        glossaryResponse.content.forEach((glossaryTerm) => {
          combinedResults.push({
            type: "glossary",
            data: glossaryTerm,
          });
        });
      }

      setResults(combinedResults);
    } catch (error) {
      // Manejar errores de ambas búsquedas
      // Enhanced error logging (Requirement 9.5)
      if (error instanceof Error) {
        console.error("SmartSearch - Search error:", {
          query: searchQuery,
          message: error.message,
          name: error.name,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error("SmartSearch - Unknown search error:", {
          query: searchQuery,
          error,
          timestamp: new Date().toISOString(),
        });
      }
      // En caso de error, limpiar resultados
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Efecto para implementar debounce en la búsqueda
   * - Espera 300ms después del último cambio antes de buscar
   * - Cancela búsqueda si query < 2 caracteres
   * Requirements: 7.2, 3.5
   */
  useEffect(() => {
    // Limpiar el timer anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Si el query está vacío o tiene menos de 2 caracteres, limpiar resultados
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Configurar nuevo timer de debounce (300ms)
    debounceTimerRef.current = setTimeout(() => {
      performSearch(query.trim());
    }, 300);

    // Cleanup: cancelar el timer cuando el componente se desmonte o query cambie
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]); // Ejecutar efecto cada vez que query cambie

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input de búsqueda */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Buscar regulaciones o términos del glosario..."
          className="w-full px-4 py-3 pr-10 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Búsqueda inteligente"
          disabled={loading}
        />

        {/* Spinner inline o icono de búsqueda */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
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
          )}
        </div>
      </div>

      {/* Contenedor de resultados */}
      {!loading && results.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Agrupar resultados por tipo */}
          {(() => {
            // Separar regulaciones y glosario
            const regulations = results.filter((r) => r.type === "regulation");
            const glossaryItems = results.filter((r) => r.type === "glossary");

            return (
              <>
                {/* Sección de Regulaciones */}
                {regulations.length > 0 && (
                  <div className="border-b border-gray-200 last:border-b-0">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Regulaciones ({regulations.length})
                      </h3>
                    </div>
                    <div>
                      {regulations.map((result, index) => {
                        const regulation = result.data as RegulationDto;
                        // Truncar contenido a 100 caracteres
                        const truncatedContent =
                          regulation.content.length > 100
                            ? regulation.content.substring(0, 100) + "..."
                            : regulation.content;

                        return (
                          <div
                            key={`regulation-${regulation.id}-${index}`}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleResultClick(result)}
                          >
                            <div className="flex items-start">
                              <div className="shrink-0 mr-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {regulation.articleNumber}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {truncatedContent}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sección de Glosario */}
                {glossaryItems.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Glosario ({glossaryItems.length})
                      </h3>
                    </div>
                    <div>
                      {glossaryItems.map((result, index) => {
                        const glossary = result.data as GlossaryDto;
                        // Truncar definición a 80 caracteres
                        const truncatedDefinition =
                          glossary.wordValue.length > 80
                            ? glossary.wordValue.substring(0, 80) + "..."
                            : glossary.wordValue;

                        return (
                          <div
                            key={`glossary-${glossary.id}-${index}`}
                            className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleResultClick(result)}
                          >
                            <div className="flex items-start">
                              <div className="shrink-0 mr-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {glossary.wordName}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {truncatedDefinition}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {!loading && query.trim().length >= 2 && results.length === 0 && (
        <div className="mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            No se encontraron resultados para "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
