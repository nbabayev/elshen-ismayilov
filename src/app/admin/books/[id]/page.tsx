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
  CFormCheck,
  CButton,
  CSpinner,
  CImage,
} from "@coreui/react";
import { useSnackbar } from "notistack";
import { useRouter, useParams } from "next/navigation";
import { useBookById, useUpdateBook } from "@/app/hooks/useBooks";

type BookForm = {
  Title: string;
  Author: string;
  Description: string;
  Image: File | "";
  ImageUrl: string;
  Pdf: File | "";
  PdfUrl: string;
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

const emptyForm: BookForm = {
  Title: "",
  Author: "",
  Description: "",
  Image: "",
  ImageUrl: "",
  Pdf: "",
  PdfUrl: "",
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

export default function EditBookPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useBookById(id);
  const book = data?.data || data;
  const updateMutation = useUpdateBook();
  const [formData, setFormData] = useState<BookForm>(emptyForm);

  const setField = <K extends keyof BookForm>(key: K, value: BookForm[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!book) return;
    setFormData({
      Title: book.Title || "",
      Author: book.Author || "",
      Description: book.Description || "",
      Image: "",
      ImageUrl: book.Image || "",
      Pdf: "",
      PdfUrl: book.PdfUrl || "",
      SpotifyUrl: book.SpotifyUrl || "",
      Format: book.Format || "Kitab",
      Barcode: book.Barcode || "",
      PublishYear: book.PublishYear || "",
      Language: book.Language || "Azərbaycanca",
      Circulation: book.Circulation || "",
      Publisher: book.Publisher || "",
      PageCount: book.PageCount || "",
      CoverType: book.CoverType || "",
      Paper: book.Paper || "",
      Size: book.Size || "",
      NotifyUsers: false,
    });
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bookId = String(book?.Id ?? id);

    updateMutation.mutate(
      { id: bookId, data: formData },
      {
        onSuccess: () => {
          enqueueSnackbar("Kitab uğurla yeniləndi!", { variant: "success" });
          router.push("/admin/books");
        },
        onError: () => enqueueSnackbar("Xəta baş verdi!", { variant: "error" }),
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
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>Kitab adı</CFormLabel>
                  <CFormInput
                    value={formData.Title}
                    onChange={(e) => setField("Title", e.target.value)}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Nəşriyyat</CFormLabel>
                  <CFormInput
                    value={formData.Publisher}
                    onChange={(e) => setField("Publisher", e.target.value)}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Haqqında</CFormLabel>
                  <CFormTextarea
                    rows={5}
                    value={formData.Description}
                    onChange={(e) => setField("Description", e.target.value)}
                  />
                </CCol>
                <CCol md={6}>
                  <CRow className="g-3">
                    <CCol xs={12}>
                      <CFormLabel>Səhifə sayı</CFormLabel>
                      <CFormInput
                        value={formData.PageCount}
                        onChange={(e) => setField("PageCount", e.target.value)}
                      />
                    </CCol>
                    <CCol xs={12}>
                      <CFormLabel>Üz qabığı</CFormLabel>
                      <CFormInput
                        value={formData.CoverType}
                        onChange={(e) => setField("CoverType", e.target.value)}
                      />
                    </CCol>
                  </CRow>
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Format</CFormLabel>
                  <CFormInput
                    value={formData.Format}
                    onChange={(e) => setField("Format", e.target.value)}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Kağız</CFormLabel>
                  <CFormInput
                    value={formData.Paper}
                    onChange={(e) => setField("Paper", e.target.value)}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Barkod</CFormLabel>
                  <CFormInput
                    value={formData.Barcode}
                    onChange={(e) => setField("Barcode", e.target.value)}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Ölçü</CFormLabel>
                  <CFormInput
                    value={formData.Size}
                    onChange={(e) => setField("Size", e.target.value)}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Nəşr tarixi</CFormLabel>
                  <CFormInput
                    type="date"
                    value={
                      formData.PublishYear?.length === 4
                        ? `${formData.PublishYear}-01-01`
                        : formData.PublishYear
                    }
                    onChange={(e) => setField("PublishYear", e.target.value)}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Nəşr dili</CFormLabel>
                  <CFormInput
                    value={formData.Language}
                    onChange={(e) => setField("Language", e.target.value)}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Müəllif</CFormLabel>
                  <CFormInput
                    value={formData.Author}
                    onChange={(e) => setField("Author", e.target.value)}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Nəşr tirajı</CFormLabel>
                  <CFormInput
                    value={formData.Circulation}
                    onChange={(e) => setField("Circulation", e.target.value)}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Pdf yüklə</CFormLabel>
                  {formData.PdfUrl && (
                    <div className="mb-2">
                      <a
                        href={`/api/books/download?${new URLSearchParams({
                          url: formData.PdfUrl,
                          filename: `${formData.Title || "kitab"}.pdf`,
                          inline: "1",
                        }).toString()}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Mövcud PDF
                      </a>
                    </div>
                  )}
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
                  {formData.ImageUrl && (
                    <div className="mb-2">
                      <CImage src={formData.ImageUrl} width={120} />
                    </div>
                  )}
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
                    id="notify-users-book-edit"
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
