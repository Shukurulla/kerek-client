import React from "react";
import { User } from "lucide-react";

const Avatar = ({
  src,
  alt,
  name,
  size = "md",
  online = false,
  verified = false,
  className = "",
  fallbackIcon = true,
  ...props
}) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
  };

  const onlineSizes = {
    xs: "w-1.5 h-1.5 bottom-0 right-0",
    sm: "w-2 h-2 bottom-0 right-0",
    md: "w-2.5 h-2.5 bottom-0 right-0",
    lg: "w-3 h-3 bottom-0 right-0",
    xl: "w-4 h-4 bottom-0 right-0",
    "2xl": "w-5 h-5 bottom-1 right-1",
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getBackgroundColor = (name) => {
    if (!name) return "bg-gray-500";

    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-purple-500",
      "bg-pink-500",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const baseClasses = `relative inline-flex items-center justify-center rounded-full overflow-hidden ${sizes[size]} ${className}`;

  const renderContent = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      );
    }

    if (name) {
      return (
        <div
          className={`w-full h-full flex items-center justify-center text-white font-medium ${getBackgroundColor(
            name
          )}`}
        >
          {getInitials(name)}
        </div>
      );
    }

    if (fallbackIcon) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <User className="w-1/2 h-1/2" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className={baseClasses} {...props}>
      {renderContent()}

      {/* Fallback for name initials when image fails */}
      {src && name && (
        <div
          className={`w-full h-full flex items-center justify-center text-white font-medium ${getBackgroundColor(
            name
          )}`}
          style={{ display: "none" }}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Online indicator */}
      {online && (
        <div
          className={`absolute ${onlineSizes[size]} bg-green-500 border-2 border-white rounded-full`}
        />
      )}

      {/* Verified badge */}
      {verified && (
        <div
          className={`absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center`}
        >
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

// Avatar Group Component
const AvatarGroup = ({
  avatars = [],
  max = 3,
  size = "md",
  spacing = "normal",
  className = "",
}) => {
  const spacings = {
    tight: "-space-x-1",
    normal: "-space-x-2",
    loose: "-space-x-3",
  };

  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  return (
    <div className={`flex items-center ${spacings[spacing]} ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={avatar.id || index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
          online={avatar.online}
          verified={avatar.verified}
          className="ring-2 ring-white"
        />
      ))}

      {remainingCount > 0 && (
        <div
          className={`${sizes[size]} bg-gray-100 border-2 border-white rounded-full flex items-center justify-center text-gray-600 font-medium text-sm`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

Avatar.Group = AvatarGroup;

export default Avatar;
