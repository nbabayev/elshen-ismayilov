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
  CFormCheck,
  CButton,
  CSpinner,
  CImage,
} from "@coreui/react";
import { useSnackbar } from "notistack";
import { useRouter, useParams } from "next/navigation";
import { useSliderById, useUpdateSlider } from "@/app/hooks/useSlider";

export default function EditSliderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: slider, isLoading } = useSliderById(id);
  const { enqueueSnackbar } = useSnackbar();
  const updateMutation = useUpdateSlider();

  const [formData, setFormData] = useState({
    Title: "",
    Image: "",
    isVideo: false,
    isContent: true,
    Signature: false,
    Link: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (slider) {
      setFormData({
        Title: slider.Title || "",
        Image: slider.Image || "",
        isVideo: slider.isVideo || false,
        isContent: slider.isContent ?? true,
        Signature: slider.Signature || false,
        Link: slider.Link || "",
      });
    }
  }, [slider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Title", formData.Title);
    data.append("isVideo", String(formData.isVideo));
    data.append("isContent", String(formData.isContent));
    data.append("Signature", String(formData.Signature));
    data.append("Link", String(formData.Link));
    if (file) {
      data.append("Image", file);
    }

    updateMutation.mutate(
      { id, formData: data },
      {
        onSuccess: () => {
          enqueueSnackbar("Slayder uğurla yeniləndi!", { variant: "success" });
          router.push("/admin/sliders");
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
            <strong>Slayderi redaktə et</strong>
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
                <CFormLabel>link</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.Link}
                  onChange={(e) =>
                    setFormData({ ...formData, Link: e.target.value })
                  }
                  placeholder="Link"
                />
              </div>
              {formData.Image && (
                <div className="mb-3">
                  <CFormLabel>Mövcud şəkil</CFormLabel>
                  <div>
                    <CImage src={formData.Image} width={200} />
                  </div>
                </div>
              )}
              <div className="mb-3">
                <CFormLabel>Yeni şəkil/Video</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="mb-3">
                <CFormCheck
                  id="isVideo"
                  label="Video"
                  checked={formData.isVideo}
                  onChange={(e) =>
                    setFormData({ ...formData, isVideo: e.target.checked })
                  }
                />
              </div>
              <div className="mb-3">
                <CFormCheck
                  id="isContent"
                  label="Məzmun göstər"
                  checked={formData.isContent}
                  onChange={(e) =>
                    setFormData({ ...formData, isContent: e.target.checked })
                  }
                />
              </div>
              <div className="mb-3">
                <CFormCheck
                  id="Signature"
                  label="İmza"
                  checked={formData.Signature}
                  onChange={(e) =>
                    setFormData({ ...formData, Signature: e.target.checked })
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
