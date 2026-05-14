"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white hover:bg-black/80 shadow-lg",
  secondary:
    "bg-white text-black border border-gray-300 hover:bg-gray-100",
  danger:
    "bg-red-500 text-white hover:bg-red-600",
  ghost:
    "bg-transparent text-black hover:bg-black/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm rounded-lg",
  md: "px-5 py-2 text-base rounded-xl",
  lg: "px-7 py-3 text-lg rounded-2xl",
};

const NascosButton: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={`
        font-medium
        transition-all
        duration-200
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        flex items-center justify-center gap-2

        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}

      {children}
    </button>
  );
}
export default NascosButton;