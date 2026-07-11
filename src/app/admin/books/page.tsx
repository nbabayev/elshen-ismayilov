"use client";

import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CSpinner,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useBooks, useDeleteBook } from "@/app/hooks/useBooks";
import Pagination from "@/app/admin/components/Pagination";

interface Book {
  Id: number;
  Title: string;
  Author: string;
  Image: string;
  PdfUrl: string;
  Description: string;
}

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useBooks({ page, limit });
  const books = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);
  const { enqueueSnackbar } = useSnackbar();
  const deleteMutation = useDeleteBook();

  const handleDelete = (id: number) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () =>
        enqueueSnackbar("Kitab uğurla silindi!", { variant: "success" }),
      onError: (error: any) =>
        enqueueSnackbar("Xəta baş verdi: " + (error?.message || ""), {
          variant: "error",
        }),
    });
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Kitablar</strong>
            <Link href="/admin/books/add">
              <CButton color="primary" size="sm">
                Yeni əlavə et
              </CButton>
            </Link>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Şəkil</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Başlıq</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Müəllif</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Əməliyyatlar</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {books.map((book: Book, index: number) => (
                  <CTableRow key={book.Id}>
                    <CTableHeaderCell scope="row">
                      {(page - 1) * limit + index + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {book.Image && (
                        <CImage
                          src={book.Image}
                          width={60}
                          height={80}
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{book.Title}</CTableDataCell>
                    <CTableDataCell>{book.Author}</CTableDataCell>
                    <CTableDataCell>
                      <Link href={`/admin/books/${book.Id}`}>
                        <CButton color="info" size="sm" className="me-2">
                          <CIcon icon={cilPencil} />
                        </CButton>
                      </Link>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(book.Id)}
                        disabled={deleteMutation.isPending}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {books.length === 0 && (
              <p className="text-center text-muted">Kitab tapılmadı</p>
            )}

            <Pagination
              totalPages={totalPages}
              currentPage={page}
              setCurrentPage={setPage}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
