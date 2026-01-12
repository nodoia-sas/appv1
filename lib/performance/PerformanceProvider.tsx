/**
 * Performance Provider Component
 *
 * Initializes performance optimizations and provides performance
 * context throughout the application.
 *
 * Requirements: 12.4, 12.5, 12.6
 */

"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { initializeAssetOptimization } from "./assets";
import { preloadCriticalRoutes } from "./cache";

// Performance context type
interface PerformanceContextType {
  isInitialized: boolean;
}

// Create performance context
const PerformanceContext = createContext<PerformanceContextType>({
  isInitialized: false,
});

interface PerformanceProviderProps {
  children: React.ReactNode;
}

/**
 * PerformanceProvider - Initializes and manages performance optimizations
 */
export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;

    // Initialize performance optimizations
    try {
      // Initialize asset optimization
      initializeAssetOptimization();

      // Preload critical routes
      const criticalRoutes = ["/", "/profile", "/documents"];
      preloadCriticalRoutes(criticalRoutes);

      // Mark as initialized
      isInitializedRef.current = true;

      console.log("Performance optimizations initialized");
    } catch (error) {
      console.error("Failed to initialize performance optimizations:", error);
    }
  }, []);

  const contextValue: PerformanceContextType = {
    isInitialized: isInitializedRef.current,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}

/**
 * Hook to access performance context
 */
export function usePerformanceContext(): PerformanceContextType {
  const context = useContext(PerformanceContext);

  if (!context) {
    throw new Error(
      "usePerformanceContext must be used within a PerformanceProvider"
    );
  }

  return context;
}

export default PerformanceProvider;
