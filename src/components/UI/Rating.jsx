import React, { useState } from "react";
import { Star } from "lucide-react";

const Rating = ({
  value = 0,
  onChange,
  readonly = false,
  size = "md",
  showValue = false,
  showCount = false,
  count = 0,
  className = "",
  ...props
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  const [tempValue, setTempValue] = useState(value);

  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      setTempValue(rating);
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const displayValue = hoverValue || tempValue || value;

  return (
    <div className={`flex items-center space-x-1 ${className}`} {...props}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayValue;
          const isHalfFilled =
            star - 0.5 <= displayValue && star > displayValue;

          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              className={`${
                readonly ? "cursor-default" : "cursor-pointer"
              } focus:outline-none`}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
            >
              <Star
                className={`${sizes[size]} transition-colors ${
                  isFilled || isHalfFilled
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className={`font-medium text-gray-900 ${textSizes[size]}`}>
          {displayValue.toFixed(1)}
        </span>
      )}

      {showCount && count > 0 && (
        <span className={`text-gray-500 ${textSizes[size]}`}>({count})</span>
      )}
    </div>
  );
};

export default Rating;
