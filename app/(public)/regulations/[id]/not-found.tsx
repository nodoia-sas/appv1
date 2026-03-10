/**
 * Regulation Not Found Page
 *
 * This page is displayed when a regulation with the given ID is not found.
 * Provides navigation options and context-specific messaging.
 *
 * Requirements: 8.1, 8.5, 8.6
 */

import Link from "next/link";

export default function RegulationNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <div className="text-6xl">⚖️</div>
          <h1 className="text-2xl font-semibold text-foreground">
            Regulación no encontrada
          </h1>
          <p className="text-muted-foreground">
            La regulación que buscas no existe o ha sido actualizada.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/regulations"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Ver todas las regulaciones
            </Link>

            <Link
              href="/glossary"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Consultar glosario
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>¿Buscas información específica?</p>
            <ul className="mt-2 space-y-1">
              <li>• Usa el buscador en la página de regulaciones</li>
              <li>• Consulta el glosario de términos</li>
              <li>• Revisa las noticias más recientes</li>
            </ul>
          </div>

          <div className="flex justify-center space-x-4 text-sm">
            <Link
              href="/news"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Noticias
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/quiz"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Quiz
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
