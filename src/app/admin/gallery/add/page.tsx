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
import { useRouter } from "next/navigation";
import { useCreateGallery } from "@/app/hooks/useGallery";

export default function AddGalleryPage() {
  const router = useRouter();
  const createMutation = useCreateGallery();

  const [formData, setFormData] = useState({
    title: "",
    type: "image" as "image" | "video",
    thumbImg: "",
    viewDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: () => router.push("/admin/gallery"),
      onError: () => alert("Xəta baş verdi!"),
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
