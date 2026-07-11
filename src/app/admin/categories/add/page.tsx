"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCategories, useCreateCategory } from "@/app/hooks/useCategory";

interface Category {
  Id: number;
  Name: string;
  Type: number;
  children?: Category[];
}

export default function AddCategoryPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useCategories(true);
  const categories = data?.data || [];
  const createMutation = useCreateCategory();

  const [formData, setFormData] = useState({
    Name: "",
    Type: 0,
    ParentId: null as number | null,
    isHidden: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: () => {
        enqueueSnackbar("Kateqoriya uğurla əlavə edildi!", {
          variant: "success",
        });
        router.push("/admin/categories");
      },
      onError: () => enqueueSnackbar("Xəta baş verdi!", { variant: "error" }),
    });
  };

  const flattenCategories = (
    cats: Category[],
    level = 0
  ): { id: number; name: string; type: number }[] => {
    const result: { id: number; name: string; type: number }[] = [];
    cats.forEach((cat) => {
      result.push({
        id: cat.Id,
        name: "─".repeat(level) + " " + cat.Name,
        type: cat.Type,
      });
      if (cat.children) {
        result.push(...flattenCategories(cat.children, level + 1));
      }
    });
    return result;
  };
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Yeni Kateqoriya</strong>
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
                  <option value={2}>Verilişlər</option>
                  <option value={3}>Təlimlər</option>
                  <option value={4}>Məqalələr</option>
                  <option value={5}>Kitablar</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Ana kateqoriya</CFormLabel>
                <CFormSelect
                  value={formData.ParentId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ParentId: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                >
                  <option value="">Ana kateqoriya yoxdur</option>
                  {flattenCategories(categories)
                    .filter((cat) => cat.type === formData.Type)
                    .map((cat) => (
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
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? <CSpinner size="sm" /> : "Əlavə et"}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
