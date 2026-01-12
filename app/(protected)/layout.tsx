"use client";

import type React from "react";
import Header from "@/src/components/layout/Header";
import BottomNavigation from "@/src/components/layout/BottomNavigation";
import AuthGuard from "./components/AuthGuard";
import BreadcrumbSystem from "@/components/BreadcrumbSystem";
import { OfflineIndicator } from "@/lib/pwa";
import { useAuth } from "@/src/hooks/useAuth";
import { useNavigation } from "@/src/hooks/useNavigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthLayout - Layout for protected routes that require authentication
 *
 * This layout provides:
 * - Authentication guard that redirects unauthenticated users
 * - Authenticated header with user menu
 * - Bottom navigation for authenticated users
 * - Responsive design for mobile and desktop
 *
 * Requirements: 4.3, 4.4
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const { activeScreen, handleNavClick } = useNavigation();

  const handleMenuClick = (action: string) => {
    console.log("Auth menu action:", action);
    // TODO: Implement proper menu action handling
    handleNavClick(action);
  };

  const handleNotificationClick = () => {
    console.log("Auth notification click");
    // TODO: Implement proper notification handling
  };

  const handleNavigate = (
    screen: string,
    options?: { requiresAuth?: boolean }
  ) => {
    console.log("Auth navigate:", screen, options);
    handleNavClick(screen);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Offline Indicator */}
        <OfflineIndicator showDetails={true} position="top" />

        {/* Authenticated Header */}
        <Header
          user={user}
          isAuthenticated={isAuthenticated}
          onMenuClick={handleMenuClick}
          onNotificationClick={handleNotificationClick}
        />

        {/* Main content area with proper spacing for fixed header and bottom navigation */}
        <main
          className="flex-1 pt-20 pb-24 px-4 md:px-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full"
          style={{
            paddingTop: "calc(5rem + env(safe-area-inset-top))",
            paddingBottom: "calc(6rem + env(safe-area-inset-bottom))",
          }}
        >
          {/* Breadcrumb Navigation */}
          <BreadcrumbSystem className="mb-4" />

          {children}
        </main>

        {/* Bottom Navigation for authenticated users */}
        <BottomNavigation
          activeScreen={activeScreen}
          isAuthenticated={isAuthenticated}
          onNavigate={handleNavigate}
        />
      </div>
    </AuthGuard>
  );
}
