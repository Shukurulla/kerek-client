import React from "react";
import { Loader2 } from "lucide-react";

// Spinner Component
const Spinner = ({ size = "md", color = "primary", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colors = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    white: "text-white",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  };

  return (
    <Loader2
      className={`animate-spin ${sizes[size]} ${colors[color]} ${className}`}
    />
  );
};

// Loading Dots
const LoadingDots = ({ size = "md", color = "primary", className = "" }) => {
  const sizes = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const colors = {
    primary: "bg-blue-600",
    secondary: "bg-gray-600",
    white: "bg-white",
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizes[size]} ${colors[color]} rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.4s",
          }}
        />
      ))}
    </div>
  );
};

// Skeleton Loader
const Skeleton = ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded",
  className = "",
}) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${width} ${height} ${rounded} ${className}`}
    />
  );
};

// Progress Bar
const ProgressBar = ({
  progress = 0,
  size = "md",
  color = "primary",
  showPercentage = false,
  className = "",
}) => {
  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colors = {
    primary: "bg-blue-600",
    secondary: "bg-gray-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
  };

  return (
    <div className={className}>
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 mt-1 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

// Loading Screen
const LoadingScreen = ({ message = "Yuklanmoqda...", showLogo = true }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        {showLogo && (
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
        )}
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Card Skeleton
const CardSkeleton = ({ showImage = true, showAvatar = false, lines = 3 }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      {showImage && (
        <Skeleton
          width="w-full"
          height="h-48"
          rounded="rounded-lg"
          className="mb-4"
        />
      )}

      {showAvatar && (
        <div className="flex items-center mb-4">
          <Skeleton
            width="w-12"
            height="h-12"
            rounded="rounded-full"
            className="mr-3"
          />
          <div className="flex-1">
            <Skeleton width="w-24" height="h-4" className="mb-2" />
            <Skeleton width="w-16" height="h-3" />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            width={i === lines - 1 ? "w-3/4" : "w-full"}
            height="h-4"
          />
        ))}
      </div>
    </div>
  );
};

// List Skeleton
const ListSkeleton = ({ items = 5, showAvatar = true }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 animate-pulse">
          {showAvatar && (
            <Skeleton width="w-10" height="h-10" rounded="rounded-full" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton width="w-1/4" height="h-4" />
            <Skeleton width="w-full" height="h-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Loading Component
const Loading = ({
  type = "spinner",
  size = "md",
  color = "primary",
  message,
  fullScreen = false,
  className = "",
  ...props
}) => {
  const content = {
    spinner: <Spinner size={size} color={color} className={className} />,
    dots: <LoadingDots size={size} color={color} className={className} />,
    skeleton: <Skeleton className={className} />,
    progress: (
      <ProgressBar size={size} color={color} className={className} {...props} />
    ),
  };

  if (fullScreen) {
    return <LoadingScreen message={message} />;
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {content[type]}
      {message && <p className="text-gray-600 text-sm mt-2">{message}</p>}
    </div>
  );
};

// Attach sub-components
Loading.Spinner = Spinner;
Loading.Dots = LoadingDots;
Loading.Skeleton = Skeleton;
Loading.Progress = ProgressBar;
Loading.Screen = LoadingScreen;
Loading.CardSkeleton = CardSkeleton;
Loading.ListSkeleton = ListSkeleton;

export default Loading;
