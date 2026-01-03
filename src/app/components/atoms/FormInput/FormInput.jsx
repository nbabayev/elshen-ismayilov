import React from "react";

const FormInput = ({ type, placeholder, name }) => {
  return (
    <input
      type={type}
      name={name}
      className="
      w-full rounded-[4px] border border-[#878787]
      h-12
      rounded-l-sm w-full bg-transparent border-r border-#E1E1E1 outline-none pl-4 text-sm  text-[#878787] font-[roboto]"
      placeholder={placeholder}
      autoComplete="off"
    />
  );
};

export default FormInput;
