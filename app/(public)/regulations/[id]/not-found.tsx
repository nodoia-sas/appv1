import Link from "next/link";

/**
 * Not Found Page for Regulation Details
 *
 * This page is displayed when a regulation ID is not found.
 * Provides navigation options back to the regulations list.
 *
 * Requirements: 6.6
 */
export default function RegulationNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-6">📋</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Regulación no encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          La regulación que buscas no existe o ha sido removida.
        </p>
        <div className="space-y-4">
          <Link
            href="/regulations"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todas las regulaciones
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
