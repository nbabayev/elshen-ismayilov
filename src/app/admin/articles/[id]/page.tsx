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
  CFormTextarea,
  CButton,
  CSpinner,
  CImage,
} from "@coreui/react";

import "react-quill-new/dist/quill.snow.css";
import { useRouter, useParams } from "next/navigation";
import { useArticleById, useUpdateArticle } from "@/app/hooks/useArticle";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Yüklənir...</p>, // Yüklənənə qədər görünəcək hissə
});
export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useArticleById(id);
  const article = data?.data || data;
  const updateMutation = useUpdateArticle();

  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    Content: "",
    Image: "",
  });

  useEffect(() => {
    if (article) {
      setFormData({
        Title: article.Title || "",
        Description: article.Description || "",
        Content: article.Content || "",
        Image: article.Image || "",
      });
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => router.push("/admin/articles"),
        onError: () => alert("Xəta baş verdi!"),
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
            <strong>Məqaləni redaktə et</strong>
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

              {formData.Image && (
                <div className="mb-3">
                  <CFormLabel>Mövcud şəkil</CFormLabel>
                  <div>
                    <CImage src={formData.Image} width={200} />
                  </div>
                </div>
              )}
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
              <div className="mb-3">
                <CFormLabel>Məzmun</CFormLabel>

                <ReactQuill
                  placeholder="Məqalə məzmunu"
                  value={formData?.Content}
                  onChange={(value: string) =>
                    setFormData({ ...formData, Content: value })
                  }
                  style={{ height: "300px" }}
                />
              </div>
              <div className="text-right mt-[60px]">
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
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
