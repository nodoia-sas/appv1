"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard - Component that protects routes requiring authentication
 *
 * This component:
 * - Checks if user is authenticated
 * - Redirects to login if not authenticated
 * - Preserves the return URL for post-login redirect
 * - Shows loading state during authentication check
 *
 * Requirements: 2.1, 2.6
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname || "/");
      router.push(`/api/auth/login?returnTo=${returnUrl}`);
    }
  }, [user, isLoading, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Show fallback or nothing if not authenticated
  if (!user) {
    return fallback || null;
  }

  // Render children if authenticated
  return <>{children}</>;
}

export default AuthGuard;
