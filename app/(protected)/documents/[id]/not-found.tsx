/**
 * Document Not Found Page
 *
 * This page is displayed when a document with the given ID is not found.
 * Provides navigation options and context-specific messaging.
 *
 * Requirements: 8.1, 8.5, 8.6
 */

import Link from "next/link";

export default function DocumentNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <div className="text-6xl">📄</div>
          <h1 className="text-2xl font-semibold text-foreground">
            Documento no encontrado
          </h1>
          <p className="text-muted-foreground">
            El documento que buscas no existe o ha sido eliminado.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/documents"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Ver todos los documentos
            </Link>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Ir a mi perfil
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>¿No encuentras tu documento?</p>
            <ul className="mt-2 space-y-1">
              <li>• Verifica que el enlace sea correcto</li>
              <li>• Revisa si tienes permisos para verlo</li>
              <li>• Contacta soporte si persiste el problema</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
