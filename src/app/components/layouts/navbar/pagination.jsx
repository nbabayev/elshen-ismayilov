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

  return (
    <div
      className={`grid [grid-template-columns:repeat(auto-fit,minmax(10px,40px))] gap-8 justify-center`}
    >
      {totalPages > 2 && (
        <button onClick={() => setCurrentPage(currentPage - 1)}>
          {" "}
          <img src="/icons/arrow-left.svg" alt="" />
        </button>
      )}

      {pages.map((p, idx) => {
        return p === "..." ? (
          <span key={`dots-${idx}`} className="text-center">
            ...
          </span>
        ) : (
          <button
            key={`page-${p}`}
            className={`px-3 py-1 rounded  w-auto inline-block ${
              p === currentPage ? "bg-[#003a3c] text-white" : "bg-gray-100"
            }`}
            disabled={totalPages < 2}
            onClick={() => setCurrentPage(p)}
          >
            {p}
          </button>
        );
      })}
      {totalPages > 2 && (
        <button onClick={() => setCurrentPage(currentPage + 1)}>
          {" "}
          <img src="/icons/arrow-left.svg" alt="" className="rotate-180" />
        </button>
      )}
    </div>
  );
};

export default Pagination;
