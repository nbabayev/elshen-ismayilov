"use client";
import { useCreateSub } from "@/app/hooks/useSubs";
import React, { useState } from "react";

interface SubscriptionProps {
  titleFont: string;
  center: string;
}

const Subscription = ({ titleFont, center }: SubscriptionProps) => {
  const [email, setEmail] = useState<string>("");
  const { mutate } = useCreateSub();

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
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="text-center px-4 md:px-10 font-[lexend] font-semibold text-xs md:text-sm hover:bg-white/10 transition-colors whitespace-nowrap"
            type="button"
            onClick={() => mutate(email)}
          >
            Abunə ol
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
