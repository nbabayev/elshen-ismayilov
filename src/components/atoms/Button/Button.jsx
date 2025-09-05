import React from "react";
import Image from "next/image";
// styles
import styles from "./button.module.scss";
import ShareIcon from "@/components/shared/ShareIcon";

const Button = ({ children, label, icon }) => {
  return (
    <button className={`${styles.button}`}>
      {children}
      {icon}
    </button>
  );
};

export default Button;
