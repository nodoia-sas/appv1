import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRegulationById } from "../services/api";
import { RegulationDto } from "../types/transit-models";
import { ApiError } from "../services/api";

// AI Icon Component - Requirement 6.6
const AIIcon: React.FC = () => (
  <svg
    className="w-5 h-5 inline-block"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L12.75 18.75l1.933-.394a2.25 2.25 0 001.423-1.423l.394-1.933.394 1.933a2.25 2.25 0 001.423 1.423l1.933.394-1.933.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

/**
 * Props para el componente RegulationDetail
 */
interface RegulationDetailProps {
  regulationId: string;
}

/**
 * Componente RegulationDetail
 * Muestra los detalles completos de una regulación específica
 *
 * Requirements: 6.1, 6.7, 6.8
 */
const RegulationDetail: React.FC<RegulationDetailProps> = ({
  regulationId,
}) => {
  const router = useRouter();

  // Estado para almacenar la regulación cargada
  const [regulation, setRegulation] = useState<RegulationDto | null>(null);

  // Estado para indicar si los datos están cargando
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para almacenar mensajes de error
  const [error, setError] = useState<string | null>(null);

  /**
   * Función para volver a la página anterior
   */
  const handleGoBack = () => {
    router.back();
  };

  /**
   * Función para cargar los datos de la regulación
   * Separada del useEffect para permitir retry (Requirement 9.4)
   */
  const fetchRegulation = async () => {
    try {
      // Resetear estados antes de cargar
      setLoading(true);
      setError(null);

      // Llamar a la API para obtener la regulación
      const data = await getRegulationById(regulationId);

      // Actualizar el estado con los datos obtenidos
      setRegulation(data);
    } catch (err) {
      // Manejar errores de la API
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al cargar la regulación.");
      }

      // Log del error para debugging (Requirement 9.5)
      console.error("Error loading regulation:", err);
    } finally {
      // Siempre actualizar el estado de loading al finalizar
      setLoading(false);
    }
  };

  /**
   * Efecto para cargar los datos de la regulación al montar el componente
   * o cuando cambia el regulationId
   */
  useEffect(() => {
    fetchRegulation();
  }, [regulationId]);

  // Renderizar estado de carga con skeleton loader (Requirement 9.1)
  // El skeleton coincide con la estructura del split view
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title Skeleton */}
        <div className="h-10 bg-gray-200 rounded w-2/3 mb-8 animate-pulse"></div>

        {/* Split View Skeleton Container */}
        <div className="flex flex-col md:flex-row gap-0 shadow-xl rounded-lg overflow-hidden border border-gray-200">
          {/* Left Column Skeleton - Legal Text */}
          <div className="w-full md:w-2/5 lg:w-1/2 bg-white p-8 lg:p-10 md:border-r-2 border-gray-300">
            {/* Article Number Badge Skeleton */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>

            {/* Legal Content Skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>

          {/* Right Column Skeleton - IA Explanation */}
          <div className="w-full md:w-3/5 lg:w-1/2 bg-blue-50 p-8 lg:p-10">
            {/* IA Explanation Header Skeleton */}
            <div className="mb-4">
              <div className="h-6 bg-blue-200 rounded w-48 animate-pulse"></div>
            </div>

            {/* IA Explanation Content Skeleton */}
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
              <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
              <div className="h-4 bg-blue-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
              <div className="h-4 bg-blue-200 rounded w-4/5 animate-pulse"></div>
            </div>

            {/* Examples Header Skeleton */}
            <div className="mb-4">
              <div className="h-6 bg-blue-200 rounded w-32 animate-pulse"></div>
            </div>

            {/* Examples Content Skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
              <div className="h-4 bg-blue-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar estado de error con botón de retry (Requirements 9.2, 9.4)
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-lg border border-red-200">
            {/* Error Icon */}
            <div className="text-red-500 text-6xl mb-4">⚠️</div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Error al cargar la regulación
            </h2>

            {/* Error Message - Requirement 9.2 */}
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>

            {/* Retry Button - Requirement 9.4 */}
            <button
              onClick={fetchRegulation}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar contenido de la regulación
  if (!regulation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No se encontró la regulación.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4 transition-colors duration-200"
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
        Volver
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        {regulation.title}
      </h1>

      {/* Split View Container - Requirements: 6.1, 6.4, 6.5, 8.1, 8.3, 8.4 */}
      {/* Mobile (<768px): stacked vertically */}
      {/* Tablet (768px-1023px): 40/60 side by side */}
      {/* Desktop (≥1024px): 50/50 side by side */}
      <div className="flex flex-col md:flex-row gap-0 shadow-xl rounded-lg overflow-hidden border border-gray-200">
        {/* Left Column - Legal Text - Requirements: 6.2, 8.1, 8.3, 8.4 */}
        <div className="w-full md:w-2/5 lg:w-1/2 bg-white p-8 lg:p-10 md:border-r-2 border-gray-300">
          {/* Article Number Badge */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <span className="inline-block px-3 py-1 bg-gray-100 rounded-md">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-sans">
                Artículo{" "}
              </span>
              <span className="text-sm font-bold text-gray-900 font-sans">
                {regulation.articleNumber}
              </span>
            </span>
          </div>

          {/* Legal Content - Requirement 6.2: serif font, white bg, justified text */}
          <div className="prose prose-lg max-w-none">
            <p
              className="text-gray-900 leading-relaxed text-justify"
              style={{ fontFamily: "Merriweather, Georgia, serif" }}
            >
              {regulation.content}
            </p>
          </div>
        </div>

        {/* Right Column - IA Explanation - Requirements: 6.3, 6.6, 8.1, 8.3, 8.4 */}
        <div className="w-full md:w-3/5 lg:w-1/2 bg-blue-50 p-8 lg:p-10">
          {regulation.iaExplanation && (
            <div className="mb-8">
              {/* IA Explanation Header with Icon - Requirement 6.6 */}
              <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2 font-sans">
                <span className="text-blue-600">
                  <AIIcon />
                </span>
                Explicación IA
              </h3>
              {/* IA Explanation Content - Requirement 6.3: sans-serif font, light bg, left-aligned */}
              <p
                className="text-gray-700 leading-relaxed text-left"
                style={{ fontFamily: "Inter, Roboto, sans-serif" }}
              >
                {regulation.iaExplanation}
              </p>
            </div>
          )}

          {regulation.examples && (
            <div>
              {/* Examples Header with Icon - Requirement 6.6 */}
              <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2 font-sans">
                <span className="text-blue-600">
                  <AIIcon />
                </span>
                Ejemplos
              </h3>
              {/* Examples Content - Requirement 6.3: sans-serif font, light bg, left-aligned */}
              <p
                className="text-gray-700 leading-relaxed text-left"
                style={{ fontFamily: "Inter, Roboto, sans-serif" }}
              >
                {regulation.examples}
              </p>
            </div>
          )}

          {!regulation.iaExplanation && !regulation.examples && (
            <div className="text-gray-500 text-left italic font-sans">
              <p className="flex items-center gap-2">
                <span className="text-blue-400">
                  <AIIcon />
                </span>
                No hay explicación IA disponible para este artículo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegulationDetail;
