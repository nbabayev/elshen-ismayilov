import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children?: ReactNode;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  label?: string;
  icon?: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
};

const Button = ({
  children,
  onClick,
  label,
  icon,
  type = "button",
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-roboto-slab text-base border border-[#C88445] 
    text-[#C88445] rounded px-6 py-2.5 inline-flex items-center 
    justify-center gap-2.5 hover:border-[#AD6E33] hover:text-[#AD6E33] [&:hover_svg]:stroke-[#AD6E33] ${className}`}
    >
      {children ?? label}
      {icon}
    </button>
  );
};

export default Button;
