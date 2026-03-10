/**
 * Offline Indicator Component
 *
 * Shows users when they are offline and provides information
 * about cached content and pending synchronization.
 *
 * Requirements: 13.1, 13.2, 13.3
 */

"use client";

import React, { useState, useEffect } from "react";
import { useOfflineNavigation, useOfflineStatus } from "./useOfflineNavigation";

interface OfflineIndicatorProps {
  /** Whether to show detailed offline information */
  showDetails?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Position of the indicator */
  position?: "top" | "bottom";
}

export function OfflineIndicator({
  showDetails = false,
  className = "",
  position = "top",
}: OfflineIndicatorProps) {
  const isOffline = useOfflineStatus();
  const { pendingNavigations, isCurrentRouteAvailableOffline, getStats } =
    useOfflineNavigation();

  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState(getStats());

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [getStats]);

  // Show/hide indicator with animation
  useEffect(() => {
    if (isOffline) {
      setIsVisible(true);
    } else {
      // Hide after a delay when back online
      const timeout = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isOffline]);

  if (!isVisible) return null;

  const baseClasses = `
    fixed left-0 right-0 z-50 px-4 py-2 text-sm font-medium text-white
    transition-all duration-300 ease-in-out
    ${position === "top" ? "top-0" : "bottom-0"}
    ${isOffline ? "bg-orange-500" : "bg-green-500"}
    ${className}
  `;

  return (
    <div className={baseClasses}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Status Icon */}
          <div
            className={`w-2 h-2 rounded-full ${
              isOffline ? "bg-white" : "bg-white animate-pulse"
            }`}
          />

          {/* Status Text */}
          <span>{isOffline ? "Sin conexión" : "Conexión restaurada"}</span>

          {/* Route availability indicator */}
          {isOffline && (
            <span className="text-xs opacity-75">
              {isCurrentRouteAvailableOffline()
                ? "• Página disponible offline"
                : "• Página no disponible offline"}
            </span>
          )}
        </div>

        {/* Detailed information */}
        {showDetails && isOffline && (
          <div className="flex items-center space-x-4 text-xs">
            {pendingNavigations.length > 0 && (
              <span className="opacity-75">
                {pendingNavigations.length} navegación
                {pendingNavigations.length !== 1 ? "es" : ""} pendiente
                {pendingNavigations.length !== 1 ? "s" : ""}
              </span>
            )}

            <span className="opacity-75">
              {stats.cachedRoutesCount} página
              {stats.cachedRoutesCount !== 1 ? "s" : ""} en caché
            </span>
          </div>
        )}

        {/* Close button for online state */}
        {!isOffline && (
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Cerrar notificación"
          >
            <svg
              className="w-4 h-4"
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
        )}
      </div>
    </div>
  );
}

/**
 * Offline Status Badge Component
 *
 * A smaller badge component for showing offline status in navigation
 */
export function OfflineStatusBadge({ className = "" }: { className?: string }) {
  const isOffline = useOfflineStatus();
  const { pendingNavigations } = useOfflineNavigation();

  if (!isOffline && pendingNavigations.length === 0) return null;

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      {isOffline && (
        <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
          <span>Offline</span>
        </div>
      )}

      {pendingNavigations.length > 0 && (
        <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span>{pendingNavigations.length}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Offline Route Cache Status Component
 *
 * Shows whether the current route is available offline
 */
export function OfflineRouteCacheStatus({
  className = "",
}: {
  className?: string;
}) {
  const { isCurrentRouteAvailableOffline } = useOfflineNavigation();
  const isOffline = useOfflineStatus();
  const isAvailable = isCurrentRouteAvailableOffline();

  // Only show when offline
  if (!isOffline) return null;

  return (
    <div className={`inline-flex items-center space-x-1 text-xs ${className}`}>
      <div
        className={`w-2 h-2 rounded-full ${
          isAvailable ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className={isAvailable ? "text-green-700" : "text-red-700"}>
        {isAvailable ? "Disponible offline" : "No disponible offline"}
      </span>
    </div>
  );
}
