import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

function Button({ children, className, onClick }: ButtonProps) {
  return (
    <button
      className={
        "bg-primary text-white text-sm font-semibold rounded-lg px-3 py-2 hover:bg-opacity-80 active:scale-95 duration-150 ease-linear transition-all " +
        className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
