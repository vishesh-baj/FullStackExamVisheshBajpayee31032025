"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/lib/auth-provider";

const Header = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);

    // Get cart count from localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };

    updateCartCount();

    // Set up event listener for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Force re-render when auth state changes
  useEffect(() => {
    if (isClient) {
      console.log("Header auth state:", { isAuthenticated, user });
    }
  }, [isClient, isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            E-Shop
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className={`hover:text-primary ${
                isActive("/") ? "text-primary font-medium" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`hover:text-primary ${
                isActive("/products") ? "text-primary font-medium" : ""
              }`}
            >
              Products
            </Link>
            {isClient && isAuthenticated && (
              <>
                <Link
                  href="/orders"
                  className={`hover:text-primary ${
                    isActive("/orders") ? "text-primary font-medium" : ""
                  }`}
                >
                  My Orders
                </Link>
                {isActive("/reports") && (
                  <Link
                    href="/reports"
                    className={`hover:text-primary ${
                      isActive("/reports") ? "text-primary font-medium" : ""
                    }`}
                  >
                    Reports
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {isClient && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {!isClient || isLoading ? (
              // Show skeleton loader while authenticating
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary"
                >
                  <span className="hidden sm:inline-block">
                    {user?.username || user?.name || user?.email}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/reports"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Reports
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="text-sm hover:text-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
