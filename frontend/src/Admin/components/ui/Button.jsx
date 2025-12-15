import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "w-full py-3 px-6 font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-primary-500/30",
    secondary:
      "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-slate-200/50",
    outline:
      "bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-600 shadow-none hover:translate-y-0",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
