import React, { useState, useEffect } from "react";
import { getRegulationsByLawId, getLawById } from "../services/api";
import { RegulationDto, LawDto } from "../types/transit-models";
import { ApiError } from "../services/api";
import Link from "next/link";

/**
 * Props para el componente LawArticles
 */
interface LawArticlesProps {
  lawId: string;
}

/**
 * Componente LawArticles
 * Muestra la lista paginada de artículos de una ley específica
 *
 * Requirements: Mostrar artículos de una ley con paginación de 10 en 10
 */
const LawArticles: React.FC<LawArticlesProps> = ({ lawId }) => {
  // Estado para almacenar la ley
  const [law, setLaw] = useState<LawDto | null>(null);

  // Estado para almacenar los artículos
  const [articles, setArticles] = useState<RegulationDto[]>([]);

  // Estado para indicar si los datos están cargando
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para almacenar mensajes de error
  const [error, setError] = useState<string | null>(null);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  /**
   * Función para cargar los datos de la ley y sus artículos
   */
  const fetchData = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      // Cargar información de la ley y sus artículos en paralelo
      const [lawData, articlesData] = await Promise.all([
        getLawById(lawId),
        getRegulationsByLawId(lawId, page),
      ]);

      setLaw(lawData);
      setArticles(articlesData.content);
      setTotalPages(articlesData.totalPages);
      setTotalElements(articlesData.totalElements);
      setCurrentPage(page);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al cargar los artículos.");
      }

      console.error("Error loading law articles:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Efecto para cargar los datos al montar el componente
   */
  useEffect(() => {
    fetchData(0);
  }, [lawId]);

  /**
   * Manejador para cambiar de página
   */
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchData(newPage);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Renderizar estado de carga con skeleton loader
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title Skeleton */}
        <div className="h-10 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>

        {/* Articles Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Renderizar estado de error con botón de retry
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-lg border border-red-200">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Error al cargar los artículos
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => fetchData(currentPage)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar contenido
  if (!law || articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <p className="text-gray-600">
            No se encontraron artículos para esta ley.
          </p>
          <Link
            href="/regulations"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            ← Volver a la lista de leyes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header con información de la ley */}
      <div className="mb-8">
        <Link
          href="/regulations"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a Leyes
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{law.title}</h1>
        <p className="text-gray-600 mb-2">{law.description}</p>
        {law.iaExplanation && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">✨</span>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Explicación IA
                </p>
                <p className="text-sm text-blue-800">{law.iaExplanation}</p>
              </div>
            </div>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Total de artículos: {totalElements}
        </p>
      </div>

      {/* Lista de artículos */}
      <div className="space-y-4 mb-8">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-md text-sm font-semibold text-gray-900 mr-3">
                    Artículo {article.articleNumber}
                  </span>
                  {article.active && (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Activo
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {article.content}
                </p>
                {article.iaExplanation && (
                  <div className="mt-3 flex items-start text-sm text-blue-600">
                    <span className="mr-1">✨</span>
                    <span className="line-clamp-2">
                      {article.iaExplanation}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Link
              href={`/regulations/${article.id}`}
              className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Ver detalle completo
            </Link>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Anterior
          </button>

          <span className="text-sm text-gray-700">
            Página {currentPage + 1} de {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default LawArticles;
