"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CRow,
  CAlert,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilLockUnlocked } from "@coreui/icons";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email və şifrə daxil edin.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Giriş alınmadı. Yenidən yoxlayın.");
        setIsLoading(false);
        return;
      }

      const next = searchParams.get("next");
      const target =
        next && next.startsWith("/admin") && !next.startsWith("/admin/login")
          ? next
          : "/admin";

      router.replace(target);
      router.refresh();
    } catch (fetchError) {
      console.error("Login error:", fetchError);
      setError("Server ilə əlaqə qurulmadı. Yenidən cəhd edin.");
      setIsLoading(false);
    }
  };

  return (
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
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
            />
          </CRow>
          <CRow className="mb-4">
            <CFormLabel htmlFor="password">Şifrə</CFormLabel>
            <CInputGroup>
              <CFormInput
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Şifrənizi daxil edin"
                required
              />
              <CButton
                type="button"
                color="secondary"
                variant="outline"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                aria-pressed={showPassword}
              >
                <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} />
              </CButton>
            </CInputGroup>
          </CRow>
          <CButton
            type="submit"
            color="primary"
            disabled={isLoading}
            className="w-100"
          >
            {isLoading ? "Daxil olunur..." : "Daxil ol"}
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div style={{ width: "100%", maxWidth: 420, padding: 16 }}>
        <Suspense
          fallback={
            <div className="d-flex justify-content-center p-5">
              <CSpinner color="primary" />
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
