import React from "react";

const FormInput = ({ type, placeholder, name }) => {
  return (
    <input
      type={type}
      name={name}
      className="rounded-l-sm h-full w-full bg-transparent border-r border-#E1E1E1 outline-none pl-4 text-sm text-#F0EDEA4D font-[roboto]"
      placeholder={placeholder}
      autoComplete="off"
    />
  );
};

export default FormInput;
