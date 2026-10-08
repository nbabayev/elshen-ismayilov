"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/atoms/Button/Button";
import ArticleShare from "@/app/components/molecules/ArticleShare";
import ShareIcon from "@/app/components/shared/ShareIcon";

type BookCoverProps = {
  title: string;
  image?: string | null;
  audioUrl?: string | null;
  pdfUrl?: string | null;
};

function HeadphonesIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 18V12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 18C21 19.1046 20.1046 20 19 20H18C16.8954 20 16 19.1046 16 18V15C16 13.8954 16.8954 13 18 13H21V18Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M3 18C3 19.1046 3.89543 20 5 20H6C7.10457 20 8 19.1046 8 18V15C8 13.8954 7.10457 13 6 13H3V18Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadSpinner() {
  return (
    <span
      className="inline-block w-[22px] h-[22px] rounded-full border-2 border-[#C88445]/30 border-t-[#C88445] animate-spin"
      aria-hidden
    />
  );
}

function slugFileName(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9əıöüğçş\- ]/gi, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base || "kitab"}.pdf`;
}

export function getBookPdfDownloadHref(pdfUrl: string, title = "kitab") {
  const params = new URLSearchParams({
    url: pdfUrl,
    filename: slugFileName(title),
  });
  return `/api/books/download?${params.toString()}`;
}

export default function BookCover({
  title,
  image,
  audioUrl,
  pdfUrl,
}: BookCoverProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePdfDownload = async () => {
    if (!pdfUrl || isDownloading) return;

    setIsDownloading(true);
    try {
      const response = await fetch(getBookPdfDownloadHref(pdfUrl, title));
      if (!response.ok) throw new Error("download failed");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = slugFileName(title);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // fallback: birbaşa API linki
      window.location.href = getBookPdfDownloadHref(pdfUrl, title);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ArticleShare
      title={title}
      dialogTitle="Kitabı paylaş"
      renderTrigger={(openShare) => (
        <div>
          <div className="relative bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.07)] aspect-square flex items-center justify-center p-8 md:p-12">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={title}
                className="max-w-full max-h-full object-contain drop-shadow-md"
              />
            ) : (
              <div className="w-full h-full bg-[#f5f5f5] rounded-xl" />
            )}

            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
              {audioUrl ? (
                <a
                  href={audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#C88445] hover:text-[#AD6E33] transition-colors font-lexend text-[13px] md:text-[14px] font-medium"
                  aria-label="Dinlə"
                >
                  <HeadphonesIcon />
                  <span>Dinlə</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-[#C88445] font-lexend text-[13px] md:text-[14px] font-medium">
                  <HeadphonesIcon />
                  <span>Dinlə</span>
                </span>
              )}

              <button
                type="button"
                onClick={handlePdfDownload}
                disabled={!pdfUrl || isDownloading}
                className="relative text-[#C88445] hover:text-[#AD6E33] transition-colors p-1 disabled:opacity-70 disabled:cursor-wait min-w-[30px] min-h-[30px] inline-flex items-center justify-center"
                aria-label={isDownloading ? "PDF yüklənir" : "PDF yüklə"}
                aria-busy={isDownloading}
              >
                {isDownloading ? (
                  <DownloadSpinner />
                ) : (
                  <Image
                    src="/icons/download-cloud.svg"
                    alt=""
                    width={22}
                    height={22}
                  />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={openShare}>
              Paylaş <ShareIcon />
            </Button>
          </div>
        </div>
      )}
    />
  );
}
