"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProduct } from "@/lib/hooks/useProducts";

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product data using TanStack Query
  const { data: product, isLoading, isError } = useProduct(id as string);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Get existing cart from localStorage
    const cartJSON = localStorage.getItem("cart");
    const cart = cartJSON ? JSON.parse(cartJSON) : [];

    // Check if product already exists in cart
    const existingItem = cart.find((item: any) => item.id === product._id);

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity,
      });
    }

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Trigger cart update event
    window.dispatchEvent(new Event("cartUpdated"));

    // Show added to cart message
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-4">
          The product you're looking for does not exist.
        </p>
        <Link href="/products" className="text-primary hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-6">
        <ol className="flex space-x-2">
          <li>
            <Link href="/" className="text-gray-500 hover:text-primary">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/products" className="text-gray-500 hover:text-primary">
              Products
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">{product.name}</li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 h-96 bg-gray-200 relative">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Product Image {product._id}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-500 mb-4">Category: {product.category}</p>
              <div className="text-2xl font-bold text-primary mb-4">
                ${product.price.toFixed(2)}
              </div>
              <p className="text-gray-700 mb-6">{product.description}</p>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border rounded-md px-2 py-1"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary/90 transition-colors"
              >
                Add to Cart
              </button>

              {addedToCart && (
                <div className="bg-green-100 text-green-700 p-3 rounded-md">
                  ✓ Added to cart successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((relatedId) => (
            <div
              key={relatedId}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Image {relatedId}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium">Related Product {relatedId}</h3>
                <p className="text-gray-500 text-sm">Category</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-primary font-bold">
                    ${(19.99 * relatedId).toFixed(2)}
                  </span>
                  <Link
                    href={`/products/${relatedId}`}
                    className="text-xs text-white bg-primary px-2 py-1 rounded hover:bg-primary/90"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
