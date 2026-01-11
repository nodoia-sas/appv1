"use client";

import AIAssistScreen from "@/src/components/screens/AIAssistScreen";
import { useRouter } from "next/navigation";

/**
 * AI Assist Page - Protected route for AI assistance
 *
 * This page provides access to the AI assistant functionality.
 * Requires authentication via AuthLayout.
 *
 * Requirements: 1.11 - AI Assist page as protected route
 */
export default function AIAssistPage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    // Map legacy screen names to new routes
    const routeMap: { [key: string]: string } = {
      home: "/",
      profile: "/profile",
      "my-profile": "/profile",
      documents: "/documents",
      pqr: "/pqr",
    };

    const route = routeMap[screen] || `/${screen}`;
    router.push(route);
  };

  return <AIAssistScreen onNavigate={handleNavigate} />;
}
