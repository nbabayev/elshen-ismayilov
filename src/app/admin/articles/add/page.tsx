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
  CFormTextarea,
  CButton,
  CSpinner,
} from "@coreui/react";
import { useRouter } from "next/navigation";
import { useCreateArticle } from "@/app/hooks/useArticle";

export default function AddArticlePage() {
  const router = useRouter();
  const createMutation = useCreateArticle();

  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    Content: "",
    Image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: () => router.push("/admin/articles"),
      onError: () => alert("Xəta baş verdi!"),
    });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Yeni Məqalə</strong>
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
                  value={formData.Description}
                  onChange={(e) =>
                    setFormData({ ...formData, Description: e.target.value })
                  }
                  placeholder="Qısa təsvir"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Məzmun</CFormLabel>
                <CFormTextarea
                  rows={10}
                  value={formData.Content}
                  onChange={(e) =>
                    setFormData({ ...formData, Content: e.target.value })
                  }
                  placeholder="Məqalə məzmunu"
                />
              </div>
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
