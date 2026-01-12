"use client";

import { useEffect, useState } from "react";
import * as Icons from "../../components/icons";

interface ToastProps {
  message: string;
  type?: "info" | "success" | "error" | "warning";
  visible: boolean;
  onRequestClose?: () => void;
  onHidden?: () => void;
}

export default function Toast({
  message,
  type = "info",
  visible,
  onRequestClose,
  onHidden,
}: ToastProps) {
  const [mounted, setMounted] = useState(visible);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      // allow next tick for transition
      requestAnimationFrame(() => setShow(true));
    } else if (mounted) {
      setShow(false);
      const t = setTimeout(() => {
        setMounted(false);
        if (onHidden) onHidden();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [visible, mounted, onHidden]);

  if (!mounted) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-500",
          text: "text-white",
          iconColor: "text-white",
        };
      case "error":
        return {
          bg: "bg-red-500",
          text: "text-white",
          iconColor: "text-white",
        };
      case "warning":
        return {
          bg: "bg-amber-400",
          text: "text-amber-900",
          iconColor: "text-amber-900",
        };
      default:
        return {
          bg: "bg-indigo-500",
          text: "text-white",
          iconColor: "text-white",
        };
    }
  };

  const styles = getToastStyles();

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <Icons.CalendarCheckIcon className={`w-5 h-5 ${styles.iconColor}`} />
        );
      case "error":
        return <Icons.XIcon className={`w-5 h-5 ${styles.iconColor}`} />;
      case "warning":
        return (
          <Icons.FileWarningIcon className={`w-5 h-5 ${styles.iconColor}`} />
        );
      default:
        return <Icons.InfoIcon className={`w-5 h-5 ${styles.iconColor}`} />;
    }
  };

  return (
    <div
      className={`${styles.bg} ${
        styles.text
      } rounded-lg shadow-lg ring-1 ring-black/10 overflow-hidden fixed bottom-6 right-6 z-50 w-auto max-w-xs transform transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="shrink-0 rounded-full bg-white/20 p-2">{getIcon()}</div>
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => {
            if (onRequestClose) onRequestClose();
          }}
          aria-label="Cerrar notificación"
        >
          <Icons.XIcon className={`w-4 h-4 ${styles.iconColor}`} />
        </button>
      </div>
    </div>
  );
}
