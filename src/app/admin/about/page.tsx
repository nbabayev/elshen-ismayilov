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
} from "@coreui/react";
import { useSnackbar } from "notistack";

export default function AboutPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/about");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            content: data.content || "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching about:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        enqueueSnackbar("Uğurla yadda saxlanıldı!", { variant: "success" });
      }
    } catch (error) {
      console.error("Error saving about:", error);
      enqueueSnackbar("Xəta baş verdi!", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
            <strong>Haqqında</strong>
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
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Qısa təsvir</CFormLabel>
                <CFormTextarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Qısa təsvir daxil edin"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Məzmun</CFormLabel>
                <CFormTextarea
                  rows={10}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Məzmun daxil edin"
                />
              </div>
              <CButton type="submit" color="primary" disabled={saving}>
                {saving ? <CSpinner size="sm" /> : "Yadda saxla"}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
