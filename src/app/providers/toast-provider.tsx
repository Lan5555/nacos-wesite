"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastState {
  open: boolean;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return ctx;
}

/* ---------------- ICON COLORS ---------------- */

const iconStyles: Record<ToastType, string> = {
  success: "bg-green-100 text-green-600",
  error: "bg-red-100 text-red-600",
  warning: "bg-yellow-100 text-yellow-600",
  info: "bg-blue-100 text-blue-600",
};

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

/* ---------------- PROVIDER ---------------- */

interface Props {
  children: ReactNode;
}

export default function ToastProvider({ children }: Props) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      setToast({ open: true, message, type });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, open: false }));
      }, 3000);
    },
    []
  );

  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const Icon = icons[toast.type];

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* GLOBAL TOAST LAYER */}
      <div className="fixed inset-0 pointer-events-none z-99999">
        <AnimatePresence>
          {toast.open && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="
                absolute top-5 right-5
                flex items-center gap-3
                min-w-85
                rounded-xl
                bg-white
                border border-gray-200
                shadow-xl
                px-3 py-4
                pointer-events-auto
              "
            >
              {/* ICON */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${iconStyles[toast.type]}`}
              >
                <Icon size={20} />
              </div>

              {/* MESSAGE */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {toast.message}
                </p>
              </div>

              {/* CLOSE */}
              <button
                onClick={closeToast}
                className="rounded-full p-2 hover:bg-gray-100 transition"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}