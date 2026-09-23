"use client";
import { useCreateSub } from "@/app/hooks/useSubs";
import React, { useState } from "react";

interface SubscriptionProps {
  titleFont: string;
  center: string;
}

const Subscription = ({ titleFont, center }: SubscriptionProps) => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);
  const { mutate, isPending } = useCreateSub();

  const handleSubscribe = () => {
    setMessage(null);
    mutate(email, {
      onSuccess: (result) => {
        setMessage({ success: result.success, text: result.message });
        if (result.success) setEmail("");
      },
      onError: () => {
        setMessage({
          success: false,
          text: "Abunəlik yaradılarkən xəta baş verdi.",
        });
      },
    });
  };

  return (
    <div className={`text-white w-full flex flex-col items-center`}>
      <div className="w-full">
        {/* Responsive Heading */}
        <div className={`${titleFont} font-[lexend] font-medium mb-8`}>
          <p>Sayta daxil edilən</p>
          <p>məlumatlardan xəbərdar ol.</p>
        </div>

        {/* Responsive Input Group */}
        <div className="w-full h-12 rounded-[4px] border border-white/30 flex overflow-hidden focus-within:border-white/60 transition-colors">
          <input
            type="email"
            placeholder="E-poçt"
            className="flex-1 bg-transparent min-w-0 border-r border-white/30 outline-none px-4 md:px-6 text-sm md:text-base text-white placeholder:text-white/40 font-light"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="text-center px-4 md:px-10 font-[lexend] font-semibold text-xs md:text-sm hover:bg-white/10 transition-colors whitespace-nowrap"
            type="button"
            onClick={handleSubscribe}
            disabled={isPending}
          >
            {isPending ? "Göndərilir..." : "Abunə ol"}
          </button>
        </div>
        {message && (
          <p
            className={`mt-3 text-sm ${
              message.success ? "text-green-200" : "text-red-200"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Subscription;
