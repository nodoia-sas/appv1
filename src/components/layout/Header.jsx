"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useNavigationCompat } from "../../../lib/navigation";
import * as Icons from "../../../components/icons";
import SmartSearch from "../SmartSearch";

/**
 * Header component that displays the app title, user menu, notifications button, and SmartSearch
 * Updated to use Next.js navigation and the new navigation system
 * Requirement 7.8: Integrated SmartSearch component
 *
 * @param {Object} props - Component props
 * @param {Object|null} props.user - Current user object (null if not authenticated)
 * @param {Function} props.onMenuClick - Callback for menu item clicks (action: string)
 * @param {Function} props.onNotificationClick - Callback for notification button click
 * @param {boolean} props.isAuthenticated - Whether user is currently authenticated
 */
const Header = ({
  user,
  onMenuClick,
  onNotificationClick,
  isAuthenticated = false,
}) => {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const loginButtonRef = useRef(null);
  const { navigate } = useNavigationCompat();

  const handleMenuItemClick = (action) => {
    setShowLoginDropdown(false);

    // Handle navigation actions using the new navigation system
    switch (action) {
      case "my-profile":
        navigate("my-profile");
        break;
      case "documents":
        navigate("documents");
        break;
      case "help-contact":
        navigate("help-contact");
        break;
      case "terms":
        navigate("terms");
        break;
      default:
        // For non-navigation actions, delegate to parent
        onMenuClick(action);
        break;
    }
  };

  const handleNotificationClick = () => {
    if (!isAuthenticated) {
      onMenuClick("require-login-notifications");
      return;
    }
    onNotificationClick();
  };

  return (
    <>
      <div
        className="fixed top-0 left-1/2 transform -translate-x-1/2 header-gradient text-white p-4 md:px-6 flex items-center justify-between rounded-t-xl shadow-md z-50 w-full max-w-md md:max-w-2xl lg:max-w-3xl"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="relative">
          {isAuthenticated ? (
            <button
              ref={loginButtonRef}
              onClick={() => setShowLoginDropdown((s) => !s)}
              className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-sm font-semibold shadow-md"
              aria-label="Abrir menú de usuario"
            >
              <Icons.UserIcon className="w-5 h-5" />
              <span>Mi cuenta</span>
            </button>
          ) : (
            <Link
              ref={loginButtonRef}
              href="/api/auth/login"
              className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-sm font-semibold shadow-md"
              aria-label="Iniciar sesión"
            >
              <Icons.LogInIcon className="w-5 h-5" />
              <span>Login</span>
            </Link>
          )}
          {showLoginDropdown && (
            <div
              className="absolute left-0 mt-2 w-48 card-bg rounded-md shadow-lg py-1 z-20"
              onMouseLeave={() => setShowLoginDropdown(false)}
            >
              {isAuthenticated ? (
                <>
                  <button
                    key="my-profile"
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleMenuItemClick("my-profile")}
                  >
                    <Icons.UserIcon className="w-4 h-4" />
                    <span>Mi perfil</span>
                  </button>
                  <button
                    key="documents"
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleMenuItemClick("documents")}
                  >
                    <Icons.FileTextIcon className="w-4 h-4" />
                    <span>Mis documentos</span>
                  </button>
                  <button
                    key="help-contact"
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleMenuItemClick("help-contact")}
                  >
                    <Icons.InfoIcon className="w-4 h-4" />
                    <span>Ayuda/Contacto</span>
                  </button>
                  <button
                    key="terms"
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleMenuItemClick("terms")}
                  >
                    <Icons.FileWarningIcon className="w-4 h-4" />
                    <span>Términos y privacidad</span>
                  </button>
                  <button
                    key="share-app"
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleMenuItemClick("share-app")}
                  >
                    <Icons.Share2Icon className="w-4 h-4" />
                    <span>Compartir app</span>
                  </button>
                  <button
                    key="environment-info"
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleMenuItemClick("environment-info")}
                  >
                    <Icons.SettingsIcon className="w-4 h-4" />
                    <span>Configuración API</span>
                  </button>
                  <div
                    key="divider"
                    className="border-t border-border my-1"
                  ></div>
                  <Link
                    key="logout"
                    href="/api/auth/logout"
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                    onClick={() => setShowLoginDropdown(false)}
                  >
                    <Icons.LogInIcon className="w-4 h-4 transform rotate-180" />
                    <span>Cerrar Sesión</span>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    key="login"
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleMenuItemClick("login")}
                  >
                    <Icons.UserIcon className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </button>
                  <button
                    key="help-contact-public"
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleMenuItemClick("help-contact")}
                  >
                    <Icons.InfoIcon className="w-4 h-4" />
                    <span>Ayuda/Contacto</span>
                  </button>
                  <button
                    key="terms-public"
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleMenuItemClick("terms")}
                  >
                    <Icons.FileWarningIcon className="w-4 h-4" />
                    <span>Términos y privacidad</span>
                  </button>
                  <button
                    key="share-app-public"
                    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleMenuItemClick("share-app")}
                  >
                    <Icons.Share2Icon className="w-4 h-4" />
                    <span>Compartir app</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          Transit IA
        </h1>
        <div className="flex items-center space-x-2">
          {/* Search Button - Requirement 7.8 */}
          <button
            className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 shadow-md"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Toggle search"
          >
            <Icons.SearchIcon className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 shadow-md"
            onClick={handleNotificationClick}
            aria-label="View notifications"
          >
            <Icons.BellIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SmartSearch Dropdown - Requirement 7.8 */}
      {showSearch && (
        <div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md md:max-w-2xl lg:max-w-3xl px-4 z-40"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="bg-white rounded-lg shadow-2xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Búsqueda Inteligente
              </h3>
              <button
                onClick={() => setShowSearch(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <SmartSearch />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
