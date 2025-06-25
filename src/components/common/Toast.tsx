import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { MdError } from "react-icons/md";

// Types
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastAPI {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  remove: (id: string) => void;
}

// Global toast state
let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

const toast: ToastAPI = {
  success: (message: string, duration = 4000) =>
    addToast(message, "success", duration),
  error: (message: string, duration = 4000) =>
    addToast(message, "error", duration),
  warning: (message: string, duration = 4000) =>
    addToast(message, "warning", duration),
  info: (message: string, duration = 4000) =>
    addToast(message, "info", duration),
  remove: (id: string) => removeToast(id),
};

const addToast = (message: string, type: ToastType, duration: number) => {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const newToast = { id, message, type, duration };

  toasts = [...toasts, newToast];
  notifyListeners();

  // Auto-remove toast after duration
  setTimeout(() => removeToast(id), duration);
};

const removeToast = (id: string) => {
  toasts = toasts.filter((toast) => toast.id !== id);
  notifyListeners();
};

const notifyListeners = () => {
  toastListeners.forEach((listener) => listener([...toasts]));
};

const useToasts = () => {
  const [state, setState] = useState<Toast[]>(toasts);

  useEffect(() => {
    toastListeners.push(setState);
    return () => {
      toastListeners = toastListeners.filter(
        (listener) => listener !== setState
      );
    };
  }, []);

  return state;
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // setTimeout(() => toast.remove(toast.id), 300);
  };

  const getStyles = () => {
    const base =
      "relative flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm max-w-sm w-full overflow-hidden";
    const typeStyles = {
      success: "bg-green-50 border-green-500 text-green-800",
      error: "bg-red-50 border-red-500 text-red-800",
      warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
      info: "bg-blue-50 border-blue-500 text-blue-800",
    };
    return `${base} ${typeStyles[toast.type]}`;
  };

  const getIcon = () => {
    const iconClass = "text-lg flex-shrink-0 mt-0.5";
    const icons = {
      success: <FaCheckCircle className={`${iconClass} text-green-600`} />,
      error: <MdError className={`${iconClass} text-red-600`} />,
      warning: (
        <FaExclamationTriangle className={`${iconClass} text-yellow-600`} />
      ),
      info: <FaInfoCircle className={`${iconClass} text-blue-600`} />,
    };
    return icons[toast.type];
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out transform ${
        isVisible
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      }`}
    >
      <div className={getStyles()}>
        {getIcon()}
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-sm font-medium leading-5 break-words">
            {toast.message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity p-1 rounded hover:bg-black hover:bg-opacity-10"
          aria-label="Close notification"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const toasts = useToasts();

  return (
    <div className="fixed top-4 right-4 z-[1100] space-y-3 pointer-events-none sm:max-w-sm">
      <div className="space-y-3 pointer-events-auto px-4 sm:px-0">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};

export { toast, ToastContainer };
