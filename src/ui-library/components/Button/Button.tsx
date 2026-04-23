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

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = () => <span className="button__spinner" aria-hidden="true" />;

// ─── Component ────────────────────────────────────────────────────────────────

export const Button: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children?: ReactNode;
  }
> = ({
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
