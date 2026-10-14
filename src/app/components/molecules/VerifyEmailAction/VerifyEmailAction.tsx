"use client";

import { useState } from "react";
import SubscriptionPanel from "@/app/components/molecules/SubscriptionPanel/SubscriptionPanel";
import NotFound from "@/app/not-found";

type VerifyEmailActionProps = {
  token: string;
};

export default function VerifyEmailAction({ token }: VerifyEmailActionProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [expired, setExpired] = useState(false);

  const handleVerify = async () => {
    if (isPending) return;

    setIsPending(true);
    setError(null);

    try {
      const response = await fetch("/api/subscription/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();

      if (response.ok && data.success && data.code === "verified") {
        setVerified(true);
        return;
      }

      if (data.code === "link_used" || data.code === "not_found") {
        setExpired(true);
        return;
      }

      setError(data.message || "Email təsdiqlənmədi.");
    } catch {
      setError("Şəbəkə xətası baş verdi. Yenidən cəhd edin.");
    } finally {
      setIsPending(false);
    }
  };

  if (expired) return <NotFound />;

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      {verified ? (
        <SubscriptionPanel variant="success" continueHref="/" />
      ) : (
        <div className="w-full max-w-[560px]">
          <SubscriptionPanel
            variant="confirm"
            title="Email ünvanını təsdiqlə"
            description="Abunəliyi aktivləşdirmək üçün aşağıdakı düyməyə klikləyin."
            buttonLabel="Abunəliyi təsdiqlə"
            isPending={isPending}
            onAction={handleVerify}
            homeLink
          />
          {error && (
            <p className="mt-4 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </main>
  );
}
