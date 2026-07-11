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
import { useMiniSliders, useDeleteMiniSlider } from "@/app/hooks/useMiniSlider";
import Pagination from "@/app/admin/components/Pagination";

interface MiniSlider {
  Id: number;
  Title: string;
  ImageUrl: string;
  Link: string;
  ListingNumber: number;
}

export default function MiniSlidersPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useMiniSliders({ page, limit });
  const sliders = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);
  const { enqueueSnackbar } = useSnackbar();
  const deleteMutation = useDeleteMiniSlider();

  const handleDelete = (id: number) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () =>
        enqueueSnackbar("Mini slayder uğurla silindi!", { variant: "success" }),
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
            <strong>Mini Slayderlər</strong>
            <Link href="/admin/mini-sliders/add">
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
                  <CTableHeaderCell scope="col">Link</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Sıra</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Əməliyyatlar</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {sliders.map((slider: MiniSlider, index: number) => (
                  <CTableRow key={slider.Id}>
                    <CTableHeaderCell scope="row">
                      {(page - 1) * limit + index + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {slider.ImageUrl && (
                        <CImage
                          src={slider.ImageUrl}
                          width={80}
                          height={45}
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{slider.Title}</CTableDataCell>
                    <CTableDataCell>{slider.Link}</CTableDataCell>
                    <CTableDataCell>{slider.ListingNumber}</CTableDataCell>
                    <CTableDataCell>
                      <Link href={`/admin/mini-sliders/${slider.Id}`}>
                        <CButton color="info" size="sm" className="me-2">
                          <CIcon icon={cilPencil} />
                        </CButton>
                      </Link>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(slider.Id)}
                        disabled={deleteMutation.isPending}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {sliders.length === 0 && (
              <p className="text-center text-muted">Mini slayder tapılmadı</p>
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
