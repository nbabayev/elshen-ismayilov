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
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useCreateBook } from "@/app/hooks/useBooks";

export default function AddBookPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateBook();

  const [formData, setFormData] = useState({
    Title: "",
    Author: "",
    Description: "",
    Image: "",
    PdfUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: () => {
        enqueueSnackbar("Kitab uğurla əlavə edildi!", { variant: "success" });
        router.push("/admin/books");
      },
      onError: () => enqueueSnackbar("Xəta baş verdi!", { variant: "error" }),
    });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Yeni Kitab</strong>
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
