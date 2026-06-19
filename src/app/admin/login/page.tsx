"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CAlert,
} from "@coreui/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email və şifrə daxil edin.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Giriş alınmadı. Yenidən yoxlayın.");
        setIsLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("accessToken", data.token);
      }

      router.replace("/admin");
    } catch (fetchError) {
      console.error("Login error:", fetchError);
      setError("Server ilə əlaqə qurulmadı. Yenidən cəhd edin.");
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div style={{ width: "100%", maxWidth: 420, padding: 16 }}>
        <CCard>
          <CCardHeader className="text-center">
            <h4>Idarəetmə paneli</h4>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </CRow>
              <CRow className="mb-4">
                <CFormLabel htmlFor="password">Şifrə</CFormLabel>
                <CFormInput
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Şifrənizi daxil edin"
                  required
                />
              </CRow>
              <CButton
                type="submit"
                color="primary"
                disabled={isLoading}
                className="w-100"
              >
                {isLoading ? "Yüklənir..." : "Daxil ol"}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </div>
    </div>
  );
}
