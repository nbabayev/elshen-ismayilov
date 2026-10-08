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
  CFormCheck,
  CButton,
  CSpinner,
} from "@coreui/react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useCreateBook } from "@/app/hooks/useBooks";

type BookForm = {
  Title: string;
  Author: string;
  Description: string;
  Image: File | "";
  Pdf: File | "";
  SpotifyUrl: string;
  Format: string;
  Barcode: string;
  PublishYear: string;
  Language: string;
  Circulation: string;
  Publisher: string;
  PageCount: string;
  CoverType: string;
  Paper: string;
  Size: string;
  NotifyUsers: boolean;
};

const initialForm: BookForm = {
  Title: "",
  Author: "",
  Description: "",
  Image: "",
  Pdf: "",
  SpotifyUrl: "",
  Format: "Kitab",
  Barcode: "",
  PublishYear: "",
  Language: "Azərbaycanca",
  Circulation: "",
  Publisher: "",
  PageCount: "",
  CoverType: "",
  Paper: "",
  Size: "",
  NotifyUsers: false,
};

export default function AddBookPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateBook();
  const [formData, setFormData] = useState<BookForm>(initialForm);

  const setField = <K extends keyof BookForm>(key: K, value: BookForm[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: (result) => {
        enqueueSnackbar(
          result?.notificationQueued
            ? "Kitab əlavə edildi, email bildirişi göndərilməyə başladı."
            : "Kitab uğurla əlavə edildi!",
          { variant: "success" }
        );
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
            <strong>Kitab məlumatları</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>Kitab adı</CFormLabel>
                  <CFormInput
                    value={formData.Title}
                    onChange={(e) => setField("Title", e.target.value)}
                    placeholder="Kitab adı"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Nəşriyyat</CFormLabel>
                  <CFormInput
                    value={formData.Publisher}
                    onChange={(e) => setField("Publisher", e.target.value)}
                    placeholder="Nəşriyyat"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Haqqında</CFormLabel>
                  <CFormTextarea
                    rows={5}
                    value={formData.Description}
                    onChange={(e) => setField("Description", e.target.value)}
                    placeholder="Haqqında"
                  />
                </CCol>
                <CCol md={6}>
                  <CRow className="g-3">
                    <CCol xs={12}>
                      <CFormLabel>Səhifə sayı</CFormLabel>
                      <CFormInput
                        value={formData.PageCount}
                        onChange={(e) => setField("PageCount", e.target.value)}
                        placeholder="Səhifə sayı"
                      />
                    </CCol>
                    <CCol xs={12}>
                      <CFormLabel>Üz qabığı</CFormLabel>
                      <CFormInput
                        value={formData.CoverType}
                        onChange={(e) => setField("CoverType", e.target.value)}
                        placeholder="Üz qabığı"
                      />
                    </CCol>
                  </CRow>
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Format</CFormLabel>
                  <CFormInput
                    value={formData.Format}
                    onChange={(e) => setField("Format", e.target.value)}
                    placeholder="Format"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Kağız</CFormLabel>
                  <CFormInput
                    value={formData.Paper}
                    onChange={(e) => setField("Paper", e.target.value)}
                    placeholder="Kağız"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Barkod</CFormLabel>
                  <CFormInput
                    value={formData.Barcode}
                    onChange={(e) => setField("Barcode", e.target.value)}
                    placeholder="Barkod"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Ölçü</CFormLabel>
                  <CFormInput
                    value={formData.Size}
                    onChange={(e) => setField("Size", e.target.value)}
                    placeholder="Ölçü"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Nəşr tarixi</CFormLabel>
                  <CFormInput
                    type="date"
                    value={formData.PublishYear}
                    onChange={(e) => setField("PublishYear", e.target.value)}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Nəşr dili</CFormLabel>
                  <CFormInput
                    value={formData.Language}
                    onChange={(e) => setField("Language", e.target.value)}
                    placeholder="Nəşr dili"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Müəllif</CFormLabel>
                  <CFormInput
                    value={formData.Author}
                    onChange={(e) => setField("Author", e.target.value)}
                    placeholder="Müəllif"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Nəşr tirajı</CFormLabel>
                  <CFormInput
                    value={formData.Circulation}
                    onChange={(e) => setField("Circulation", e.target.value)}
                    placeholder="Nəşr tirajı"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Pdf yüklə</CFormLabel>
                  <CFormInput
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setField("Pdf", (e.target.files?.[0] ?? "") as File | "")
                    }
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Spotify URL daxil edin</CFormLabel>
                  <CFormInput
                    value={formData.SpotifyUrl}
                    onChange={(e) => setField("SpotifyUrl", e.target.value)}
                    placeholder="Spotify Url"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Şəkil seç</CFormLabel>
                  <CFormInput
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setField("Image", (e.target.files?.[0] ?? "") as File | "")
                    }
                  />
                </CCol>
                <CCol md={6} className="d-flex align-items-end">
                  <CFormCheck
                    id="notify-users-book"
                    label="İstifadəçilərə bildiriş göndərilsin?"
                    checked={formData.NotifyUsers}
                    onChange={(e) => setField("NotifyUsers", e.target.checked)}
                  />
                </CCol>
              </CRow>

              <div className="d-flex justify-content-end mt-4">
                <CButton
                  type="submit"
                  color="primary"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <CSpinner size="sm" />
                  ) : (
                    "Kitabı əlavə et"
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
