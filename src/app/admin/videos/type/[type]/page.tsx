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
import { useParams } from "next/navigation";
import Link from "next/link";
import { useVideos, useDeleteVideo } from "@/app/hooks/useVideos";
import Pagination from "@/app/admin/components/Pagination";

interface Video {
  Id: number;
  Title: string;
  Image: string;
  YoutubeLink: string;
  Type: number;
  ViewCount: number;
}

const typeLabels: Record<string, string> = {
  "0": "Dərslər",
  "1": "Moizələr",
  "2": "Təlimlər",
  "3": "Verilişlər",
};

export default function VideosPage() {
  const params = useParams();
  const type = params.type as string;

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useVideos({
    limit,
    page,
    type: Number(type),
    enabled: true,
  });
  const videos = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);
  const deleteMutation = useDeleteVideo();

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
            <strong>{typeLabels[type] || "Videolar"}</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Şəkil</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Başlıq</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Baxış</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Əməliyyatlar</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {videos.map((video: Video, index: number) => (
                  <CTableRow key={video.Id}>
                    <CTableHeaderCell scope="row">
                      {(page - 1) * limit + index + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {video.Image && (
                        <CImage
                          src={video.Image}
                          width={80}
                          height={45}
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{video.Title}</CTableDataCell>
                    <CTableDataCell>{video.ViewCount || 0}</CTableDataCell>
                    <CTableDataCell>
                      <Link href={`/admin/videos/${video.Id}`}>
                        <CButton color="info" size="sm" className="me-2">
                          <CIcon icon={cilPencil} />
                        </CButton>
                      </Link>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(video.Id)}
                        disabled={deleteMutation.isPending}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {videos.length === 0 && (
              <p className="text-center text-muted">Video tapılmadı</p>
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
