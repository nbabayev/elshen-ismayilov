"use client";

import React from "react";
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
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
import Link from "next/link";
import { useCategories, useDeleteCategory } from "@/app/hooks/useCategory";

interface Category {
  Id: number;
  Name: string;
  Type: number;
  ParentId: number | null;
  isHidden: number;
  children?: Category[];
}

const typeLabels: Record<number, string> = {
  0: "Dərslər",
  1: "Moizələr",
  2: "Verilişlər",
  3: "Təlimlər",
  4: "Məqalələr",
};

export default function CategoriesPage() {
  const { data, isLoading } = useCategories(true);
  const categories = data?.data || [];
  const deleteMutation = useDeleteCategory();

  const handleDelete = (id: number) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    deleteMutation.mutate(id);
  };

  const renderCategory = (category: Category, level: number = 0) => {
    return (
      <React.Fragment key={category.Id}>
        <CTableRow>
          {/* <CTableHeaderCell scope="row">{category.Id}</CTableHeaderCell> */}
          <CTableDataCell>
            <span style={{ paddingLeft: `${level * 20}px` }}>
              {level > 0 && "└ "}
              {category.Name}
            </span>
          </CTableDataCell>
          <CTableDataCell>
            <CBadge color="info">
              {typeLabels[category.Type] || "Naməlum"}
            </CBadge>
          </CTableDataCell>
          <CTableDataCell>
            <CBadge color={category.isHidden ? "secondary" : "success"}>
              {category.isHidden ? "Gizli" : "Aktiv"}
            </CBadge>
          </CTableDataCell>
          <CTableDataCell>
            <Link href={`/admin/categories/${category.Id}`}>
              <CButton color="info" size="sm" className="me-2">
                <CIcon icon={cilPencil} />
              </CButton>
            </Link>
            <CButton
              color="danger"
              size="sm"
              onClick={() => handleDelete(category.Id)}
              disabled={deleteMutation.isPending}
            >
              <CIcon icon={cilTrash} />
            </CButton>
          </CTableDataCell>
        </CTableRow>
        {category.children?.map((child) => renderCategory(child, level + 1))}
      </React.Fragment>
    );
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
            <strong>Kateqoriyalar</strong>
            <Link href="/admin/categories/add">
              <CButton color="primary" size="sm">
                Kateqoriya əlavə et
              </CButton>
            </Link>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  {/* <CTableHeaderCell scope="col">ID</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Ad</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Kateqoriya</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Əməliyyatlar</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {categories.map((category: Category) =>
                  renderCategory(category)
                )}
              </CTableBody>
            </CTable>
            {categories.length === 0 && (
              <p className="text-center text-muted">Kateqoriya tapılmadı</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
