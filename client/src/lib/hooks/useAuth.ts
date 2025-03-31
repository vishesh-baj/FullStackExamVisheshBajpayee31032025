"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { loginUser, registerUser } from "../api";
import { DecodedToken, LoginCredentials, RegisterData, User } from "@/types";

// Helper function to synchronize token between localStorage and cookies
const syncToken = (token: string | null) => {
  if (token) {
    // Set the token in both localStorage and cookies
    localStorage.setItem("token", token);
    Cookies.set("token", token, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
    });
  } else {
    // Remove the token from both localStorage and cookies
    localStorage.removeItem("token");
    Cookies.remove("token");
  }
};

// Create a custom event for auth state changes
export const authStateChange = () => {
  if (typeof window !== "undefined") {
    const event = new Event("authStateChanged");
    window.dispatchEvent(event);
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize auth state from localStorage
  const initAuth = useCallback(() => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Ensure cookie is also set for middleware
      Cookies.set("token", token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
      });

      // Decode token to get user info
      const decoded = jwtDecode<DecodedToken>(token);

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Token expired, log out
        syncToken(null);
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Token is valid
      setUser({
        id: decoded.id,
        email: decoded.email,
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth initialization error:", error);
      syncToken(null);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth on mount and listen for auth state changes
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      initAuth();

      // Listen for auth state changes
      window.addEventListener("authStateChanged", initAuth);

      return () => {
        window.removeEventListener("authStateChanged", initAuth);
      };
    } else {
      setIsLoading(false);
    }
  }, [initAuth]);

  /**
   * Login with credentials
   */
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser(credentials);

      // Store token in both localStorage and cookies
      syncToken(response.token);

      // Decode token to get user info
      const decoded = jwtDecode<DecodedToken>(response.token);

      // Update user state
      setUser({
        id: decoded.id,
        email: decoded.email,
        username: response.user?.username,
      });

      // Update authenticated state
      setIsAuthenticated(true);

      // Notify that auth state has changed
      authStateChange();

      // Navigate to home
      router.push("/");
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Failed to log in. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user
   */
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerUser(data);

      // Store token in both localStorage and cookies
      syncToken(response.token);

      // Set user state
      setUser({
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
      });

      // Update authenticated state
      setIsAuthenticated(true);

      // Notify that auth state has changed
      authStateChange();

      // Navigate to home
      router.push("/");
      return true;
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = () => {
    syncToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Notify that auth state has changed
    authStateChange();

    router.push("/");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
