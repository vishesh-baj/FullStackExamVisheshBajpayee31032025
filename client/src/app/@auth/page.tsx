"use client";

import { useAuthContext } from "@/lib/auth-provider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthStatus() {
  const { isAuthenticated, user, isLoading } = useAuthContext();
  const [mounted, setMounted] = useState(false);

  // Force re-render when component mounts on client
  useEffect(() => {
    setMounted(true);

    if (mounted) {
      console.log("AuthStatus auth state:", { isAuthenticated, user });
    }
  }, [isAuthenticated, user, mounted]);

  // Show loading state while initializing
  if (!mounted || isLoading) {
    return (
      <div className="p-4 bg-white/80 rounded-lg shadow-sm backdrop-blur-sm">
        <div className="w-full h-5 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-white/80 rounded-lg shadow-sm backdrop-blur-sm">
        <p className="text-sm text-gray-600 mb-2">
          Sign in to access all features
        </p>
        <div className="flex space-x-2">
          <Link
            href="/auth/login"
            className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="text-sm bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/80 rounded-lg shadow-sm backdrop-blur-sm">
      <p className="text-sm text-gray-700 mb-1">
        Welcome back,{" "}
        <span className="font-medium">{user?.username || user?.email}</span>
      </p>
      <div className="flex space-x-2">
        <Link href="/profile" className="text-xs text-primary hover:underline">
          My Profile
        </Link>
        <span className="text-gray-300">|</span>
        <Link href="/orders" className="text-xs text-primary hover:underline">
          My Orders
        </Link>
      </div>
    </div>
  );
}
