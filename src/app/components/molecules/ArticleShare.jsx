"use client";

import { useEffect, useState } from "react";
import Button from "@/app/components/atoms/Button/Button";
import ShareIcon from "@/app/components/shared/ShareIcon";

export default function ArticleShare({ title }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const openShare = () => {
    setShareUrl(window.location.href);
    setCopied(false);
    setIsOpen(true);
  };

  const copyWithFallback = () => {
    const textArea = document.createElement("textarea");
    textArea.value = shareUrl;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    const didCopy = document.execCommand("copy");
    document.body.removeChild(textArea);
    return didCopy;
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        return;
      }
    } catch {
      // Clipboard API can reject without a direct user gesture.
    }

    setCopied(copyWithFallback());
  };

  const shareText = title ? `${title} ${shareUrl}` : shareUrl;

  return (
    <>
      <Button onClick={openShare}>
        Paylaş <ShareIcon />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[80] flex items-end justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-3xl p-6 flex flex-col gap-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Məqaləni paylaş"
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto -mt-2 mb-1" />
            <h3 className="text-gray-900 text-lg font-extrabold tracking-tight">
              Məqaləni paylaş
            </h3>

            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-sm text-blue-600 font-medium flex-1 outline-none truncate"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-bold active:scale-95 transition-all shadow-sm"
              >
                {copied ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 my-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-gray-700 text-xs font-semibold active:scale-90 transition-transform"
              >
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl font-bold border border-green-100 shadow-sm">
                  W
                </div>
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-gray-700 text-xs font-semibold active:scale-90 transition-transform"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl font-bold border border-blue-100 shadow-sm">
                  T
                </div>
                <span>Telegram</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-gray-700 text-xs font-semibold active:scale-90 transition-transform"
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold border border-indigo-100 shadow-sm">
                  F
                </div>
                <span>Facebook</span>
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(title || "")}&body=${encodeURIComponent(shareUrl)}`}
                className="flex flex-col items-center gap-2 text-gray-700 text-xs font-semibold active:scale-90 transition-transform"
              >
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl font-bold border border-red-100 shadow-sm">
                  @
                </div>
                <span>Email</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full bg-gray-100 text-gray-800 py-3.5 rounded-xl font-bold active:scale-95 transition-all text-sm mt-1 border border-gray-200"
            >
              Bağla
            </button>
          </div>
        </div>
      )}
    </>
  );
}
