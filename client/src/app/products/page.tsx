"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import ProductFilter from "@/components/product/ProductFilter";
import Pagination from "@/components/ui/Pagination";
import { useProducts } from "@/lib/hooks/useProducts";

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  // Get pagination parameters from URL
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  // Get filter parameters from URL
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  // State for active filters (to display in UI)
  const [activeFilters, setActiveFilters] = useState({
    category,
    search,
  });

  // Fetch products with TanStack Query
  const { data, isLoading, isError } = useProducts({
    page,
    limit,
    category,
    search,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  // Handle filter change
  const handleFilterChange = (
    type: "category" | "search",
    value: string | null
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page when filters change
    params.set("page", "1");

    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }

    // Update URL with new filters
    router.push(`/products?${params.toString()}`);

    // Update active filters state
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value || undefined,
    }));
  };

  // Safely access pagination data
  const productCount = data?.products?.length || 0;
  const totalItems = data?.pagination?.totalItems || 0;
  const totalPages = data?.pagination?.totalPages || 0;
  const currentPage = data?.pagination?.currentPage || page;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar filters */}
      <div className="w-full md:w-64 flex-shrink-0">
        <ProductFilter
          activeCategory={activeFilters.category}
          activeSearch={activeFilters.search}
          onCategoryChange={(category) =>
            handleFilterChange("category", category)
          }
          onSearchChange={(search) => handleFilterChange("search", search)}
        />
      </div>

      {/* Products grid */}
      <div className="flex-grow">
        {/* Title and result stats */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {activeFilters.category
              ? `${activeFilters.category} Products`
              : activeFilters.search
              ? `Search Results: "${activeFilters.search}"`
              : "All Products"}
          </h1>

          {isClient && data && (
            <p className="text-gray-600">
              Showing {productCount} of {totalItems} products
            </p>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>Error loading products. Please try again later.</p>
          </div>
        )}

        {/* Products grid */}
        {!isLoading && !isError && data && (
          <>
            {!data.products || data.products.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() => {
                    router.push("/products");
                    setActiveFilters({
                      category: undefined,
                      search: undefined,
                    });
                  }}
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
