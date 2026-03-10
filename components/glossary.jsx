"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getAllGlossaries, searchGlossaryTerms } from "@/src/services/api";

const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 500;

export default function Glossary({ initialTerms = [] }) {
  const [glossarySearchTerm, setGlossarySearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [terms, setTerms] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fallbackTermsRef = useRef(initialTerms);
  const inputRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(glossarySearchTerm);
      if (glossarySearchTerm !== debouncedSearchTerm) {
        setCurrentPage(0);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [glossarySearchTerm, debouncedSearchTerm]);

  // Load glossary terms from API
  useEffect(() => {
    const loadGlossaries = async () => {
      // Store if input is focused before loading
      const wasInputFocused = document.activeElement === inputRef.current;

      setIsLoading(true);
      setError(null);
      try {
        let response;

        if (debouncedSearchTerm.trim()) {
          response = await searchGlossaryTerms(
            debouncedSearchTerm,
            currentPage,
            ITEMS_PER_PAGE
          );
        } else {
          response = await getAllGlossaries(currentPage, ITEMS_PER_PAGE);
        }

        setTerms(
          response.content.map((item) => ({
            term: item.wordName,
            explanation: item.wordValue,
          }))
        );
        setTotalElements(response.totalElements);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("Error loading glossaries:", err);
        setError("Error al cargar los términos del glosario");
        setTerms(fallbackTermsRef.current);
        setTotalElements(fallbackTermsRef.current.length);
        setTotalPages(1);
      } finally {
        setIsLoading(false);

        // Restore focus if it was focused before
        if (wasInputFocused && inputRef.current) {
          requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
        }
      }
    };

    loadGlossaries();
  }, [currentPage, debouncedSearchTerm]);

  const handleSearchChange = (e) => {
    setGlossarySearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startIndex = currentPage * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min((currentPage + 1) * ITEMS_PER_PAGE, totalElements);

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
          ref={inputRef}
          type="text"
          placeholder="Buscar término en el glosario..."
          className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
          value={glossarySearchTerm}
          onChange={handleSearchChange}
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
        {glossarySearchTerm !== debouncedSearchTerm && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>

      {!isLoading && totalElements > 0 && (
        <div className="mb-4 text-sm text-slate-600">
          {debouncedSearchTerm
            ? `${totalElements} resultado${
                totalElements !== 1 ? "s" : ""
              } para "${debouncedSearchTerm}"`
            : `Mostrando ${startIndex}-${endIndex} de ${totalElements} términos`}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-slate-600">Cargando términos...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-[400px]">
          {terms.length === 0 ? (
            <p className="text-slate-600 text-center">
              {debouncedSearchTerm
                ? `No se encontraron términos para "${debouncedSearchTerm}".`
                : "No hay términos disponibles."}
            </p>
          ) : (
            terms.map((term, index) => (
              <div
                key={`${term.term}-${index}`}
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
      )}

      {totalPages > 1 && !isLoading && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Página anterior"
          >
            ← Anterior
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i).map((page) => {
              const showPage =
                page === 0 ||
                page === totalPages - 1 ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 py-2 text-slate-600">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                  }`}
                  aria-label={`Página ${page + 1}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Página siguiente"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
