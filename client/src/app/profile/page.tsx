"use client";

import AuthOnly from "@/components/auth/AuthOnly";
import { useAuthContext } from "@/lib/auth-provider";

export default function ProfilePage() {
  return (
    <AuthOnly>
      <ProfileContent />
    </AuthOnly>
  );
}

function ProfileContent() {
  const { user } = useAuthContext();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <div className="p-2 border border-gray-300 rounded bg-gray-50">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <div className="p-2 border border-gray-300 rounded bg-gray-50">
                {user?.username || "Not set"}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={() => alert("Feature not implemented yet")}
            >
              Change Password
            </button>

            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              onClick={() => alert("Feature not implemented yet")}
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
