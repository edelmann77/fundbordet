import React, { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";
import "./Modal.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

// ─── Close icon ───────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  hideCloseButton?: boolean;
  disableBackdropClose?: boolean;
  className?: string;
  children?: ReactNode;
}> = ({
  open,
  onClose,
  title,
  footer,
  size = "md",
  hideCloseButton = false,
  disableBackdropClose = false,
  className,
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Focus the panel when opened
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disableBackdropClose && e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      role="presentation"
      className={cn("modal", open && "modal--open")}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="modal__backdrop" aria-hidden="true" />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "tf-modal-title" : undefined}
        tabIndex={-1}
        className={cn("modal__panel", `modal__panel--${size}`, className)}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="modal__header">
            {title && (
              <h2 id="tf-modal-title" className="modal__title">
                {title}
              </h2>
            )}
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="modal__close"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal__body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};

Modal.displayName = "Modal";
