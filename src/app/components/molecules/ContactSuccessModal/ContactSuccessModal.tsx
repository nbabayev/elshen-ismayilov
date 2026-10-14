"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type ContactSuccessModalProps = {
  open: boolean;
  onClose: () => void;
};

function EnvelopeCheckIcon() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="mx-auto text-[#C88445]"
    >
      <rect
        x="10"
        y="18"
        width="44"
        height="32"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M12 20L32 36L52 20"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="52" cy="48" r="12" fill="#003A3C" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M46.5 48.5L50.5 52.5L58 44"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactSuccessModal({
  open,
  onClose,
}: ContactSuccessModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-success-title"
        className="relative w-full max-w-[560px] overflow-hidden rounded-md bg-[#003A3C] px-6 pb-12 pt-12 text-center text-white shadow-2xl sm:px-12 sm:pb-14 sm:pt-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[url(/images/pattern2.png)] bg-repeat-x bg-bottom opacity-25"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Bağla"
          className="absolute right-4 top-4 z-20 text-2xl leading-none text-[#C88445] transition-opacity hover:opacity-80"
        >
          ×
        </button>

        <div className="relative z-10">
          <EnvelopeCheckIcon />
          <h2
            id="contact-success-title"
            className="mt-6 font-playfair text-3xl font-medium sm:text-4xl"
          >
            Təşəkkür edirik!
          </h2>
          <p className="mx-auto mt-5 max-w-md font-[lexend] text-sm leading-7 text-white/95 sm:text-base">
            Məktubunuz uğurla göndərildi. Ən qısa zamanda cavablanacaq.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
