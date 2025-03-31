"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./hooks/useAuth";

// Create AuthContext with a more explicit type
interface AuthContextType {
  user: ReturnType<typeof useAuth>["user"];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: ReturnType<typeof useAuth>["login"];
  register: ReturnType<typeof useAuth>["register"];
  logout: ReturnType<typeof useAuth>["logout"];
}

// Create AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export AuthContext provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render children when component has mounted on the client
  // This prevents hydration issues and ensures client-side auth state is used
  if (!mounted) {
    return null;
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
