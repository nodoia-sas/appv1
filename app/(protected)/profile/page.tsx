"use client";

import ProfileScreen from "@/src/components/screens/ProfileScreen";
import { useRouter } from "next/navigation";

/**
 * Profile Page - Protected route for user profile management
 *
 * This page provides access to user profile information and settings.
 * Requires authentication via AuthLayout.
 *
 * Requirements: 1.3 - Profile page as protected route
 */
export default function ProfilePage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    // Map legacy screen names to new routes
    const routeMap: { [key: string]: string } = {
      documents: "/documents",
      home: "/",
      "my-profile": "/profile",
    };

    const route = routeMap[screen] || `/${screen}`;
    router.push(route);
  };

  return <ProfileScreen onNavigate={handleNavigate} />;
}
