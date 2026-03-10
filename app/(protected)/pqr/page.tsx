"use client";

import PQRScreen from "@/src/components/screens/PQRScreen";
import { useRouter } from "next/navigation";

/**
 * PQR Page - Protected route for Peticiones, Quejas y Reclamos
 *
 * This page provides access to the PQR (complaints and requests) system.
 * Requires authentication via AuthLayout.
 *
 * Requirements: 1.11 - PQR page as protected route
 */
export default function PQRPage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    // Map legacy screen names to new routes
    const routeMap: { [key: string]: string } = {
      home: "/",
      profile: "/profile",
      "my-profile": "/profile",
      documents: "/documents",
      "ai-assist": "/ai-assist",
    };

    const route = routeMap[screen] || `/${screen}`;
    router.push(route);
  };

  return <PQRScreen onNavigate={handleNavigate} />;
}
