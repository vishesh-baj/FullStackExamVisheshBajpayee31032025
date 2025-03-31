"use client";

import { PaginationProps } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if we have fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of page range
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add pages in the middle
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={`flex justify-center mt-8 ${className}`}
      aria-label="Pagination"
    >
      <ul className="inline-flex items-center -space-x-px">
        {/* Previous button */}
        <li>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`block px-3 py-2 ml-0 leading-tight border rounded-l-lg ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 bg-white hover:bg-gray-100"
            }`}
            aria-label="Previous page"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>

        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => (
          <li key={index}>
            {pageNumber === -1 || pageNumber === -2 ? (
              <span className="px-3 py-2 leading-tight text-gray-500 bg-white border">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-2 leading-tight border ${
                  pageNumber === currentPage
                    ? "z-10 bg-primary text-white border-primary"
                    : "text-gray-700 bg-white hover:bg-gray-100"
                }`}
                aria-current={pageNumber === currentPage ? "page" : undefined}
              >
                {pageNumber}
              </button>
            )}
          </li>
        ))}

        {/* Next button */}
        <li>
          <button
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className={`block px-3 py-2 leading-tight border rounded-r-lg ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 bg-white hover:bg-gray-100"
            }`}
            aria-label="Next page"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
