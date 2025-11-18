"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";
import { MouseEventHandler } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
  variant = "danger"
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "text-red-500",
      confirmButton: "bg-red-500 hover:bg-red-600 text-white",
      border: "border-red-200"
    },
    warning: {
      icon: "text-bambu-terracota",
      confirmButton: "bg-bambu-terracota hover:bg-bambu-terracota/90 text-white",
      border: "border-bambu-terracota/30"
    },
    info: {
      icon: "text-bambu-green",
      confirmButton: "bg-bambu-green hover:bg-bambu-green-dark text-white",
      border: "border-bambu-green/30"
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-bambu-beige/30 p-6 m-4 max-w-md w-full animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-2 rounded-full bg-gray-100 ${styles.icon}`}>
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-bambu-brown mb-1">
              {title}
            </h3>
            <p className="text-bambu-brown/70 text-sm">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-bambu-brown/50 hover:text-bambu-brown"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-bambu-beige/20">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-bambu-brown/20 text-bambu-brown hover:bg-bambu-brown/5"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={styles.confirmButton}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Processando...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}