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
import {
  useArticles,
  useDeleteArticle,
  useMoveArticle,
  useToggleArticleSelection,
  useToggleArticleVisibility,
} from "@/app/hooks/useArticle";
import Pagination from "@/app/admin/components/Pagination";
import {
  OrderButtons,
  VisibilityButton,
} from "@/app/admin/components/ContentOrderControls";

interface Article {
  Id: number;
  Title: string;
  Slug: string;
  Image: string;
  createdAt: string;
  isSelected?: boolean;
  isHidden?: boolean;
}

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const { data, isLoading } = useArticles({
    limit,
    page,
    enabled: true,
    selectedOnly: showSelectedOnly,
    includeHidden: true,
  });
  const articles = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);
  const { enqueueSnackbar } = useSnackbar();
  const deleteMutation = useDeleteArticle();
  const toggleSelectionMutation = useToggleArticleSelection();
  const moveMutation = useMoveArticle();
  const visibilityMutation = useToggleArticleVisibility();
  const reorderLocked = showSelectedOnly;

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
          result?.isHidden ? "Məqalə gizlədildi" : "Məqalə göstərilir",
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
        enqueueSnackbar("Məqalə uğurla silindi!", { variant: "success" }),
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
            <strong>Məqalələr</strong>
            <Link href="/admin/articles/add">
              <CButton color="primary" size="sm">
                Yeni əlavə et
              </CButton>
            </Link>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3 d-flex align-items-center">
              <div className="form-check">
                <input
                  title="Yalnız seçilmiş məqalələri göstər"
                  className="form-check-input"
                  type="checkbox"
                  id="showSelectedOnly"
                  checked={showSelectedOnly}
                  onChange={(e) => {
                    setShowSelectedOnly(e.target.checked);
                    setPage(1);
                  }}
                />
                <label className="form-check-label" htmlFor="showSelectedOnly">
                  Yalnız seçilmiş məqalələri göstər
                </label>
              </div>
              {reorderLocked && (
                <span className="text-muted ms-3">
                  Sıranı dəyişmək üçün filtri söndürün.
                </span>
              )}
            </div>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Şəkil</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Başlıq</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Slug</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tarix</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Sıra</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Əməliyyatlar</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {articles.map((article: Article, index: number) => (
                  <CTableRow
                    key={article.Id}
                    style={article.isHidden ? { opacity: 0.55 } : undefined}
                  >
                    <CTableHeaderCell scope="row">
                      {(page - 1) * limit + index + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {article.Image && (
                        <CImage
                          src={article.Image}
                          width={80}
                          height={45}
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{article.Title}</CTableDataCell>
                    <CTableDataCell>{article.Slug}</CTableDataCell>
                    <CTableDataCell>
                      {article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString(
                            "az-AZ"
                          )
                        : "-"}
                    </CTableDataCell>
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
                        onUp={() => handleMove(article.Id, "up")}
                        onDown={() => handleMove(article.Id, "down")}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <VisibilityButton
                        hidden={Boolean(article.isHidden)}
                        pending={visibilityMutation.isPending}
                        onToggle={() => handleVisibility(article.Id)}
                      />
                      <Link href={`/admin/articles/${article.Slug}`}>
                        <CButton color="info" size="sm" className="me-2">
                          <CIcon icon={cilPencil} />
                        </CButton>
                      </Link>
                      <CButton
                        color="danger"
                        size="sm"
                        className="me-2"
                        onClick={() => handleDelete(article.Id)}
                        disabled={deleteMutation.isPending}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                      <CButton
                        color="info"
                        size="sm"
                        disabled={toggleSelectionMutation.isPending}
                        onClick={() => {
                          toggleSelectionMutation.mutate(article.Id, {
                            onError: (error: any) => {
                              console.error("Toggle selection error:", error);
                              enqueueSnackbar("Xəta baş verdi", {
                                variant: "error",
                              });
                            },
                          });
                        }}
                      >
                        {article.isSelected
                          ? "Seçilmişlərdən çıxar"
                          : "Seçilmiş et"}
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {articles.length === 0 && (
              <p className="text-center text-muted">Məqalə tapılmadı</p>
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
