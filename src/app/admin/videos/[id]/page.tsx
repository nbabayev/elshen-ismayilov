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
  CImage,
} from "@coreui/react";
import { useSnackbar } from "notistack";
import { useRouter, useParams } from "next/navigation";
import { useVideoById, useUpdateVideo } from "@/app/hooks/useVideos";
import { useCategory } from "@/app/hooks/useCategory";

// This page is for editing an existing video. It fetches the video data by ID,
// allows the ADMIN to edit the details, and then updates the video on form submission.

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: videoData, isLoading } = useVideoById(id, true);
  const video = videoData?.data || videoData;
  const { enqueueSnackbar } = useSnackbar();
  const updateMutation = useUpdateVideo();

  const [videoType, setVideoType] = useState<number>(0);
  const { data: categoriesData } = useCategory(videoType);
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    Title: "",
    Link: "",
    NonEmbedLink: "",
    Type: 0,
    Thumb_img: null as File | string | null,
    Selected_Thumb_img: null as File | string | null,
    CategoryIds: [] as number[],
  });

  useEffect(() => {
    if (video) {
      const type = video.Type || 0;
      setVideoType(type);
      setFormData({
        Title: video.Title || "",
        Link: video.Link || "",
        NonEmbedLink: video.NonEmbedLink || "",
        Type: type,
        Thumb_img: video.Thumb_img || null,
        Selected_Thumb_img: video.Selected_Thumb_img || null,
        CategoryIds: video.categories?.map((cat: any) => cat.Id) || [],
      });
    }
  }, [video]);

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

    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          enqueueSnackbar("Video uğurla yeniləndi!", { variant: "success" });
          router.push(`/admin/videos/type/${formData.Type}`);
        },
        onError: (error: any) => {
          enqueueSnackbar(
            "Xəta baş verdi: " + (error.message || "Naməlum xəta"),
            { variant: "error" }
          );
        },
      }
    );
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
    } else if (value && typeof value === "string") {
      return (
        <div className="mt-2">
          <CImage
            src={value}
            width={150}
            height={100}
            className="object-contain border rounded p-1"
          />
          <p className="text-xs text-muted mt-1">Mövcud şəkil</p>
        </div>
      );
    }
    return null;
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
            <strong>Videonu redaktə et</strong>
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
                    {categories.map((cat: any) => renderCategoryItem(cat))}
                  </div>
                </div>
              )}

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
