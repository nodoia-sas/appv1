"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import RegulationSearchResults from "@/src/components/RegulationSearchResults";

/**
 * Componente interno que usa useSearchParams
 */
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-600 mb-2">
            No se especificó un término de búsqueda
          </p>
          <a
            href="/regulations"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Volver a la lista de leyes
          </a>
        </div>
      </div>
    );
  }

  return <RegulationSearchResults query={query} />;
}

/**
 * Página de resultados de búsqueda de regulaciones
 * Ruta: /regulations/search?q=término
 */
export default function RegulationSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando resultados...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
