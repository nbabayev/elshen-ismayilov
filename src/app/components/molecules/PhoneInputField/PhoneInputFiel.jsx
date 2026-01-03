// components/PhoneInputField.jsx
"use client";

const PhoneInput = dynamic(() => import("react-phone-number-input"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import "react-phone-number-input/style.css";
import { getExampleNumber } from "libphonenumber-js";
import metadata from "libphonenumber-js/metadata.min.json";
export default function PhoneInputField({ value, onChange, error }) {
  const [country, setCountry] = useState("AZ");

  // ölkəyə görə max uzunluğu tapırıq
  const maxLen = useMemo(() => {
    const example = getExampleNumber(country, metadata);
    return example ? example.nationalNumber.length : 15; // fallback 15
  }, [country]);

  //   const CustomInput = (props) => {
  //     return <input {...props} maxLength={props.maxLength} />;
  //   };
  return (
    <div className="flex flex-col">
      <PhoneInput
        className="w-full px-3 py-2 border rounded focus:outline-none  text-[#878787]"
        placeholder="Telefon nömrəsini yazın"
        defaultCountry="AZ"
        value={value}
        onCountryChange={setCountry}
        onChange={onChange}
        withCountryCallingCode
        international
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
