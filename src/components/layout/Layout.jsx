"use client";

import Header from "./Header";
import BottomNavigation from "./BottomNavigation";

/**
 * Layout component that composes Header, content area, and BottomNavigation
 * Handles responsive design and safe areas for the application
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered in the main area
 * @param {Object|null} props.user - Current user object (null if not authenticated)
 * @param {boolean} props.isAuthenticated - Whether user is currently authenticated
 * @param {string} props.activeScreen - Currently active screen identifier
 * @param {Function} props.onMenuClick - Callback for header menu item clicks
 * @param {Function} props.onNotificationClick - Callback for notification button click
 * @param {Function} props.onNavigate - Callback for navigation changes
 */
const Layout = ({
  children,
  user,
  isAuthenticated = false,
  activeScreen = "home",
  onMenuClick,
  onNotificationClick,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        user={user}
        isAuthenticated={isAuthenticated}
        onMenuClick={onMenuClick}
        onNotificationClick={onNotificationClick}
      />

      {/* Main content area with proper spacing for fixed header and bottom navigation */}
      <main
        className="flex-1 pt-20 pb-24 px-4 md:px-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full"
        style={{
          paddingTop: "calc(5rem + env(safe-area-inset-top))",
          paddingBottom: "calc(6rem + env(safe-area-inset-bottom))",
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeScreen={activeScreen}
        isAuthenticated={isAuthenticated}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default Layout;
