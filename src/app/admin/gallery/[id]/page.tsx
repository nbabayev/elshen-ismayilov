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
  CButton,
  CSpinner,
  CImage,
} from "@coreui/react";
import { useRouter, useParams } from "next/navigation";
import { useGalleryById, useUpdateGallery } from "@/app/hooks/useGallery";

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading } = useGalleryById(id);
  const gallery = data?.data;
  const updateMutation = useUpdateGallery();

  const [formData, setFormData] = useState({
    title: "",
    type: "image" as "image" | "video",
    thumbImg: "",
    viewDate: "",
    images: [
      {
        imageUrl: "null" as string | File,
      },
    ],
    videos: [
      {
        title: "" as string,
        videoUrl: "" as string,
      },
    ],
  });

  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title || "",
        type: gallery.type || "image",
        thumbImg: gallery.thumbImg || "",
        images: gallery.images || [],
        videos: gallery.videos || [],
        viewDate: gallery.viewDate
          ? new Date(gallery.viewDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [gallery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => router.push("/admin/gallery"),
        onError: () => alert("Xəta baş verdi!"),
      }
    );
  };

  const removeVideo = (index: number) => {
    const newVideos = formData.videos.filter((_, i) => i !== index);
    setFormData({ ...formData, videos: newVideos });
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prevForm) => ({
      ...prevForm,
      images: prevForm.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFormData((prevForm: any) => {
      // Filter out existing files that might have been re-selected (optional, but good for uniqueness)
      const existingImageUrls = prevForm.images.filter(
        (image: any) => typeof image === "string"
      );
      // Combine existing URLs with new File objects
      return { ...prevForm, images: [...existingImageUrls, ...newFiles] };
    });
  };

  const handleVideosChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newVideos = [...formData.videos];
    if (e.target.name === "videoUrl") {
      newVideos[index] = { ...newVideos[index], videoUrl: e.target.value };
    } else if (e.target.name === "videoTitle") {
      newVideos[index] = { ...newVideos[index], title: e.target.value };
    }
    setFormData({ ...formData, videos: newVideos });
  };

  const addVideoField = () => {
    setFormData({
      ...formData,
      videos: [...formData.videos, { videoUrl: "", title: "" }],
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
          <CCardHeader>
            <strong>Qalereyani redaktə et</strong>
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
              {formData.thumbImg && (
                <div className="mb-3">
                  <CFormLabel>Mövcud örtük şəkli</CFormLabel>
                  <div>
                    <CImage src={formData.thumbImg} width={200} />
                  </div>
                </div>
              )}
              <div className="mb-3">
                <CFormLabel>Örtük şəkli (URL)</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.thumbImg}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbImg: e.target.value })
                  }
                  placeholder="Şəkil URL-i daxil edin"
                />
              </div>
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
              {formData.type === "image" && (
                <>
                  <CFormLabel htmlFor="images">
                    Qalereyaya şəkillər yüklə *
                  </CFormLabel>
                  <div className="mb-3 d-flex gap-3 flex-wrap">
                    {formData.images.map((image, index) => (
                      <CCard style={{ width: "18rem" }} key={index}>
                        <CCardBody>
                          <img
                            src={
                              image?.imageUrl instanceof File
                                ? URL.createObjectURL(image?.imageUrl)
                                : image?.imageUrl
                            }
                            alt={`Preview ${index + 1}`}
                            className="w-100"
                            style={{ maxHeight: "200px", objectFit: "cover" }}
                          />
                          <div className="mt-2 text-end">
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => removeImage(index)}
                            >
                              Sil
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
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
              {formData.type === "video" && (
                <>
                  <CFormLabel>Videolar *</CFormLabel>
                  {formData.videos.map((video, index) => (
                    <div key={index} className="mb-3 p-3 border rounded">
                      <CFormLabel>Video URL {index + 1} *</CFormLabel>
                      <CFormInput
                        type="text"
                        name="videoUrl"
                        value={video.videoUrl || ""}
                        onChange={(e) => handleVideosChange(e, index)}
                        className="mb-2"
                        placeholder="https://..."
                      />
                      <CFormLabel>Video Başlığı (opsional)</CFormLabel>
                      <CFormInput
                        type="text"
                        name="videoTitle"
                        value={video.title || ""}
                        onChange={(e) => handleVideosChange(e, index)}
                        className="mb-2"
                        placeholder="Video başlığı"
                      />
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => removeVideo(index)}
                      >
                        Sil
                      </CButton>
                    </div>
                  ))}
                  <CButton
                    color="primary"
                    className="mb-3"
                    onClick={addVideoField}
                  >
                    Video Əlavə Et
                  </CButton>
                </>
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
