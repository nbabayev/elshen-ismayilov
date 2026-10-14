"use client";

import Link from "next/link";

export type SubscriptionPanelVariant =
  | "confirm"
  | "success"
  | "check_email"
  | "unsubscribed"
  | "attention";

type SubscriptionPanelProps = {
  variant: SubscriptionPanelVariant;
  title?: string;
  description?: string;
  buttonLabel?: string;
  email?: string;
  isPending?: boolean;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
  onClose?: () => void;
  showClose?: boolean;
  continueHref?: string;
  continueLabel?: string;
  homeLink?: boolean;
};

const preset = {
  success: {
    title: "Abunəlik üçün təşəkkür edirik!",
    body: "Siz uğurlu şəkildə veb səhifəmizə abunə oldunuz! Sayta əlavə edilən bütün materiallardan xəbərdar olacaqsınız.",
  },
  check_email: {
    title: "Abunəlik sorğusu",
    body: "Zəhmət olmasa təsdiq emailini poçt ünvanınızdan yoxlayın.",
  },
  unsubscribed: {
    title: "Abunəliyiniz dayandırıldı!",
    body: "Veb səhifəmizə olan abunəliyiniz dayandırıldı. Ümid edirik ki, qısa zamanda sayta yenidən abunə olub yeniliklərdən xəbərdar olacaqsınız.",
  },
} as const;

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden
    />
  );
}

export default function SubscriptionPanel({
  variant,
  title,
  description,
  buttonLabel,
  email,
  isPending = false,
  onAction,
  onSecondaryAction,
  secondaryLabel,
  onClose,
  showClose = false,
  continueHref = "/",
  continueLabel,
  homeLink = false,
}: SubscriptionPanelProps) {
  const presetCopy =
    variant === "success" ||
    variant === "check_email" ||
    variant === "unsubscribed"
      ? preset[variant]
      : null;

  const actionLabel =
    continueLabel ??
    (variant === "check_email" ? "Bağla" : "Davam edin");

  return (
    <div className="relative w-full max-w-[560px] overflow-hidden rounded-md bg-[#003A3C] px-6 pb-10 pt-12 text-center text-white shadow-2xl sm:px-12 sm:pb-12 sm:pt-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[url(/images/pattern2.png)] bg-repeat-x bg-bottom opacity-25"
      />

      {showClose && onClose && (
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          aria-label="Bağla"
          className="absolute right-4 top-4 z-20 text-2xl leading-none text-[#C88445] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ×
        </button>
      )}

      <div className="relative z-10">
        {variant === "attention" ? (
          <>
            <h2 className="font-playfair text-3xl font-medium sm:text-4xl">
              Diqqət!
            </h2>
            <p className="mx-auto mt-5 max-w-md font-[lexend] text-sm leading-7 text-white/95 sm:text-base">
              Mövcud{" "}
              <span className="font-medium text-[#C88445]">{email}</span> e-poçt
              ünvanı veb səhifəmizə abunədir. Digər ünvana abunəlik üçün e-poçt
              qeyd edin.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={onAction}
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#C88445] px-4 py-2.5 font-[lexend] text-sm text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[180px]"
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Gözləyin...
                  </>
                ) : (
                  buttonLabel || "Abunəliyi dayandır"
                )}
              </button>
              <button
                type="button"
                onClick={onSecondaryAction}
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center bg-[#C88445] px-4 py-2.5 font-[lexend] text-sm text-white transition-colors hover:bg-[#b5763c] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[200px]"
              >
                {secondaryLabel || "Digər e-poçt ilə abunəlik"}
              </button>
            </div>
          </>
        ) : variant === "confirm" ? (
          <>
            <h2 className="font-playfair text-2xl font-medium leading-snug sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-md font-[lexend] text-sm leading-7 text-white/90 sm:text-base">
              {description}
            </p>
            {onAction && buttonLabel && (
              <button
                type="button"
                onClick={onAction}
                disabled={isPending}
                className="mt-8 inline-flex min-h-11 min-w-[180px] items-center justify-center gap-2 bg-[#C88445] px-8 py-2.5 font-[lexend] text-sm text-white transition-colors hover:bg-[#b5763c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Gözləyin...
                  </>
                ) : (
                  buttonLabel
                )}
              </button>
            )}
            {homeLink && (
              <div className="mt-6">
                <Link
                  href="/"
                  className="font-[lexend] text-sm text-[#C88445] hover:underline"
                >
                  Ana səhifəyə qayıt
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="font-playfair text-2xl font-medium leading-snug sm:text-4xl">
              {presetCopy?.title}
            </h2>
            <p className="mx-auto mt-5 max-w-md font-[lexend] text-sm leading-7 text-white/95 sm:text-base">
              {presetCopy?.body}
            </p>
            {onAction ? (
              <button
                type="button"
                onClick={onAction}
                className="mt-8 inline-flex min-h-11 min-w-[160px] items-center justify-center bg-[#C88445] px-8 py-2.5 font-[lexend] text-sm text-white transition-colors hover:bg-[#b5763c]"
              >
                {actionLabel}
              </button>
            ) : (
              <Link
                href={continueHref}
                className="mt-8 inline-flex min-h-11 min-w-[160px] items-center justify-center bg-[#C88445] px-8 py-2.5 font-[lexend] text-sm text-white transition-colors hover:bg-[#b5763c]"
              >
                {actionLabel}
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
