"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="az">
      <body style={{ backgroundColor: "#f0edea", margin: 0 }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 16px",
            textAlign: "center",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <p style={{ marginBottom: 8, color: "#C88445", fontSize: 14 }}>
              Xəta
            </p>
            <h1 style={{ margin: 0, color: "#003A3C", fontSize: 32 }}>
              Səhifəni açmaq mümkün olmadı
            </h1>
            <p style={{ marginTop: 12, color: "#878787", fontSize: 14 }}>
              Gözlənilməz problem baş verdi. Bir az sonra yenidən cəhd edin.
            </p>
            {error.digest ? (
              <p style={{ marginTop: 8, color: "#B0B0B0", fontSize: 12 }}>
                Kod: {error.digest}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: 24,
                border: 0,
                borderRadius: 6,
                background: "#003A3C",
                color: "#fff",
                padding: "12px 20px",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Yenidən cəhd et
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
