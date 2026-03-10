"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Regulations Component
 * Displays a list of traffic regulations (laws) with navigation and pagination
 */
export default function Regulations({
  regulationsData,
  setSelectedRegulation,
  pagination,
  onPageChange,
  loading,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirigir a la página de búsqueda con el query
      router.push(`/regulations/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

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
      <p className="text-slate-600 text-center mb-2">
        Principales normas de tránsito en Colombia.
      </p>

      {/* Panel de búsqueda */}
      <form onSubmit={handleSearch} className="mb-6 max-w-2xl mx-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar artículos por contenido..."
              className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!searchTerm.trim()}
            className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors duration-200 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔍 Buscar
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Busca artículos específicos por su contenido o título
        </p>
      </form>

      {pagination && (
        <p className="text-sm text-slate-500 text-center mb-6">
          Mostrando {regulationsData.length} de {pagination.totalElements} leyes
        </p>
      )}

      {loading ? (
        // Skeleton loader
        <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-md border border-slate-200"
            >
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 mb-6">
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
                  href={`/regulations/laws/${regulation.id}`}
                  className="mt-4 inline-block bg-indigo-500 text-white py-2 px-4 rounded-full text-sm hover:bg-indigo-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                  aria-label={`Ver artículos de ${regulation.title}`}
                >
                  Ver artículos
                </Link>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-6">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.isFirst}
                className="px-4 py-2 bg-white border border-slate-300 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
              >
                ← Anterior
              </button>

              <span className="text-sm text-slate-700 font-medium">
                Página {pagination.currentPage + 1} de {pagination.totalPages}
              </span>

              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.isLast}
                className="px-4 py-2 bg-white border border-slate-300 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
