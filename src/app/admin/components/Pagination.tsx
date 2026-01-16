"use client";

import { CButton } from "@coreui/react";
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const pages: (number | string)[] = [];

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

  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      {totalPages > 2 && (
        <CButton
          color="primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <FaArrowLeft style={{ color: "white", fontSize: "15px" }} />
        </CButton>
      )}

      {pages.map((p, idx) => {
        return p === "..." ? (
          <span key={`dots-${idx}`} className="mx-2 text-center">
            ...
          </span>
        ) : (
          <CButton
            color="primary"
            key={`page-${p}`}
            className={`mx-1 rounded ${
              p === currentPage ? "bg-info text-white" : ""
            }`}
            onClick={() => setCurrentPage(p as number)}
          >
            {p}
          </CButton>
        );
      })}

      {totalPages > 2 && (
        <CButton
          color="primary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <FaArrowRight style={{ color: "white", fontSize: "15px" }} />
        </CButton>
      )}
    </div>
  );
};

export default Pagination;
