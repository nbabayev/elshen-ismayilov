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
import { useSliders, useDeleteSlider } from "@/app/hooks/useSlider";
import Pagination from "@/app/admin/components/Pagination";

interface Slider {
  Id: number;
  Title: string;
  Image: string;
  ButtonText: string;
  ButtonLink: string;
  isVideo: boolean;
}

export default function SlidersPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useSliders({ page, limit });
  const sliders = data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);
  const deleteMutation = useDeleteSlider();

  const handleDelete = (id: number) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    deleteMutation.mutate(id);
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
            <strong>Slayderlər</strong>
            <Link href="/admin/sliders/add">
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
                  <CTableHeaderCell scope="col">Aktiv İmza</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Başlıq</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Video</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Əməliyyatlar</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {sliders.map((slider: Slider, index: number) => (
                  <CTableRow key={slider.Id}>
                    <CTableHeaderCell scope="row">
                      {(page - 1) * limit + index + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {slider.Image && (
                        <CImage
                          src={slider.Image}
                          width={80}
                          height={45}
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{slider.Title}</CTableDataCell>
                    <CTableDataCell>
                      {slider.isVideo ? "Bəli" : "Xeyr"}
                    </CTableDataCell>
                    <CTableDataCell>
                      <Link href={`/admin/sliders/${slider.Id}`}>
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
              <p className="text-center text-muted">Slayder tapılmadı</p>
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
