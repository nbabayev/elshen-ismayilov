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
  CButton,
  CSpinner,
  CImage,
} from "@coreui/react";
import { useSnackbar } from "notistack";
import { useRouter, useParams } from "next/navigation";
import {
  useMiniSliderById,
  useUpdateMiniSlider,
} from "@/app/hooks/useMiniSlider";

export default function EditMiniSliderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useMiniSliderById(id);
  const slider = data?.data;
  const { enqueueSnackbar } = useSnackbar();
  const updateMutation = useUpdateMiniSlider();

  const [formData, setFormData] = useState({
    Title: "",
    Link: "",
    ImageUrl: "",
    ListingNumber: 0,
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (slider) {
      setFormData({
        Title: slider.Title || "",
        Link: slider.Link || "",
        ImageUrl: slider.ImageUrl || "",
        ListingNumber: slider.ListingNumber || 0,
      });
    }
  }, [slider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Title", formData.Title);
    data.append("Link", formData.Link);
    data.append("ListingNumber", String(formData.ListingNumber));
    if (file) {
      data.append("ImageUrl", file);
    }

    updateMutation.mutate(
      { id, formData: data },
      {
        onSuccess: () => {
          enqueueSnackbar("Mini slayder uğurla yeniləndi!", {
            variant: "success",
          });
          router.push("/admin/mini-sliders");
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
            <strong>Mini Slayderi redaktə et</strong>
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
                  placeholder="Başlıq daxil edin"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Link</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.Link}
                  onChange={(e) =>
                    setFormData({ ...formData, Link: e.target.value })
                  }
                  placeholder="Link daxil edin"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Sıra nömrəsi</CFormLabel>
                <CFormInput
                  type="number"
                  value={formData.ListingNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ListingNumber: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              {formData.ImageUrl && (
                <div className="mb-3">
                  <CFormLabel>Mövcud şəkil</CFormLabel>
                  <div>
                    <CImage src={formData.ImageUrl} width={200} />
                  </div>
                </div>
              )}
              <div className="mb-3">
                <CFormLabel>Yeni şəkil</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
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
