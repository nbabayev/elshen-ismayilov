import React from "react";
import Image from "next/image";
// styles
import styles from "./button.module.scss";
import ShareIcon from "@/app/components/shared/ShareIcon";

const Button = ({ children, onClick, label, icon }) => {
  return (
    <button
      onClick={onClick}
      className="font-roboto-slab text-base border border-[#C88445] 
    text-[#C88445] rounded px-6 py-2.5 inline-flex items-center 
    justify-center gap-2.5 hover:border-[#AD6E33] hover:text-[#AD6E33] [&:hover_svg]:stroke-[#AD6E33]"
    >
      {children}
      {icon}
    </button>
  );
};

export default Button;
