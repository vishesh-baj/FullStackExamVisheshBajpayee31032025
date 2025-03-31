"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useProducts } from "@/lib/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import { useAuthContext } from "@/lib/auth-provider";

export default function Home() {
  const { isAuthenticated, user } = useAuthContext();
  const [isClient, setIsClient] = useState(false);

  // Fetch a few products to display on the homepage
  const {
    data: productsData,
    isLoading,
    isError,
  } = useProducts({
    limit: 8,
    page: 1,
  });

  useEffect(() => {
    setIsClient(true);

    // Debug products data
    if (productsData) {
      console.log("Home page products data:", productsData);
    }
  }, [productsData]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  console.log("Home page products data:", productsData?.products);
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent rounded-lg text-white p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {isAuthenticated && user
            ? `Welcome back, ${user?.username || user?.name || user?.email}!`
            : "Welcome to E-Shop"}
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
          Discover amazing products at unbeatable prices
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-block bg-white text-primary font-medium py-2 px-6 rounded-full shadow hover:shadow-lg transition-all"
          >
            Browse Products
          </Link>
          {isClient && !isAuthenticated && (
            <Link
              href="/auth/register"
              className="inline-block bg-transparent text-white border border-white font-medium py-2 px-6 rounded-full hover:bg-white/10 transition-all"
            >
              Create Account
            </Link>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 p-4 rounded-lg animate-pulse h-72"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-500">
            Failed to load products. Please try again later.
          </div>
        ) : productsData?.products ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsData.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-10">
            No products found.
          </div>
        )}
      </section>

      {/* Categories Section */}
      {/* <section>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Electronics", "Clothing", "Home & Kitchen", "Books"].map(
            (category) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
              >
                <h3 className="font-medium mb-2">{category}</h3>
                <p className="text-sm text-gray-500">Shop Now</p>
              </Link>
            )
          )}
        </div>
      </section> */}
    </div>
  );
}
