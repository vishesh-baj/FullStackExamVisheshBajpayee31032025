"use client";

import { useState, FormEvent } from "react";

interface ProductFilterProps {
  activeCategory?: string;
  activeSearch?: string;
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (search: string | null) => void;
}

const ProductFilter = ({
  activeCategory,
  activeSearch = "",
  onCategoryChange,
  onSearchChange,
}: ProductFilterProps) => {
  const [searchInput, setSearchInput] = useState(activeSearch || "");

  const categories = [
    "All Categories",
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
  ];

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchChange(searchInput ? searchInput : null);
  };

  const handleCategoryClick = (category: string) => {
    if (category === "All Categories") {
      onCategoryChange(null);
    } else {
      onCategoryChange(category);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-medium mb-3">Search Products</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 text-gray-500 hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => handleCategoryClick(category)}
                className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                  activeCategory === category ||
                  (category === "All Categories" && !activeCategory)
                    ? "font-medium text-primary"
                    : "text-gray-700"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range - Could be implemented with a range slider */}
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="flex space-x-2">
          <div className="w-1/2">
            <label className="text-xs text-gray-500">Min</label>
            <input
              type="number"
              placeholder="Min"
              className="w-full border rounded p-2"
            />
          </div>
          <div className="w-1/2">
            <label className="text-xs text-gray-500">Max</label>
            <input
              type="number"
              placeholder="Max"
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters button */}
      {(activeCategory || activeSearch) && (
        <div>
          <button
            onClick={() => {
              onCategoryChange(null);
              onSearchChange(null);
              setSearchInput("");
            }}
            className="w-full py-2 text-center text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
