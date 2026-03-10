/**
 * News Article Not Found Page
 *
 * This page is displayed when a news article with the given ID is not found.
 * Provides navigation options and context-specific messaging.
 *
 * Requirements: 8.1, 8.5, 8.6
 */

import Link from "next/link";

export default function NewsNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <div className="text-6xl">📰</div>
          <h1 className="text-2xl font-semibold text-foreground">
            Noticia no encontrada
          </h1>
          <p className="text-muted-foreground">
            La noticia que buscas no existe o ha sido archivada.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/news"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Ver todas las noticias
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Volver al inicio
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Explora más contenido:</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                href="/regulations"
                className="hover:text-foreground transition-colors"
              >
                Regulaciones
              </Link>
              <span>•</span>
              <Link
                href="/glossary"
                className="hover:text-foreground transition-colors"
              >
                Glosario
              </Link>
              <span>•</span>
              <Link
                href="/quiz"
                className="hover:text-foreground transition-colors"
              >
                Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
