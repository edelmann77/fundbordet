import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./Button.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Shows a loading spinner and disables interaction */
  loading?: boolean;
  /** Stretch button to fill its container */
  fullWidth?: boolean;
  /** Icon placed before the label */
  leftIcon?: ReactNode;
  /** Icon placed after the label */
  rightIcon?: ReactNode;
  children?: ReactNode;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = () => <span className="button__spinner" aria-hidden="true" />;

// ─── Component ────────────────────────────────────────────────────────────────

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...rest
}) => {
  return (
    <button
      className={cn(
        "button",
        `button--${size}`,
        `button--${variant}`,
        fullWidth && "button--fullwidth",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <Spinner />
      ) : (
        leftIcon && (
          <span className="button__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon && (
        <span className="button__icon" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

Button.displayName = "Button";
