"use client";

import React, { Suspense, useState } from "react";
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
  CImage,
} from "@coreui/react";
import { useSnackbar } from "notistack";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateVideo } from "@/app/hooks/useVideos";
import { useCategory } from "@/app/hooks/useCategory";

// This page is for adding a new video. It includes a form where the ADMIN can input video details,
//  select the type, upload thumbnail images, and choose categories. On form submission, it creates a new video entry in the database.

export function VideoForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const initialType = parseInt(searchParams.get("type") || "0");
  const createMutation = useCreateVideo();
  const [videoType, setVideoType] = useState<number>(initialType);
  const { data: categoriesData } = useCategory(videoType);
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    Title: "",
    Link: "",
    NonEmbedLink: "",
    Type: initialType,
    Thumb_img: null as File | string | null,
    Selected_Thumb_img: null as File | string | null,
    CategoryIds: [] as number[],
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "Thumb_img" | "Selected_Thumb_img"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData((prev) => {
      const newCategoryIds = prev.CategoryIds.includes(categoryId)
        ? prev.CategoryIds.filter((id) => id !== categoryId)
        : [...prev.CategoryIds, categoryId];
      return { ...prev, CategoryIds: newCategoryIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: () => {
        enqueueSnackbar("Video uğurla əlavə edildi!", { variant: "success" });
        router.push(`/admin/videos/type/${formData.Type}`);
      },
      onError: (error: any) => {
        enqueueSnackbar(
          "Xəta baş verdi: " + (error.message || "Naməlum xəta"),
          { variant: "error" }
        );
      },
    });
  };

  const renderImagePreview = (field: "Thumb_img" | "Selected_Thumb_img") => {
    const value = formData[field];
    if (value instanceof File) {
      return (
        <div className="mt-2">
          <CImage
            src={URL.createObjectURL(value)}
            width={150}
            height={100}
            className="object-contain border rounded p-1"
          />
          <p className="text-xs text-muted mt-1">Yeni seçilmiş: {value.name}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Yeni Video</strong>
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
                  placeholder="Video başlığı"
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Növ</CFormLabel>
                <CFormSelect
                  value={formData.Type}
                  onChange={(e) => {
                    const newType = parseInt(e.target.value);
                    setVideoType(newType);
                    setFormData({
                      ...formData,
                      Type: newType,
                      CategoryIds: [], // Reset categories when type changes
                    });
                  }}
                >
                  <option value={0}>Dərslər</option>
                  <option value={1}>Moizələr</option>
                  <option value={2}>Təlimlər</option>
                  <option value={3}>Verilişlər</option>
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel>YouTube Link</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.Link}
                  onChange={(e) =>
                    setFormData({ ...formData, Link: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Alternativ Link (İsteğe bağlı)</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.NonEmbedLink}
                  onChange={(e) =>
                    setFormData({ ...formData, NonEmbedLink: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="mb-3">
                <CFormLabel>Thumbnail Şəkli</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "Thumb_img")}
                  required
                />
                {renderImagePreview("Thumb_img")}
              </div>

              <div className="mb-3">
                <CFormLabel>Seçilmiş Thumbnail Şəkli (İsteğe bağlı)</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "Selected_Thumb_img")}
                />
                {renderImagePreview("Selected_Thumb_img")}
              </div>

              {categories.length > 0 && (
                <div className="mb-3">
                  <CFormLabel>Kateqoriyalar</CFormLabel>
                  <div
                    className="border rounded p-3"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {categories.map((cat: any) => (
                      <CFormCheck
                        key={cat.Id}
                        id={`category-${cat.Id}`}
                        label={cat.Name}
                        checked={formData.CategoryIds.includes(cat.Id)}
                        onChange={() => handleCategoryChange(cat.Id)}
                      />
                    ))}
                  </div>
                </div>
              )}

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

export default function AddVideoPage() {
  return (
    <Suspense fallback={<div>Yüklənir...</div>}>
      <VideoForm />
    </Suspense>
  );
}
