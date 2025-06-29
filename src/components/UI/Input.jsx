import React, { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      error,
      helpText,
      type = "text",
      placeholder,
      disabled = false,
      required = false,
      fullWidth = true,
      size = "md",
      icon,
      iconPosition = "left",
      showPasswordToggle = false,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    const baseClasses =
      "block border rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-5 h-5",
    };

    const getInputClasses = () => {
      let classes = [baseClasses, sizes[size]];

      if (error) {
        classes.push("border-red-300 focus:ring-red-500 focus:border-red-500");
      } else if (focused) {
        classes.push(
          "border-primary-300 focus:ring-primary-500 focus:border-primary-500"
        );
      } else {
        classes.push(
          "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        );
      }

      if (disabled) {
        classes.push("bg-gray-50 text-gray-500 cursor-not-allowed");
      } else {
        classes.push("bg-white text-gray-900");
      }

      if (fullWidth) {
        classes.push("w-full");
      }

      if (icon && iconPosition === "left") {
        classes.push("pl-10");
      }

      if (
        (icon && iconPosition === "right") ||
        (type === "password" && showPasswordToggle) ||
        error
      ) {
        classes.push("pr-10");
      }

      classes.push(className);

      return classes.filter(Boolean).join(" ");
    };

    const getLabelClasses = () => {
      let classes = ["block text-sm font-medium mb-1"];

      if (error) {
        classes.push("text-red-700");
      } else {
        classes.push("text-gray-700");
      }

      return classes.join(" ");
    };

    const IconComponent = icon;
    const iconClass = `absolute inset-y-0 flex items-center ${iconSizes[size]} text-gray-400`;

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {label && (
          <label className={getLabelClasses()}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {icon && iconPosition === "left" && (
            <div className={`${iconClass} left-0 pl-3`}>
              <IconComponent />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={getInputClasses()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />

          {/* Right Icons */}
          <div
            className={`${iconClass} right-0 pr-3 flex items-center space-x-2`}
          >
            {/* Error Icon */}
            {error && (
              <AlertCircle className={`${iconSizes[size]} text-red-500`} />
            )}

            {/* Password Toggle */}
            {type === "password" && showPasswordToggle && (
              <button
                type="button"
                className={`${iconSizes[size]} text-gray-400 hover:text-gray-600 focus:outline-none`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            )}

            {/* Right Icon */}
            {icon &&
              iconPosition === "right" &&
              !error &&
              !(type === "password" && showPasswordToggle) && <IconComponent />}
          </div>
        </div>

        {/* Help Text */}
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helpText}</p>
        )}

        {/* Error Message */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
