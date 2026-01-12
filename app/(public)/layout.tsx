"use client";

import type React from "react";
import Header from "@/src/components/layout/Header";
import BreadcrumbSystem from "@/components/BreadcrumbSystem";
import { OfflineIndicator } from "@/lib/pwa";
import { useNavigationCompat } from "@/lib/navigation";

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
  const { navigate } = useNavigationCompat();

  // Proper navigation handlers using the new navigation system
  const handleMenuClick = (action: string) => {
    console.log("Public menu action:", action);

    // Handle navigation actions
    switch (action) {
      case "terms":
        navigate("terms");
        break;
      case "help-contact":
        navigate("help-contact");
        break;
      case "login":
        // Redirect to Auth0 login
        if (typeof window !== "undefined") {
          window.location.href = "/api/auth/login";
        }
        break;
      default:
        console.log("Unhandled menu action:", action);
        break;
    }
  };

  const handleNotificationClick = () => {
    console.log("Public notification click");
    // For public users, redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/api/auth/login";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Offline Indicator */}
      <OfflineIndicator showDetails={true} position="top" />

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
        {/* Breadcrumb Navigation */}
        <BreadcrumbSystem className="mb-4" />

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
                onClick={() => navigate("terms")}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Términos y Privacidad
              </button>
              <button
                onClick={() => navigate("help-contact")}
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
