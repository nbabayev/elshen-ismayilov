"use client";

import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CButton,
  CSpinner,
} from "@coreui/react";
import { useRouter, useParams } from "next/navigation";
import {
  useCategories,
  useCategoryById,
  useUpdateCategory,
} from "@/app/hooks/useCategory";

interface Category {
  Id: number;
  Name: string;
  Type: number;
  children?: Category[];
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: categoryData, isLoading } = useCategoryById(id);
  const category = categoryData?.data;
  const { data: categoriesData } = useCategories(true);
  const categories = categoriesData?.data || [];
  const updateMutation = useUpdateCategory();

  const [formData, setFormData] = useState({
    Name: "",
    Type: 0,
    ParentId: null as number | null,
    isHidden: 0,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        Name: category.Name || "",
        Type: category.Type || 0,
        ParentId: category.ParentId || null,
        isHidden: category.isHidden || 0,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => router.push("/admin/categories"),
        onError: () => alert("Xəta baş verdi!"),
      }
    );
  };

  const flattenCategories = (
    cats: Category[],
    level = 0,
    excludeId?: number
  ): { id: number; name: string }[] => {
    const result: { id: number; name: string }[] = [];
    cats.forEach((cat) => {
      if (cat.Id !== excludeId) {
        result.push({ id: cat.Id, name: "─".repeat(level) + " " + cat.Name });
        if (cat.children) {
          result.push(...flattenCategories(cat.children, level + 1, excludeId));
        }
      }
    });
    return result;
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
          <CCardHeader>
            <strong>Kateqoriyanı redaktə et</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel>Ad</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  placeholder="Kateqoriya adı"
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Növ</CFormLabel>
                <CFormSelect
                  value={formData.Type}
                  onChange={(e) =>
                    setFormData({ ...formData, Type: parseInt(e.target.value) })
                  }
                >
                  <option value={0}>Dərslər</option>
                  <option value={1}>Moizələr</option>
                  <option value={2}>Təlimlər</option>
                  <option value={3}>Verilişlər</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Ana kateqoriya</CFormLabel>
                <CFormSelect
                  value={formData.ParentId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ParentId: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                >
                  <option value="">Ana kateqoriya yoxdur</option>
                  {flattenCategories(categories, 0, Number(id)).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormCheck
                  id="isHidden"
                  label="Gizli"
                  checked={formData.isHidden === 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isHidden: e.target.checked ? 1 : 0,
                    })
                  }
                />
              </div>
              <CButton
                type="submit"
                color="primary"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <CSpinner size="sm" />
                ) : (
                  "Yadda saxla"
                )}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
