"use client";

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "../hooks/useNavigation";
import { useNotifications } from "../hooks/useNotifications";
import Layout from "./layout/Layout";

// Screen Components
import ProfileScreen from "./screens/ProfileScreen";
import DocumentsScreen from "./screens/DocumentsScreen";
import NewsScreen from "./screens/NewsScreen";
import RegulationsScreen from "./screens/RegulationsScreen";
import GlossaryScreen from "./screens/GlossaryScreen";
import QuizScreen from "./screens/QuizScreen";
import PQRScreen from "./screens/PQRScreen";
import AIAssistScreen from "./screens/AIAssistScreen";

// Legacy Components (for screens not yet extracted)
import PicoYPlaca from "../../components/pico-y-placa";
import HelpContact from "../../components/help-contact";
import Terms from "../../components/terms";
import UnderConstruction from "../../components/under-construction";

import { SCREENS } from "../utils/constants";

/**
 * MainApp Component - Layout orchestrator for the refactored application
 *
 * This component acts as the main layout container and screen router,
 * integrating all custom hooks and delegating screen rendering to
 * specialized screen components. It replaces the monolithic transit-app.jsx
 * while maintaining all existing functionality.
 *
 * Key responsibilities:
 * - Integrate authentication, navigation, and notification hooks
 * - Delegate screen rendering to appropriate components
 * - Handle layout composition through Layout component
 * - Maintain under 150 lines of code as layout orchestrator
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.6
 */
const MainApp = () => {
  // Integrate all custom hooks
  const { user, isAuthenticated, isLoading, initializeAuth } = useAuth();
  const { activeScreen, navigate, handleNavClick } = useNavigation();
  const { showNotification, notification } = useNotifications();

  // Initialize authentication on mount
  useEffect(() => {
    // Initialize with Auth0 state if available
    if (typeof window !== "undefined" && window.auth0) {
      initializeAuth(
        window.auth0.user,
        window.auth0.isLoading,
        window.auth0.error
      );
    }
  }, [initializeAuth]);

  /**
   * Renders the appropriate screen component based on activeScreen
   * Delegates all screen rendering to specialized components
   */
  const renderScreen = () => {
    const screenProps = { onNavigate: navigate };

    switch (activeScreen) {
      case SCREENS.HOME:
        return (
          <UnderConstruction
            setActiveScreen={navigate}
            showNotification={showNotification}
          />
        );

      case SCREENS.MY_PROFILE:
        return <ProfileScreen {...screenProps} />;

      case SCREENS.DOCUMENTS:
        return <DocumentsScreen {...screenProps} />;

      case SCREENS.NEWS:
        return <NewsScreen {...screenProps} />;

      case SCREENS.REGULATIONS:
        return <RegulationsScreen {...screenProps} />;

      case SCREENS.GLOSSARY:
        return <GlossaryScreen {...screenProps} />;

      case SCREENS.QUIZ:
        return <QuizScreen {...screenProps} />;

      case SCREENS.PQR:
        return <PQRScreen {...screenProps} />;

      case SCREENS.AI_ASSIST:
        return <AIAssistScreen {...screenProps} />;

      case SCREENS.PICO_Y_PLACA:
        return <PicoYPlaca setActiveScreen={navigate} />;

      case SCREENS.HELP_CONTACT:
        return <HelpContact setActiveScreen={navigate} />;

      case SCREENS.TERMS:
        return <Terms setActiveScreen={navigate} />;

      default:
        // Default to home screen for unknown routes
        return (
          <UnderConstruction
            setActiveScreen={navigate}
            showNotification={showNotification}
          />
        );
    }
  };

  /**
   * Handle header menu clicks
   */
  const handleMenuClick = (action) => {
    switch (action) {
      case "profile":
        navigate(SCREENS.MY_PROFILE);
        break;
      case "logout":
        // Logout will be handled by useAuth hook
        break;
      case "login":
        // Login will be handled by useAuth hook
        break;
      default:
        break;
    }
  };

  /**
   * Handle notification button clicks
   */
  const handleNotificationClick = () => {
    // Toggle notification visibility or show notification center
    if (notification.visible) {
      // Hide current notification
      showNotification("", "info", 0);
    }
  };

  // Show loading state while authentication is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  // Main app layout - delegate everything to Layout and screen components
  return (
    <Layout
      user={user}
      isAuthenticated={isAuthenticated}
      activeScreen={activeScreen}
      onMenuClick={handleMenuClick}
      onNotificationClick={handleNotificationClick}
      onNavigate={handleNavClick}
    >
      {renderScreen()}
    </Layout>
  );
};

export default MainApp;
