"use client";

import { useCreateSub } from "@/app/hooks/useSubs";
import SubscriptionModal, {
  type SubscriptionModalVariant,
} from "@/app/components/molecules/SubscriptionModal/SubscriptionModal";
import React, { useRef, useState } from "react";

interface SubscriptionProps {
  titleFont: string;
  center: string;
}

const Subscription = ({ titleFont, center: _center }: SubscriptionProps) => {
  const [email, setEmail] = useState("");
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] =
    useState<SubscriptionModalVariant>("success");
  const [modalEmail, setModalEmail] = useState("");
  const [unsubscribeToken, setUnsubscribeToken] = useState<string | null>(null);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useCreateSub();

  const openModal = (
    variant: SubscriptionModalVariant,
    nextEmail?: string
  ) => {
    if (nextEmail) setModalEmail(nextEmail);
    setModalVariant(variant);
    setModalOpen(true);
  };

  const handleSubscribe = () => {
    setInlineError(null);

    mutate(email, {
      onSuccess: (result) => {
        if (result?.code === "already_subscribed") {
          setUnsubscribeToken(result.unsubscribeToken || null);
          openModal("attention", result.email || email.trim().toLowerCase());
          return;
        }

        if (result?.success) {
          setEmail("");
          openModal("check_email", result.email || email);
          return;
        }

        setInlineError(result?.message || "Abunəlik yaradılarkən xəta baş verdi.");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          "Abunəlik yaradılarkən xəta baş verdi.";
        setInlineError(message);
      },
    });
  };

  const handleUseOtherEmail = () => {
    setModalOpen(false);
    setUnsubscribeToken(null);
    requestAnimationFrame(() => {
      emailInputRef.current?.focus();
      emailInputRef.current?.select();
    });
  };

  const handleUnsubscribe = async () => {
    if (!unsubscribeToken || isUnsubscribing) return;

    const token = unsubscribeToken;
    setIsUnsubscribing(true);

    try {
      const response = await fetch("/api/subscription/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setUnsubscribeToken(null);
        setEmail("");
        setModalVariant("unsubscribed");
        setModalOpen(true);
        return;
      }

      setInlineError(data.message || "Abunəlikdən çıxmaq mümkün olmadı.");
      setModalOpen(false);
    } catch {
      setInlineError("Şəbəkə xətası baş verdi. Yenidən cəhd edin.");
      setModalOpen(false);
    } finally {
      setIsUnsubscribing(false);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-center text-white">
        <div className="w-full">
          <div className={`${titleFont} mb-8 font-[lexend] font-medium`}>
            <p>Sayta daxil edilən</p>
            <p>məlumatlardan xəbərdar ol.</p>
          </div>

          <div className="flex h-12 w-full overflow-hidden rounded-[4px] border border-white/30 transition-colors focus-within:border-white/60">
            <input
              ref={emailInputRef}
              type="email"
              placeholder="E-poçt"
              className="min-w-0 flex-1 border-r border-white/30 bg-transparent px-4 font-light text-sm text-white outline-none placeholder:text-white/40 md:px-6 md:text-base"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubscribe();
              }}
            />
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 font-[lexend] text-xs font-semibold transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70 md:px-10 md:text-sm"
              type="button"
              onClick={handleSubscribe}
              disabled={isPending || !email.trim()}
            >
              {isPending ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Göndərilir...
                </>
              ) : (
                "Abunə ol"
              )}
            </button>
          </div>
          {inlineError && (
            <p className="mt-3 text-sm text-red-200">{inlineError}</p>
          )}
        </div>
      </div>

      <SubscriptionModal
        open={modalOpen}
        variant={modalVariant}
        email={modalEmail}
        isUnsubscribing={isUnsubscribing}
        onClose={() => {
          if (isUnsubscribing) {
            setModalOpen(false);
            return;
          }
          setModalOpen(false);
        }}
        onUnsubscribe={handleUnsubscribe}
        onUseOtherEmail={handleUseOtherEmail}
      />
    </>
  );
};

export default Subscription;
