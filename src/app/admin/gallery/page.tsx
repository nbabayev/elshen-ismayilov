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
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useGalleries, useDeleteGallery } from "@/app/hooks/useGallery";
import Pagination from "@/app/admin/components/Pagination";

interface Gallery {
  id: number;
  title: string;
  thumbImg: string;
  type: "image" | "video";
  viewDate: string;
}

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGalleries({ page, limit });
  const galleries = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);
  const { enqueueSnackbar } = useSnackbar();
  const deleteMutation = useDeleteGallery();
  const handleDelete = (id: number) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () =>
        enqueueSnackbar("Qalereya uğurla silindi!", { variant: "success" }),
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
            <strong>Qalereya</strong>
            <Link href="/admin/gallery/add">
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
                  <CTableHeaderCell scope="col">Növ</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tarix</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Əməliyyatlar</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {galleries.map((gallery: Gallery, index: number) => (
                  <CTableRow key={gallery.id}>
                    <CTableHeaderCell scope="row">
                      {(page - 1) * limit + index + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {gallery.thumbImg && (
                        <CImage
                          src={gallery.thumbImg}
                          width={80}
                          height={45}
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{gallery.title}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge
                        color={gallery.type === "image" ? "info" : "warning"}
                      >
                        {gallery.type === "image" ? "Şəkil" : "Video"}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {new Date(gallery.viewDate).toLocaleDateString("az-AZ")}
                    </CTableDataCell>
                    <CTableDataCell>
                      <Link href={`/admin/gallery/${gallery.id}`}>
                        <CButton color="info" size="sm" className="me-2">
                          <CIcon icon={cilPencil} />
                        </CButton>
                      </Link>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(gallery.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {galleries.length === 0 && (
              <p className="text-center text-muted">Qalereya tapılmadı</p>
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
