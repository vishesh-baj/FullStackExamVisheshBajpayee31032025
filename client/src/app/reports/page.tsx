"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Sales Reports</h1>

        <div className="space-y-6">
          {/* Sales Overview */}
          <section>
            <h2 className="text-lg font-medium mb-4">Sales Overview</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-center text-gray-500">
                No sales data available yet.
              </p>
            </div>
          </section>

          {/* Category Performance */}
          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium mb-4">Category Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Electronics", "Clothing", "Home & Kitchen", "Books"].map(
                (category) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h3 className="font-medium">{category}</h3>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-500">Products</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-500">Total Sales</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
            <h3 className="text-blue-700 font-medium mb-2">
              Reports Information
            </h3>
            <p className="text-blue-600 text-sm">
              This page shows sales reports and analytics. As you make sales,
              data will be populated automatically. Reports are updated daily.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
