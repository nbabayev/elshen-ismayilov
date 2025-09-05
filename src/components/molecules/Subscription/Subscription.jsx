import FormInput from "@/components/atoms/FormInput/FormInput";
import React from "react";

const Subscription = ({ titleFont, center }) => {
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
            <FormInput type="email" placeholder="E-poçt" name="email" />
          </div>
          <button
            className="w-25 rounded-r-sm font-[lexend] font-semibold text-xs"
            type="button"
          >
            Abunə ol
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
