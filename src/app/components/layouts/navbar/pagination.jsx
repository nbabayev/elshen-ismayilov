"use client";
import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const pages = [];
  // 1 həmişə
  pages.push(1);

  // solda boşluq
  if (currentPage - 2 > 1) {
    pages.push("...");
  }

  // current-ə yaxın səhifələr
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  // sağda boşluq
  if (currentPage + 2 < totalPages) {
    pages.push("...");
  }

  // son həmişə
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  // Format page number as 01, 02, etc.
  const formatPageNumber = (num) => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {pages.map((p, idx) => {
        const isActive = p === currentPage;
        const isNextPage = p === currentPage + 1;

        return p === "..." ? (
          <span
            key={`dots-${idx}`}
            className="w-10 h-10 flex items-center justify-center text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={`page-${p}`}
            className={`w-10 h-10 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-[#003a3c] text-white"
                : isNextPage
                ? "bg-white border border-[#003a3c] text-[#003a3c] hover:bg-gray-50"
                : "bg-white border border-gray-200 text-gray-500 hover:border-[#003a3c] hover:text-[#003a3c]"
            }`}
            disabled={totalPages < 2}
            onClick={() => setCurrentPage(p)}
          >
            {formatPageNumber(p)}
          </button>
        );
      })}

      {totalPages > 1 && currentPage < totalPages && (
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#003a3c] transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Pagination;
