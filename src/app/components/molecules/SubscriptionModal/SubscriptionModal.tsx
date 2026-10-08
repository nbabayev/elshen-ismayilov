"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import SubscriptionPanel, {
  type SubscriptionPanelVariant,
} from "@/app/components/molecules/SubscriptionPanel/SubscriptionPanel";

export type SubscriptionModalVariant = Exclude<
  SubscriptionPanelVariant,
  "confirm"
>;

type SubscriptionModalProps = {
  open: boolean;
  variant: SubscriptionModalVariant;
  email?: string;
  isUnsubscribing?: boolean;
  onClose: () => void;
  onContinue?: () => void;
  onUnsubscribe?: () => void;
  onUseOtherEmail?: () => void;
};

export default function SubscriptionModal({
  open,
  variant,
  email,
  isUnsubscribing = false,
  onClose,
  onContinue,
  onUnsubscribe,
  onUseOtherEmail,
}: SubscriptionModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isUnsubscribing) onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, isUnsubscribing, onClose]);

  if (!open || typeof document === "undefined") return null;

  const handleContinue = () => {
    onContinue?.();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 px-4"
      onClick={() => {
        if (!isUnsubscribing) onClose();
      }}
      role="presentation"
    >
      <div onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        {variant === "attention" ? (
          <SubscriptionPanel
            variant="attention"
            email={email}
            isPending={isUnsubscribing}
            onAction={onUnsubscribe}
            onSecondaryAction={onUseOtherEmail}
            onClose={onClose}
            showClose
          />
        ) : (
          <SubscriptionPanel
            variant={variant}
            onAction={handleContinue}
            onClose={onClose}
            showClose
          />
        )}
      </div>
    </div>,
    document.body
  );
}
