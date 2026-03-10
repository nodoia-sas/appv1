import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Página no encontrada
          </h2>
          <p className="text-muted-foreground">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Volver al inicio
          </Link>

          <div className="text-sm text-muted-foreground">
            <p>¿Necesitas ayuda? Puedes:</p>
            <ul className="mt-2 space-y-1">
              <li>• Verificar la URL</li>
              <li>• Usar el menú de navegación</li>
              <li>• Contactar soporte técnico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
