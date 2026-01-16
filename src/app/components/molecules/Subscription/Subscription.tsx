"use client";
import { useCreateSub } from "@/app/hooks/useSubs";
import React, { useState } from "react";

interface Subscription {
  titleFont: string;
  center: string;
}

const Subscription = ({ titleFont, center }: Subscription) => {
  const [email, setEmail] = useState<string>("");
  const { mutate } = useCreateSub();
  return (
    <div className={`text-white ${titleFont} ${center}`}>
      <div>
        <div
          className={`${titleFont} leading-[100%] font-[lexend] font-medium  `}
        >
          <p> Sayta daxil edilən</p>
          <p>məlumatlardan xəbərdar ol.</p>
        </div>
        <div className="w-full md:w-95 rounded-[4px] border border-[#E1E1E1] flex mt-10">
          <div className="w-full md:w-72 h-12">
            <input
              type="email"
              placeholder="E-poçt"
              name="email"
              className="rounded-l-sm h-full w-full bg-transparent border-r border-#E1E1E1 outline-none pl-4 text-sm text-#F0EDEA4D font-[roboto]"
              autoComplete="off"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <button
            className="w-25 rounded-r-sm font-[lexend] font-semibold text-xs"
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
