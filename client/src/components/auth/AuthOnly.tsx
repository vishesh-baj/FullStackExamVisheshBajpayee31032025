"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/auth-provider";
import Loading from "@/app/loading";

interface AuthOnlyProps {
  children: React.ReactNode;
  fallback?: string; // URL to redirect to if not authenticated
}

export default function AuthOnly({
  children,
  fallback = "/auth/login",
}: AuthOnlyProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Add the current URL as callbackUrl for redirection after login
      if (typeof window !== "undefined") {
        const callbackParam = encodeURIComponent(window.location.pathname);
        router.push(`${fallback}?callbackUrl=${callbackParam}`);
      } else {
        router.push(fallback);
      }
    }
  }, [isAuthenticated, isLoading, router, fallback]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
