"use client";

import { useEffect } from "react";
import { useOfflineRouteCache } from "../lib/pwa/useOfflineNavigation";

export default function RegisterSW() {
  const { preloadCriticalRoutes } = useOfflineRouteCache();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        // eslint-disable-next-line no-console
        console.log("ServiceWorker registered:", reg);

        // Preload critical routes for offline access
        const criticalRoutes = [
          "/",
          "/news",
          "/regulations",
          "/glossary",
          "/quiz",
        ];

        await preloadCriticalRoutes(criticalRoutes);
        console.log("Critical routes preloaded for offline access");

        // Listen for service worker updates
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker is available
                console.log("New service worker available");

                // Optionally notify user about update
                if (
                  window.confirm(
                    "Nueva versión disponible. ¿Recargar la página?"
                  )
                ) {
                  window.location.reload();
                }
              }
            });
          }
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("ServiceWorker registration failed:", err);
      }
    };

    register();
  }, [preloadCriticalRoutes]);

  return null;
}
