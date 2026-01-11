import type React from "react";
import Header from "@/src/components/layout/Header";

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * PublicLayout - Layout for public routes that don't require authentication
 *
 * This layout provides:
 * - Public header with login/register options
 * - Footer with public information
 * - Responsive design for mobile and desktop
 *
 * Requirements: 4.5, 4.6
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  // Mock handlers for now - these will be replaced with proper navigation hooks
  const handleMenuClick = (action: string) => {
    console.log("Public menu action:", action);
    // TODO: Implement proper navigation handling
  };

  const handleNotificationClick = () => {
    console.log("Public notification click");
    // TODO: Implement proper notification handling
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Public Header */}
      <Header
        user={null}
        isAuthenticated={false}
        onMenuClick={handleMenuClick}
        onNotificationClick={handleNotificationClick}
      />

      {/* Main content area with proper spacing for fixed header */}
      <main
        className="flex-1 pt-20 px-4 md:px-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full"
        style={{
          paddingTop: "calc(5rem + env(safe-area-inset-top))",
        }}
      >
        {children}
      </main>

      {/* Public Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 md:px-6">
        <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              © 2024 TransitIA - Tu asesor inteligente de tránsito
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleMenuClick("terms")}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Términos y Privacidad
              </button>
              <button
                onClick={() => handleMenuClick("help-contact")}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ayuda y Contacto
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
