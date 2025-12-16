import React from "react";

const Input = ({ label, icon: Icon, error, className = "", ...props }) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full px-4 py-3 rounded-xl border ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-slate-200 focus:border-primary-500 focus:ring-primary-200"
          } focus:ring-2 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm ${
            Icon ? "pl-11" : ""
          }`}
          {...props}
        />
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={20} />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
