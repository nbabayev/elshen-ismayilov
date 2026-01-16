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
  CButton,
  CSpinner,
} from "@coreui/react";
import { useRouter } from "next/navigation";
import { useCreateMiniSlider } from "@/app/hooks/useMiniSlider";

export default function AddMiniSliderPage() {
  const router = useRouter();
  const createMutation = useCreateMiniSlider();

  const [formData, setFormData] = useState({
    Title: "",
    Link: "",
    ListingNumber: 0,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Title", formData.Title);
    data.append("Link", formData.Link);
    data.append("ListingNumber", String(formData.ListingNumber));
    if (file) {
      data.append("ImageUrl", file);
    }

    createMutation.mutate(data, {
      onSuccess: () => router.push("/admin/mini-sliders"),
      onError: () => alert("Xəta baş verdi!"),
    });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Yeni Mini Slayder</strong>
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
              <div className="mb-3">
                <CFormLabel>Şəkil</CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
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
