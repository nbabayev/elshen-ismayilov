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
  CFormTextarea,
  CButton,
  CSpinner,
  CImage,
  CFormCheck,
} from "@coreui/react";
import { useSnackbar } from "notistack";

import "react-quill-new/dist/quill.snow.css";
import { useRouter, useParams } from "next/navigation";
import { useArticleById, useUpdateArticle } from "@/app/hooks/useArticle";
import { useCategory } from "@/app/hooks/useCategory";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Yüklənir...</p>, // Yüklənənə qədər görünəcək hissə
});

const TiptapEditor = dynamic(() => import("@/app/admin/TextEditor"), {
  ssr: false, // editor yalnız client-də render olunsun
  loading: () => <p>Yüklənir...</p>,
});

// ...

export default function EditArticlePage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const slug = params.slug as string;
  const { data, isLoading } = useArticleById(slug);
  const article = data?.data || data;
  const updateMutation = useUpdateArticle();
  const { data: categoriesData } = useCategory(4);
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    Title: "",
    ShortDescription: "",
    Content: "",
    Image: "",
    ViewDate: "",
    ReadMinute: "",
    CategoryIds: [] as number[],
  });

  const getCategoryId = (cat: any) =>
    Number(cat?.Id ?? cat?.id ?? cat?.CategoryId ?? cat?.categoryId);

  const normalizeCategoryIds = (cats: any[]) =>
    (cats || [])
      .map((cat: any) => getCategoryId(cat))
      .filter((id) => !Number.isNaN(id));

  useEffect(() => {
    if (article) {
      setFormData({
        Title: article.Title || "",
        ShortDescription: article.ShortDescription || article.Description || "",
        Content: article.Content || "",
        Image: article.Image || "",
        ViewDate: article.ViewDate || "",
        ReadMinute: article.ReadMinute || "",
        CategoryIds: normalizeCategoryIds(article.categories),
      });
    }
  }, [article]);

  const handleCategoryChange = (categoryId: number) => {
    setFormData((prev) => {
      const normalizedId = Number(categoryId);
      const newCategoryIds = prev.CategoryIds.includes(normalizedId)
        ? prev.CategoryIds.filter((id) => id !== normalizedId)
        : [...prev.CategoryIds, normalizedId];
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

    updateMutation.mutate(
      { slug, data: formData },
      {
        onSuccess: () => {
          enqueueSnackbar("Məqalə uğurla yeniləndi!", {
            variant: "success",
          });
          router.push("/admin/articles");
        },
        onError: () => enqueueSnackbar("Xəta baş verdi!", { variant: "error" }),
      }
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
          <CCardHeader>
            <strong>Məqaləni redaktə et</strong>
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
                  value={
                    formData?.ViewDate
                      ? new Intl.DateTimeFormat("az-AZ").format(
                          new Date(formData.ViewDate)
                        )
                      : ""
                  }
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

              {formData.Image && (
                <div className="mb-3">
                  <CFormLabel>Mövcud şəkil</CFormLabel>
                  <div>
                    <CImage src={formData.Image} width={200} />
                  </div>
                </div>
              )}
              <div className="mb-3">
                <CFormLabel>Şəkil URL</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.Image}
                  onChange={(e) =>
                    setFormData({ ...formData, Image: e.target.value })
                  }
                  placeholder="Şəkil URL-i"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Məzmun</CFormLabel>
                {/* <ReactQuill
                  placeholder="Məqalə məzmunu"
                  value={formData?.Content}
                  onChange={(value: string) =>
                    setFormData({ ...formData, Content: value })
                  }
                  style={{ height: "300px" }}
                /> */}
                {!isLoading && (
                  <TiptapEditor
                    key={article?.Id ?? slug}
                    content={formData.Content}
                    onChange={(value: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        Content: value,
                      }))
                    }
                  />
                )}
              </div>
              <div className="text-right mt-[60px]">
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
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
