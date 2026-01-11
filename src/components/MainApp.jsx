"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "../hooks/useNavigation";
import { useNotifications } from "../hooks/useNotifications";
import { useLegacyMigration } from "../../lib/migration";
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
import HomeScreen from "./screens/HomeScreen";

// Legacy Components (for screens not yet extracted)
import PicoYPlaca from "../../components/pico-y-placa";
import HelpContact from "../../components/help-contact";
import Terms from "../../components/terms";
import UnderConstruction from "../../components/under-construction";
import RegulationDetail from "../../components/regulation-detail";
import Notifications from "../../components/notifications";

import { SCREENS } from "../utils/constants";

/**
 * MainApp Component - Layout orchestrator for the refactored application
 *
 * This component acts as the main layout container and screen router,
 * integrating all custom hooks and delegating screen rendering to
 * specialized screen components. It replaces the monolithic transit-app.jsx
 * while maintaining all existing functionality.
 *
 * MIGRATION NOTE: Enhanced with legacy migration support to handle the transition
 * from state-based navigation to route-based navigation seamlessly.
 *
 * Key responsibilities:
 * - Integrate authentication, navigation, and notification hooks
 * - Handle legacy navigation migration and compatibility
 * - Delegate screen rendering to appropriate components
 * - Handle layout composition through Layout component
 * - Maintain under 150 lines of code as layout orchestrator
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 10.5, 10.6
 */
const MainApp = () => {
  // Get Auth0 state
  const {
    user: auth0User,
    error: auth0Error,
    isLoading: auth0Loading,
  } = useUser();

  // Integrate all custom hooks
  const { user, isAuthenticated, isLoading, initializeAuth } = useAuth();
  const { activeScreen, navigate, handleNavClick, legacyMigration } =
    useNavigation();
  const { showNotification, notification } = useNotifications();

  // Legacy migration hook for enhanced compatibility
  const migration = useLegacyMigration();

  // State for regulation detail (migrated from original transit-app.jsx)
  const [selectedRegulation, setSelectedRegulation] = useState(null);

  // Initialize authentication with Auth0 state
  useEffect(() => {
    initializeAuth(auth0User, auth0Loading, auth0Error);
  }, [auth0User, auth0Loading, auth0Error, initializeAuth]);

  // Initialize legacy migration system
  useEffect(() => {
    // Handle any legacy URL parameters or state migration
    migration.handleUrlParameterMigration();
  }, [migration]);

  // Add a timeout for loading state to prevent infinite loading
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, []);

  // Debug logging (remove in production)
  useEffect(() => {
    console.log("MainApp Debug:", {
      auth0Loading,
      isLoading,
      auth0User: !!auth0User,
      user: !!user,
      isAuthenticated,
      activeScreen,
      loadingTimeout,
      migrationState: migration.migrationState,
    });
  }, [
    auth0Loading,
    isLoading,
    auth0User,
    user,
    isAuthenticated,
    activeScreen,
    loadingTimeout,
    migration.migrationState,
  ]);

  /**
   * Renders the appropriate screen component based on activeScreen
   * Enhanced with legacy migration support
   * Delegates all screen rendering to specialized components
   */
  const renderScreen = () => {
    const screenProps = {
      onNavigate: navigate,
      // Provide legacy compatibility functions
      setActiveScreen: migration.setActiveScreen,
    };

    switch (activeScreen) {
      case SCREENS.HOME:
        return <HomeScreen />;

      case SCREENS.MY_PROFILE:
        return <ProfileScreen {...screenProps} />;

      case SCREENS.DOCUMENTS:
        return <DocumentsScreen {...screenProps} />;

      case SCREENS.NEWS:
        return <NewsScreen {...screenProps} />;

      case SCREENS.REGULATIONS:
        return (
          <RegulationsScreen
            {...screenProps}
            setSelectedRegulation={setSelectedRegulation}
          />
        );

      case SCREENS.REGULATION_DETAIL:
        return (
          <RegulationDetail
            selectedRegulation={selectedRegulation}
            setActiveScreen={migration.setActiveScreen} // Use migration-compatible function
            setSelectedRegulation={setSelectedRegulation}
          />
        );

      case SCREENS.GLOSSARY:
        return <GlossaryScreen {...screenProps} />;

      case SCREENS.QUIZ:
        return <QuizScreen {...screenProps} />;

      case SCREENS.PQR:
        return <PQRScreen {...screenProps} />;

      case SCREENS.AI_ASSIST:
        return <AIAssistScreen {...screenProps} />;

      case SCREENS.NOTIFICATIONS:
        return <Notifications setActiveScreen={migration.setActiveScreen} />;

      case SCREENS.PICO_Y_PLACA:
        return <PicoYPlaca setActiveScreen={migration.setActiveScreen} />;

      case SCREENS.HELP_CONTACT:
        return <HelpContact setActiveScreen={migration.setActiveScreen} />;

      case SCREENS.TERMS:
        return <Terms setActiveScreen={migration.setActiveScreen} />;

      case SCREENS.UNDER_CONSTRUCTION:
        return (
          <UnderConstruction
            setActiveScreen={migration.setActiveScreen}
            showNotification={showNotification}
          />
        );

      default:
        // Default to home screen for unknown routes
        return <HomeScreen />;
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

  // Show loading state while authentication is initializing (with timeout)
  if (isLoading && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
          <p className="text-xs text-gray-400 mt-2">
            Auth0: {auth0Loading ? "Cargando..." : "Listo"} | App:{" "}
            {isLoading ? "Cargando..." : "Listo"}
          </p>
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
