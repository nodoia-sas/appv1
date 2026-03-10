"use client";

import DocumentsScreen from "@/src/components/screens/DocumentsScreen";
import { useRouter } from "next/navigation";

/**
 * Documents Page - Protected route for document management
 *
 * This page provides access to personal documents and vehicle management.
 * Requires authentication via AuthLayout.
 *
 * Requirements: 1.4 - Documents page as protected route
 */
export default function DocumentsPage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    // Map legacy screen names to new routes
    const routeMap: { [key: string]: string } = {
      profile: "/profile",
      "my-profile": "/profile",
      home: "/",
      vehicles: "/vehicles",
    };

    const route = routeMap[screen] || `/${screen}`;
    router.push(route);
  };

  return <DocumentsScreen onNavigate={handleNavigate} />;
}
