import Link from "next/link";

/**
 * Not Found Page for News Details
 *
 * This page is displayed when a news article ID is not found.
 * Provides navigation options back to the news list.
 *
 * Requirements: 6.6
 */
export default function NewsNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-6">📰</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Noticia no encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          La noticia que buscas no existe o ha sido removida.
        </p>
        <div className="space-y-4">
          <Link
            href="/news"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todas las noticias
          </Link>
          <Link
            href="/"
            className="block text-gray-600 hover:text-gray-800 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
