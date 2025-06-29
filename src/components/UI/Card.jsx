import React from "react";

const Card = ({
  children,
  className = "",
  hover = false,
  padding = "md",
  shadow = "sm",
  border = true,
  rounded = "lg",
  ...props
}) => {
  const baseClasses = "bg-white overflow-hidden transition-all duration-300";

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const roundeds = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
  };

  const hoverClasses = hover
    ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    : "";
  const borderClasses = border ? "border border-gray-200" : "";

  const classes = [
    baseClasses,
    paddings[padding],
    shadows[shadow],
    roundeds[rounded],
    borderClasses,
    hoverClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card components
const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`pb-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

const CardBody = ({ children, className = "", ...props }) => (
  <div className={`py-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = "", ...props }) => (
  <div className={`pt-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

// Attach sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
