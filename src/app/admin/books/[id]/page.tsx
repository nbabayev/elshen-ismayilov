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
import { useRouter, useParams } from "next/navigation";
import { useBookById, useUpdateBook } from "@/app/hooks/useBooks";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useBookById(id);
  const book = data?.data || data;
  const updateMutation = useUpdateBook();

  const [formData, setFormData] = useState({
    Title: "",
    Author: "",
    Description: "",
    Image: "",
    PdfUrl: "",
  });

  useEffect(() => {
    if (book) {
      setFormData({
        Title: book.Title || "",
        Author: book.Author || "",
        Description: book.Description || "",
        Image: book.Image || "",
        PdfUrl: book.PdfUrl || "",
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => router.push("/admin/books"),
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
            <strong>Kitabı redaktə et</strong>
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
                  placeholder="Kitab başlığı"
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Müəllif</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.Author}
                  onChange={(e) =>
                    setFormData({ ...formData, Author: e.target.value })
                  }
                  placeholder="Müəllif adı"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Təsvir</CFormLabel>
                <CFormTextarea
                  rows={5}
                  value={formData.Description}
                  onChange={(e) =>
                    setFormData({ ...formData, Description: e.target.value })
                  }
                  placeholder="Kitab haqqında qısa təsvir"
                />
              </div>
              {formData.Image && (
                <div className="mb-3">
                  <CFormLabel>Mövcud şəkil</CFormLabel>
                  <div>
                    <CImage src={formData.Image} width={150} />
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
                  placeholder="Kitab üz qabığı şəkli URL-i"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>PDF URL</CFormLabel>
                <CFormInput
                  type="text"
                  value={formData.PdfUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, PdfUrl: e.target.value })
                  }
                  placeholder="PDF faylı URL-i"
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
