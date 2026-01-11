"use client";

/**
 * Documents Section Error Boundary
 *
 * This component handles errors that occur in the documents section.
 * Provides context-aware error handling for document management.
 *
 * Requirements: 8.1, 8.5, 8.6
 */

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DocumentsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Documents section error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <div className="text-6xl">📄</div>
          <h1 className="text-2xl font-semibold text-foreground">
            Error en documentos
          </h1>
          <p className="text-muted-foreground">
            Ha ocurrido un error al cargar tus documentos. Esto puede deberse a
            un problema de conexión o de sincronización.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Recargar documentos
            </button>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Ir a mi perfil
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Mientras tanto, puedes:</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                href="/vehicles"
                className="hover:text-foreground transition-colors"
              >
                Ver vehículos
              </Link>
              <span>•</span>
              <Link
                href="/pqr"
                className="hover:text-foreground transition-colors"
              >
                Crear PQR
              </Link>
            </div>
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
  );
}
