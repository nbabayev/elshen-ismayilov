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
  CFormSwitch,
  CImage,
} from "@coreui/react";
import { useSettings, useUpdateSettings } from "@/app/hooks/useSettings";

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();
  const [formData, setFormData] = useState<any>({
    Instagram: "",
    Facebook: "",
    Youtube: "",
    Tiktok: "",
    Telegram: "",
    // Spotify: "",
    ShowStats: false,
    StudentCount: 0,
    LogoHeader: "",
    LogoFooter: "",
    SubscribeTitle: "",
    SubscribeSignature: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        ...settings,
        ShowStats: !!settings.ShowStats,
      });
    }
  }, [settings]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
    }
  };

  const renderImagePreview = (field: string) => {
    const value = formData[field];
    if (value instanceof File) {
      return (
        <div className="mt-2">
          <CImage
            src={URL.createObjectURL(value)}
            width={100}
            height={100}
            className="object-contain border rounded p-1"
          />
          <p className="text-xs text-muted mt-1">Yeni seçilmiş: {value.name}</p>
        </div>
      );
    } else if (value) {
      return (
        <div className="mt-2">
          <CImage
            src={value}
            width={100}
            height={100}
            className="object-contain border rounded p-1"
          />
          <p className="text-xs text-muted mt-1">Mövcud şəkil</p>
        </div>
      );
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => alert("Parametrlər uğurla yeniləndi!"),
      onError: (error: any) => alert("Xəta baş verdi: " + error.message),
    });
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
            <strong>Parametrlər</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-4">
                <h5 className="mb-3">Linklər</h5>
                <CRow>
                  {[
                    "Instagram",
                    "Facebook",
                    "Youtube",
                    "Tiktok",
                    "Telegram",
                    // "Spotify",
                  ].map((field) => (
                    <CCol md={6} key={field} className="mb-3">
                      <CFormLabel>{field}</CFormLabel>
                      <CFormInput
                        value={formData[field] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                        placeholder={`${field} linki`}
                      />
                    </CCol>
                  ))}
                </CRow>
              </div>

              <hr className="my-4" />

              <div className="mb-4">
                <h5 className="mb-3">Statistika</h5>
                <div className="mb-3">
                  <CFormSwitch
                    label="Statistikanı saytda göstər"
                    id="showStats"
                    checked={formData.ShowStats}
                    onChange={(e) =>
                      setFormData({ ...formData, ShowStats: e.target.checked })
                    }
                  />
                </div>
                <CRow>
                  <CCol md={6}>
                    <CFormLabel>Tələbə sayı</CFormLabel>
                    <CFormInput
                      type="number"
                      value={formData.StudentCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          StudentCount: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </CCol>
                </CRow>
              </div>

              <hr className="my-4" />

              <div className="mb-4">
                <h5 className="mb-3">Logolar & Abunəlik</h5>
                <CRow>
                  <CCol md={4} className="mb-3">
                    <CFormLabel>Header Logo</CFormLabel>
                    <CFormInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "LogoHeader")}
                    />
                    {renderImagePreview("LogoHeader")}
                  </CCol>
                  <CCol md={4} className="mb-3">
                    <CFormLabel>Footer Logo</CFormLabel>
                    <CFormInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "LogoFooter")}
                    />
                    {renderImagePreview("LogoFooter")}
                  </CCol>
                  <CCol md={4} className="mb-3">
                    <CFormLabel>Abunəlik Şəkli</CFormLabel>
                    <CFormInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "SubscribeImage")}
                    />
                    {renderImagePreview("SubscribeImage")}
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormLabel>Abunəlik Başlığı</CFormLabel>
                    <CFormInput
                      value={formData.SubscribeTitle || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          SubscribeTitle: e.target.value,
                        })
                      }
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormLabel>Abunəlik İmzası</CFormLabel>
                    <CFormInput
                      value={formData.SubscribeSignature || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          SubscribeSignature: e.target.value,
                        })
                      }
                    />
                  </CCol>
                </CRow>
              </div>

              <div className="mt-4">
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
