"use client";

import {
  useState,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const toastRef = useRef(new Map());

  const addToast = useCallback((message, type = "info", options = {}) => {
    const id = Date.now() + Math.random();
    const duration = options.duration !== undefined ? options.duration : 5000;

    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
      action: options.action,
      persistent: options.persistent || false,
      position: options.position || "top-right",
      ...options,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto dismiss after duration (unless persistent)
    if (!toast.persistent && duration > 0) {
      const timeoutId = setTimeout(() => {
        removeToast(id);
      }, duration);

      toastRef.current.set(id, timeoutId);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    // Clear timeout if exists
    const timeoutId = toastRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      toastRef.current.delete(id);
    }
  }, []);

  const updateToast = useCallback((id, updates) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast))
    );
  }, []);

  const clearAllToasts = useCallback(() => {
    // Clear all timeouts
    toastRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    toastRef.current.clear();

    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (message, options = {}) => {
      return addToast(message, "success", options);
    },
    [addToast]
  );

  const error = useCallback(
    (message, options = {}) => {
      return addToast(message, "error", { duration: 8000, ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return addToast(message, "warning", options);
    },
    [addToast]
  );

  const info = useCallback(
    (message, options = {}) => {
      return addToast(message, "info", options);
    },
    [addToast]
  );

  const loading = useCallback(
    (message, options = {}) => {
      return addToast(message, "loading", { persistent: true, ...options });
    },
    [addToast]
  );

  // Promise toast - shows loading, then success/error
  const promise = useCallback(
    (promiseFn, messages) => {
      const loadingId = loading(messages.loading || "Yuklanmoqda...");

      return promiseFn()
        .then((result) => {
          removeToast(loadingId);
          if (messages.success) {
            success(messages.success);
          }
          return result;
        })
        .catch((error) => {
          removeToast(loadingId);
          const errorMessage =
            messages.error || error.message || "Xato yuz berdi";
          error(errorMessage);
          throw error;
        });
    },
    [addToast, removeToast, loading, success, error]
  );

  // Custom toast with action
  const withAction = useCallback(
    (message, type, actionText, actionHandler, options = {}) => {
      return addToast(message, type, {
        ...options,
        action: {
          text: actionText,
          handler: actionHandler,
        },
      });
    },
    [addToast]
  );

  // Undo toast
  const undo = useCallback(
    (message, undoHandler, options = {}) => {
      return withAction(message, "info", "Bekor qilish", undoHandler, {
        duration: 8000,
        ...options,
      });
    },
    [withAction]
  );

  // Retry toast
  const retry = useCallback(
    (message, retryHandler, options = {}) => {
      return withAction(message, "error", "Qayta urinish", retryHandler, {
        duration: 0,
        ...options,
      });
    },
    [withAction]
  );

  // Dismiss by type
  const dismissByType = useCallback((type) => {
    setToasts((prev) => {
      const toastsToDismiss = prev.filter((toast) => toast.type === type);
      toastsToDismiss.forEach((toast) => {
        const timeoutId = toastRef.current.get(toast.id);
        if (timeoutId) {
          clearTimeout(timeoutId);
          toastRef.current.delete(toast.id);
        }
      });

      return prev.filter((toast) => toast.type !== type);
    });
  }, []);

  // Get toast count by type
  const getToastCount = useCallback(
    (type) => {
      return toasts.filter((toast) => toast.type === type).length;
    },
    [toasts]
  );

  // Check if has toasts of type
  const hasToasts = useCallback(
    (type) => {
      return type ? getToastCount(type) > 0 : toasts.length > 0;
    },
    [toasts, getToastCount]
  );

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
    clearAllToasts,
    dismissByType,
    getToastCount,
    hasToasts,

    // Convenience methods
    success,
    error,
    warning,
    info,
    loading,
    promise,
    withAction,
    undo,
    retry,
  };
};

// Context for toast provider
const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
  );
};

const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }
  return context;
};

export default useToast;
export { ToastProvider, useToastContext, useToast };
