"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Get a user-friendly message based on the error code
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "CredentialsSignin":
        return "Invalid email or password. Please try again.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      case "AccessDenied":
        return "You don't have permission to access this resource.";
      default:
        return "An authentication error occurred. Please try again.";
    }
  };

  const errorMessage = error ? getErrorMessage(error) : "Authentication error";

  return (
    <div className="max-w-md mx-auto my-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-red-600">
          Authentication Error
        </h1>

        <div className="bg-red-50 text-red-700 p-4 rounded mb-6">
          <p>{errorMessage}</p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Back to Login
          </Link>

          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
