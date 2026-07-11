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
  CButton,
  CSpinner,
} from "@coreui/react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useCreateGallery } from "@/app/hooks/useGallery";

type GalleryCreateVideo = {
  title: string;
  videoUrl: string;
};

type GalleryCreateFormState = {
  title: string;
  type: "image" | "video";
  thumbImg: string | File;
  images: (string | File)[];
  viewDate: string;
  videos: GalleryCreateVideo[];
};

export default function AddGalleryPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateGallery();

  const [formData, setFormData] = useState<GalleryCreateFormState>({
    title: "",
    type: "image",
    thumbImg: "",
    images: [],
    viewDate: new Date().toISOString().split("T")[0],
    videos: [],
  });

  console.log(formData);
  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, thumbImg: file }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFormData((prev: any) => {
      const existingImageUrls =
        prev.images?.filter((img: any) => typeof img === "string") || [];
      return { ...prev, images: [...existingImageUrls, ...newFiles] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("type", formData.type);
    data.append("title", formData.title);
    data.append("viewDate", formData.viewDate);

    if (formData.thumbImg) {
      data.append("thumbImg", formData.thumbImg);
    }

    formData.images.forEach((image) => {
      data.append("images", image);
    });

    if (formData.type === "video") {
      data.append("videos", JSON.stringify(formData.videos));
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        enqueueSnackbar("Qalereya uğurla əlavə edildi!", {
          variant: "success",
        });
        router.push("/admin/gallery");
      },
      onError: () => enqueueSnackbar("Xəta baş verdi!", { variant: "error" }),
    });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Yeni Qalereya</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel>Başlıq</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Başlıq daxil edin"
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Növ</CFormLabel>
                <CFormSelect
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "image" | "video",
                    })
                  }
                >
                  <option value="image">Şəkil</option>
                  <option value="video">Video</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Örtük şəkli (URL)</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={handleThumbChange}
                />
                {formData.thumbImg && (
                  <div className="mt-2">
                    <img
                      src={
                        formData.thumbImg instanceof File
                          ? URL.createObjectURL(formData.thumbImg)
                          : formData.thumbImg
                      }
                      width={200}
                      alt="thumb"
                    />
                  </div>
                )}
              </div>
              {formData.type === "image" && (
                <>
                  <CFormLabel htmlFor="images">
                    Qalereyaya şəkillər yüklə
                  </CFormLabel>
                  <div className="mb-3 d-flex gap-3 flex-wrap">
                    {formData.images?.map((image: any, index: number) => (
                      <div key={index} style={{ width: 180 }}>
                        <img
                          src={
                            image instanceof File
                              ? URL.createObjectURL(image)
                              : image
                          }
                          alt={`preview-${index}`}
                          className="w-100"
                          style={{ maxHeight: 120, objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                  <CFormInput
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                    className="mb-3"
                  />
                </>
              )}
              <div className="mb-3">
                <CFormLabel>Tarix</CFormLabel>
                <CFormInput
                  type="date"
                  value={formData.viewDate}
                  onChange={(e) =>
                    setFormData({ ...formData, viewDate: e.target.value })
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
