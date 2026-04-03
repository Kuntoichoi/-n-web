"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal panel */}
      <div 
        className={cn(
          "relative z-50 w-full max-w-lg bg-brand-white p-6 shadow-2xl transition-all sm:rounded-none",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-6 flex items-center justify-between">
          {title && <h2 className="text-xl font-medium tracking-wide">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-light-gray text-brand-black transition-colors hover:bg-brand-border"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}
