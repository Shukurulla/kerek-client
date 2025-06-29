import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      icon = null,
      iconPosition = "left",
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300",
      secondary:
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 disabled:bg-gray-100",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
      warning:
        "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-yellow-300",
      ghost:
        "text-gray-700 hover:bg-gray-100 focus:ring-primary-500 disabled:text-gray-400",
      link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500 disabled:text-primary-300",
    };

    const sizes = {
      xs: "px-2.5 py-1.5 text-xs",
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-4 py-2 text-base",
      xl: "px-6 py-3 text-base",
    };

    const iconSizes = {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-4 h-4",
      lg: "w-5 h-5",
      xl: "w-5 h-5",
    };

    const isDisabled = disabled || loading;

    const classes = [
      baseClasses,
      variants[variant],
      sizes[size],
      fullWidth ? "w-full" : "",
      isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const iconClass = iconSizes[size];
    const spacingClass = iconPosition === "left" ? "mr-2" : "ml-2";

    const renderIcon = () => {
      if (loading) {
        return (
          <Loader2
            className={`${iconClass} animate-spin ${
              children ? spacingClass : ""
            }`}
          />
        );
      }

      if (icon) {
        const IconComponent = icon;
        return (
          <IconComponent
            className={`${iconClass} ${children ? spacingClass : ""}`}
          />
        );
      }

      return null;
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={classes}
        {...props}
      >
        {iconPosition === "left" && renderIcon()}
        {children}
        {iconPosition === "right" && renderIcon()}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
