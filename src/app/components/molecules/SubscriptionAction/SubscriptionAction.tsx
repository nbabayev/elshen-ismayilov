"use client";

import { useState } from "react";
import Link from "next/link";

type SubscriptionActionProps = {
  token?: string;
  endpoint: "/api/subscription/verify" | "/api/subscription/unsubscribe";
  title: string;
  description: string;
  buttonLabel: string;
};

export default function SubscriptionAction({
  token,
  endpoint,
  title,
  description,
  buttonLabel,
}: SubscriptionActionProps) {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleAction = async () => {
    if (!token || isPending) return;

    setIsPending(true);
    setResult(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();

      setResult({
        success: Boolean(response.ok && data.success),
        message: data.message || "Əməliyyat tamamlanmadı",
      });
    } catch {
      setResult({
        success: false,
        message: "Şəbəkə xətası baş verdi. Yenidən cəhd edin.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 text-center shadow-md sm:p-10">
        <h1 className="font-roboto-slab text-2xl font-medium text-[#003A3C] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#878787]">{description}</p>

        {!token && (
          <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">
            Link yanlışdır və ya token mövcud deyil.
          </p>
        )}

        {result && (
          <p
            className={`mt-5 rounded-md p-3 text-sm ${
              result.success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {result.message}
          </p>
        )}

        {!result?.success && token && (
          <button
            type="button"
            onClick={handleAction}
            disabled={isPending}
            className="mt-6 rounded-md bg-[#003A3C] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#00585B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Gözləyin..." : buttonLabel}
          </button>
        )}

        <div className="mt-6">
          <Link href="/" className="text-sm text-[#C88445] hover:underline">
            Ana səhifəyə qayıt
          </Link>
        </div>
      </div>
    </main>
  );
}
