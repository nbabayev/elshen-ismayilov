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
  CFormTextarea,
  CButton,
  CSpinner,
  CFormCheck,
} from "@coreui/react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCreateArticle } from "@/app/hooks/useArticle";
import { useCategory } from "@/app/hooks/useCategory";

export default function AddArticlePage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateArticle();
  const { data: categoriesData } = useCategory(4);
  const categories = categoriesData?.data || [];

  type ArticleForm = {
    Title: string;
    ShortDescription: string;
    Content: string;
    Image: File | string;
    ViewDate: string;
    ReadMinute: string;
    NotifyUsers: boolean;
    CategoryIds: number[];
  };
  const [formData, setFormData] = useState<ArticleForm>({
    Title: "",
    ShortDescription: "",
    Content: "",
    Image: "",
    ViewDate: "",
    ReadMinute: "",
    NotifyUsers: false,
    CategoryIds: [],
  });
  const handleCategoryChange = (categoryId: number) => {
    setFormData((prev) => {
      const newCategoryIds = prev.CategoryIds.includes(categoryId)
        ? prev.CategoryIds.filter((id) => id !== categoryId)
        : [...prev.CategoryIds, categoryId];
      return { ...prev, CategoryIds: newCategoryIds };
    });
  };

  const renderCategoryItem = (cat: any, level = 0): React.ReactNode => {
    const childCategories = cat.Children || cat.children || [];
    return (
      <div key={cat.Id} className="mb-2" style={{ marginLeft: level * 20 }}>
        <CFormCheck
          id={`category-${cat.Id}`}
          label={cat.Name}
          checked={formData.CategoryIds.includes(cat.Id)}
          onChange={() => handleCategoryChange(cat.Id)}
        />
        {childCategories.length > 0 && (
          <div className="mt-2">
            {childCategories.map((child: any) =>
              renderCategoryItem(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: () => {
        enqueueSnackbar("Məqalə uğurla əlavə edildi!", {
          variant: "success",
        });
        router.push("/admin/articles");
      },
      onError: () => enqueueSnackbar("Xəta baş verdi!", { variant: "error" }),
    });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Yeni Məqalə</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel>Başlıq</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.Title}
                  onChange={(e) =>
                    setFormData({ ...formData, Title: e.target.value })
                  }
                  placeholder="Məqalə başlığı"
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Qısa təsvir</CFormLabel>
                <CFormTextarea
                  rows={3}
                  value={formData.ShortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ShortDescription: e.target.value,
                    })
                  }
                  placeholder="Qısa təsvir"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Baxış tarixi</CFormLabel>
                <CFormInput
                  type="date"
                  value={formData.ViewDate}
                  onChange={(e) =>
                    setFormData({ ...formData, ViewDate: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Oxuma dəqiqəsi</CFormLabel>
                <CFormInput
                  type="number"
                  min={0}
                  value={formData.ReadMinute}
                  onChange={(e) =>
                    setFormData({ ...formData, ReadMinute: e.target.value })
                  }
                  placeholder="Oxuma dəqiqəsi"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Məzmun</CFormLabel>
                <CFormTextarea
                  rows={10}
                  value={formData.Content}
                  onChange={(e) =>
                    setFormData({ ...formData, Content: e.target.value })
                  }
                  placeholder="Məqalə məzmunu"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Şəkil URL</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Image: (e.target.files?.[0] ?? "") as File | string,
                    })
                  }
                />
              </div>
              {categories.length > 0 && (
                <div className="mb-3">
                  <CFormLabel>Kateqoriyalar</CFormLabel>
                  <div
                    className="border rounded p-3"
                    style={{ maxHeight: "220px", overflowY: "auto" }}
                  >
                    {categories.map((cat: any) => renderCategoryItem(cat))}
                  </div>
                </div>
              )}
              <div className="mb-3">
                <CFormLabel className="me-2">
                  İstifadəçilərə bildiriş göndərilsin?
                </CFormLabel>
                <CFormCheck
                  onChange={(e) =>
                    setFormData({ ...formData, NotifyUsers: e.target.checked })
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
