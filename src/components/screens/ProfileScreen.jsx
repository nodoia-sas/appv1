"use client";

import React from "react";
import { useProfile } from "../../hooks/useProfile";

/**
 * ProfileScreen Component - Independent profile screen component
 *
 * Extracted from transit-app.jsx monolith to provide a dedicated
 * profile management interface. Integrates with useProfile hook
 * for state management and API interactions.
 *
 * Requirements: 1.1 - Profile screen as independent component
 */
const ProfileScreen = ({ onNavigate }) => {
  const { profile, isLoading, error, loadProfile, clearError } = useProfile();

  // Handle profile reload
  const handleReloadProfile = async () => {
    try {
      await loadProfile();
    } catch (err) {
      // Error already handled by useProfile hook
    }
  };

  // Handle error clearing
  const handleClearError = () => {
    clearError();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Mi Perfil
      </h2>

      <div className="space-y-6">
        {/* Profile Data Section */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">
            Mis Datos
          </h3>

          {/* Loading State */}
          {isLoading && (
            <div className="text-sm text-gray-600">Cargando perfil...</div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="text-sm text-red-600 mb-2">
                Error al cargar el perfil: {error.message}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleReloadProfile}
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
                <button
                  onClick={handleClearError}
                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* Profile Data Display */}
          {!isLoading && !error && profile && (
            <div>
              {profile.name && (
                <div className="font-semibold text-gray-800">
                  {profile.name}
                </div>
              )}
              {profile.email && (
                <div className="text-sm text-gray-600">{profile.email}</div>
              )}
              {profile.phone && (
                <div className="text-sm text-gray-600 mt-1">
                  Teléfono: {profile.phone}
                </div>
              )}
              {profile.id && (
                <p className="text-gray-700 text-sm break-words mt-2">
                  ID de usuario: <span className="font-mono">{profile.id}</span>
                </p>
              )}

              {/* Vehicle Count Display */}
              {profile.vehicles && profile.vehicles.length > 0 && (
                <div className="text-sm text-gray-600 mt-2">
                  Vehículos registrados: {profile.vehicles.length}
                </div>
              )}
            </div>
          )}

          {/* No Profile State */}
          {!isLoading && !error && !profile && (
            <div className="text-center py-4">
              <div className="text-gray-600 mb-3">
                No se ha cargado información del perfil
              </div>
              <button
                onClick={handleReloadProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cargar Perfil
              </button>
            </div>
          )}
        </div>

        {/* Profile Actions Section */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">Acciones</h3>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate("documents")}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between"
            >
              <span className="text-gray-700">Mis Documentos</span>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={handleReloadProfile}
              disabled={isLoading}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-gray-700">
                {isLoading ? "Actualizando..." : "Actualizar Perfil"}
              </span>
              <span className="text-gray-400">↻</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
