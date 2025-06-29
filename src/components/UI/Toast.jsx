import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({
  id,
  type = "info",
  title,
  message,
  duration = 4000,
  onClose,
  position = "top-right",
  showCloseButton = true,
  action = null,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto hide after duration
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      case "info":
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          icon: "text-green-600",
          title: "text-green-900",
          message: "text-green-700",
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          icon: "text-red-600",
          title: "text-red-900",
          message: "text-red-700",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          icon: "text-yellow-600",
          title: "text-yellow-900",
          message: "text-yellow-700",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: "text-blue-600",
          title: "text-blue-900",
          message: "text-blue-700",
        };
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "top-right":
      default:
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      case "bottom-right":
        return "bottom-4 right-4";
    }
  };

  const colors = getColors();

  if (!isVisible && !isLeaving) return null;

  return (
    <div
      className={`
        fixed z-50 max-w-sm w-full
        ${getPositionClasses()}
        transform transition-all duration-300 ease-in-out
        ${
          isVisible && !isLeaving
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }
      `}
    >
      <div
        className={`
          p-4 rounded-lg border shadow-lg
          ${colors.bg}
        `}
        role="alert"
      >
        <div className="flex">
          <div className={`flex-shrink-0 ${colors.icon}`}>{getIcon()}</div>

          <div className="ml-3 flex-1">
            {title && (
              <h3 className={`text-sm font-medium ${colors.title}`}>{title}</h3>
            )}

            {message && (
              <div
                className={`text-sm ${colors.message} ${title ? "mt-1" : ""}`}
              >
                {message}
              </div>
            )}

            {action && <div className="mt-3">{action}</div>}
          </div>

          {showCloseButton && (
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={handleClose}
                className={`
                  inline-flex rounded-md p-1.5 transition-colors
                  ${colors.icon} hover:bg-black hover:bg-opacity-10
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
                `}
              >
                <span className="sr-only">Yopish</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-2 w-full bg-black bg-opacity-10 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all ease-linear ${
              type === "success"
                ? "bg-green-500"
                : type === "error"
                ? "bg-red-500"
                : type === "warning"
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
            style={{
              width: "100%",
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  );
};

// Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type, title, message, duration, action }) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type,
      title,
      message,
      duration,
      action,
    };

    setToasts((prev) => [...prev, newToast]);

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = (message, type = "info", options = {}) => {
    return addToast({
      type,
      message,
      ...options,
    });
  };

  const showSuccess = (message, options = {}) => {
    return showToast(message, "success", options);
  };

  const showError = (message, options = {}) => {
    return showToast(message, "error", options);
  };

  const showWarning = (message, options = {}) => {
    return showToast(message, "warning", options);
  };

  const showInfo = (message, options = {}) => {
    return showToast(message, "info", options);
  };

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    addToast,
  };
};

export default Toast;
