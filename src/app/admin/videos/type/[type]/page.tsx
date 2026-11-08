"use client";

import React, { useState, useEffect } from "react";
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
  CFormInput,
  CInputGroup,
} from "@coreui/react";
import { useSnackbar } from "notistack";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilMagnifyingGlass } from "@coreui/icons";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useVideos,
  useDeleteVideo,
  useMoveVideo,
  useToggleVideoSelection,
  useToggleVideoVisibility,
} from "@/app/hooks/useVideos";
import Pagination from "@/app/admin/components/Pagination";
import {
  OrderButtons,
  VisibilityButton,
} from "@/app/admin/components/ContentOrderControls";

interface Video {
  Id: number;
  Title: string;
  Image: string;
  YoutubeLink: string;
  Type: number;
  Category: string;
  ViewCount: number;
  isSelected?: boolean;
  isHidden?: boolean;
}

// this poage displays the table of videos based on the type (lessons, sermons, trainings, etc.)
//  and allows the ADMIN to search, edit, or delete videos. It also includes pagination for easier navigation through large lists of videos.

const typeLabels: Record<string, string> = {
  "0": "Dərslər",
  "1": "Moizələr",
  "2": "Verilişlər",
  "3": "Təlimlər",
};

export default function VideosPage() {
  const params = useParams();
  const type = params.type as string;

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 10;
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Debounce search query - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useVideos({
    limit,
    page,
    type: Number(type),
    enabled: true,
    // isAdmin: true,
    selectedOnly: showSelectedOnly,
    search: debouncedSearch || undefined,
    includeHidden: true,
  });
  const videos = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);
  const { enqueueSnackbar } = useSnackbar();
  const deleteMutation = useDeleteVideo();
  const toggleSelectionMutation = useToggleVideoSelection();
  const moveMutation = useMoveVideo();
  const visibilityMutation = useToggleVideoVisibility();
  const reorderLocked = showSelectedOnly || Boolean(debouncedSearch);

  const handleMove = (id: number, direction: "up" | "down") => {
    moveMutation.mutate(
      { id, direction },
      {
        onSuccess: (result) => {
          if (result?.moved) {
            enqueueSnackbar("Sıra yeniləndi", { variant: "success" });
          }
        },
        onError: (error: any) =>
          enqueueSnackbar("Xəta baş verdi: " + (error?.message || ""), {
            variant: "error",
          }),
      }
    );
  };

  const handleVisibility = (id: number) => {
    visibilityMutation.mutate(id, {
      onSuccess: (result) =>
        enqueueSnackbar(
          result?.isHidden ? "Video gizlədildi" : "Video göstərilir",
          { variant: "success" }
        ),
      onError: (error: any) =>
        enqueueSnackbar("Xəta baş verdi: " + (error?.message || ""), {
          variant: "error",
        }),
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () =>
        enqueueSnackbar("Video uğurla silindi!", { variant: "success" }),
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
            <strong>{typeLabels[type] || "Videolar"}</strong>
            <Link href={`/admin/videos/add?type=${type}`}>
              <CButton color="primary" size="sm">
                Yeni əlavə et
              </CButton>
            </Link>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3 d-flex align-items-center">
              <CInputGroup>
                <CFormInput
                  type="text"
                  placeholder="Video başlığına görə axtar..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
                <CButton color="secondary" variant="outline">
                  <CIcon icon={cilMagnifyingGlass} />
                </CButton>
                {(searchQuery || debouncedSearch) && (
                  <CButton
                    color="secondary"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setDebouncedSearch("");
                      setPage(1);
                    }}
                  >
                    Təmizlə
                  </CButton>
                )}
              </CInputGroup>
              <div className="ms-3 d-flex align-items-center">
                <div className="form-check">
                  <input
                    title="Yalnız seçilmiş videoları göstər"
                    className="form-check-input"
                    type="checkbox"
                    id="showSelectedOnly"
                    checked={showSelectedOnly}
                    onChange={(e) => setShowSelectedOnly(e.target.checked)}
                  />
                </div>
              </div>
              {reorderLocked && (
                <span className="text-muted ms-3">
                  Sıranı dəyişmək üçün axtarışı və filtri söndürün.
                </span>
              )}
            </div>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Şəkil</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Başlıq</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Baxış</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Sıra</CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    style={{ width: "300px", minWidth: "350px" }}
                  >
                    Əməliyyatlar
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {videos
                  .filter((v: Video) =>
                    showSelectedOnly ? v.isSelected : true
                  )
                  .map((video: Video, index: number) => (
                    <CTableRow
                      key={video.Id}
                      style={video.isHidden ? { opacity: 0.55 } : undefined}
                    >
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
                        <OrderButtons
                          disabledUp={
                            reorderLocked || (page - 1) * limit + index === 0
                          }
                          disabledDown={
                            reorderLocked ||
                            (page - 1) * limit + index >= (data?.total || 0) - 1
                          }
                          pending={moveMutation.isPending}
                          onUp={() => handleMove(video.Id, "up")}
                          onDown={() => handleMove(video.Id, "down")}
                        />
                      </CTableDataCell>
                      <CTableDataCell
                        style={{ width: "300px", whiteSpace: "nowrap" }}
                      >
                        <VisibilityButton
                          hidden={Boolean(video.isHidden)}
                          pending={visibilityMutation.isPending}
                          onToggle={() => handleVisibility(video.Id)}
                        />
                        <Link href={`/admin/videos/${video.Id}`}>
                          <CButton color="info" size="sm" className="me-2">
                            <CIcon icon={cilPencil} />
                          </CButton>
                        </Link>
                        <CButton
                          color="danger"
                          size="sm"
                          className="me-2"
                          onClick={() => handleDelete(video.Id)}
                          disabled={deleteMutation.isPending}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                        <CButton
                          color="info"
                          size="sm"
                          disabled={toggleSelectionMutation.isPending}
                          onClick={() => {
                            toggleSelectionMutation.mutate(video.Id, {
                              onError: (error: any) => {
                                console.error("Toggle selection error:", error);
                                enqueueSnackbar("Xəta baş verdi", {
                                  variant: "error",
                                });
                              },
                            });
                          }}
                        >
                          {video.isSelected
                            ? "Seçilmişlərdən çıxar"
                            : "Seçilmiş et"}
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>
            {videos.length === 0 && (
              <p className="text-center text-muted">
                {debouncedSearch
                  ? `"${debouncedSearch}" axtarışına uyğun video tapılmadı`
                  : "Video tapılmadı"}
              </p>
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
