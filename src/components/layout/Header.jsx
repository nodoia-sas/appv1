"use client";

import { useState, useRef } from "react";
import * as Icons from "../../../components/icons";

/**
 * Header component that displays the app title, user menu, and notifications button
 * Extracted from the monolithic transit-app.jsx component
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
  const loginButtonRef = useRef(null);

  const handleMenuItemClick = (action) => {
    setShowLoginDropdown(false);
    onMenuClick(action);
  };

  const handleNotificationClick = () => {
    if (!isAuthenticated) {
      onMenuClick("require-login-notifications");
      return;
    }
    onNotificationClick();
  };

  return (
    <div
      className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 md:px-6 flex items-center justify-between rounded-t-xl shadow-md z-50 w-full max-w-md md:max-w-2xl lg:max-w-3xl"
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
          <a
            ref={loginButtonRef}
            href="/api/auth/login"
            className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 text-sm font-semibold shadow-md"
            aria-label="Iniciar sesión"
          >
            <Icons.LogInIcon className="w-5 h-5" />
            <span>Login</span>
          </a>
        )}
        {showLoginDropdown && (
          <div
            className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
            onMouseLeave={() => setShowLoginDropdown(false)}
          >
            {isAuthenticated ? (
              <>
                <button
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleMenuItemClick("my-profile")}
                >
                  <Icons.UserIcon className="w-4 h-4" />
                  <span>Mi perfil</span>
                </button>
                <button
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleMenuItemClick("documents")}
                >
                  <Icons.FileTextIcon className="w-4 h-4" />
                  <span>Mis documentos</span>
                </button>
                <button
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleMenuItemClick("help-contact")}
                >
                  <Icons.InfoIcon className="w-4 h-4" />
                  <span>Ayuda/Contacto</span>
                </button>
                <button
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleMenuItemClick("terms")}
                >
                  <Icons.FileWarningIcon className="w-4 h-4" />
                  <span>Términos y privacidad</span>
                </button>
                <button
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleMenuItemClick("share-app")}
                >
                  <Icons.Share2Icon className="w-4 h-4" />
                  <span>Compartir app</span>
                </button>
                <button
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleMenuItemClick("environment-info")}
                >
                  <Icons.SettingsIcon className="w-4 h-4" />
                  <span>Configuración API</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <a
                  href="/api/auth/logout"
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => setShowLoginDropdown(false)}
                >
                  <Icons.LogInIcon className="w-4 h-4 transform rotate-180" />
                  <span>Cerrar Sesión</span>
                </a>
              </>
            ) : (
              <>
                <button
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleMenuItemClick("login")}
                >
                  <Icons.UserIcon className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </button>
                <button
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleMenuItemClick("help-contact")}
                >
                  <Icons.InfoIcon className="w-4 h-4" />
                  <span>Ayuda/Contacto</span>
                </button>
                <button
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleMenuItemClick("terms")}
                >
                  <Icons.FileWarningIcon className="w-4 h-4" />
                  <span>Términos y privacidad</span>
                </button>
                <button
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
      <div className="flex items-center">
        <button
          className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors duration-200 shadow-md"
          onClick={handleNotificationClick}
          aria-label="View notifications"
        >
          <Icons.BellIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Header;
