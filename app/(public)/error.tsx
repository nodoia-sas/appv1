"use client";

/**
 * Public Routes Error Boundary
 *
 * This component handles errors that occur in public routes.
 * Provides context-aware error handling for public sections.
 *
 * Requirements: 8.1, 8.5, 8.6
 */

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Public route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      {/* Keep the header structure for consistency */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary">
              Transitia
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/news"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Noticias
              </Link>
              <Link
                href="/regulations"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Regulaciones
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="space-y-2">
            <div className="text-6xl">📄</div>
            <h1 className="text-2xl font-semibold text-foreground">
              Error en contenido público
            </h1>
            <p className="text-muted-foreground">
              Ha ocurrido un error al cargar este contenido. Por favor, intenta
              nuevamente.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Intentar nuevamente
              </button>

              <Link
                href="/news"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Ver noticias
              </Link>
            </div>

            <div className="flex justify-center space-x-4 text-sm">
              <Link
                href="/regulations"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Regulaciones
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/glossary"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Glosario
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Inicio
              </Link>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="text-left text-sm text-muted-foreground bg-muted p-4 rounded">
                <summary className="cursor-pointer font-medium">
                  Detalles del error (desarrollo)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap break-words">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
