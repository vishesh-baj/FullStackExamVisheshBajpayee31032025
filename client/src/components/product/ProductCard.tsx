import Link from "next/link";
import { Product } from "@/lib/api";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debugging
  useEffect(() => {
    if (isClient) {
      console.log("ProductCard received:", product);
    }
  }, [isClient, product]);

  // Ensure the product object has all necessary properties
  if (!product || !product._id) {
    if (isClient) {
      console.warn("ProductCard: Invalid product data", product);
    }
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        {/* Product image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name || "Product"}
              className="object-cover w-full h-full"
            />
          ) : (
            <span>Product Image</span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium truncate">
          {product.name || "Unnamed Product"}
        </h3>
        <p className="text-gray-500 text-sm mb-2">
          {product.category || "Uncategorized"}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-primary font-bold">
            ${product.price ? product.price.toFixed(2) : "0.00"}
          </span>
          <Link
            href={`/products/id/${product._id}`}
            className="text-sm text-white bg-primary px-3 py-1 rounded hover:bg-primary/90"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
