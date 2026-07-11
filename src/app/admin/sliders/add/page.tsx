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
  CFormCheck,
  CButton,
  CSpinner,
} from "@coreui/react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useCreateSlider } from "@/app/hooks/useSlider";

export default function AddSliderPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateSlider();

  const [formData, setFormData] = useState({
    Title: "",
    isVideo: false,
    isContent: true,
    Signature: false,
    Link: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Title", formData.Title);
    data.append("isVideo", String(formData.isVideo));
    data.append("isContent", String(formData.isContent));
    data.append("Signature", String(formData.Signature));
    data.append("Link", String(formData.Link));
    if (file) {
      data.append("file", file);
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        enqueueSnackbar("Slayder uğurla əlavə edildi!", { variant: "success" });
        router.push("/admin/sliders");
      },
      onError: () => enqueueSnackbar("Xəta baş verdi!", { variant: "error" }),
    });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Yeni Slayder</strong>
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
                <CFormLabel>Şəkil/Video</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="mb-3">
                <CFormCheck
                  id="isVideo"
                  type="radio"
                  name="mediaType"
                  label="Video"
                  checked={formData.isVideo}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      isVideo: true,
                      isContent: false,
                    })
                  }
                />
                <CFormCheck
                  id="isContent"
                  type="radio"
                  name="mediaType"
                  label="Kontent"
                  checked={formData.isContent}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      isVideo: false,
                      isContent: true,
                    })
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
