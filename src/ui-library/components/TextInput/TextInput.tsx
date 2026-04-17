import React, { InputHTMLAttributes, ReactNode, useId, useState } from "react";
import { cn } from "../../lib/cn";
import "./TextInput.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TextInputSize = "sm" | "md" | "lg";

export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /** Label displayed above the input */
  label?: string;
  /** Helper text shown below the input */
  helperText?: string;
  /** Error message; switches the input to error state */
  error?: string;
  /** Size of the input field */
  size?: TextInputSize;
  /** Icon/element placed inside the left of the input */
  leftIcon?: ReactNode;
  /** Icon/element placed inside the right of the input (replaced by eye toggle when type="password") */
  rightIcon?: ReactNode;
  /** Mark the field as required */
  required?: boolean;
}

// ─── Eye icons ────────────────────────────────────────────────────────────────

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="currentColor">
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const TextInput: React.FC<TextInputProps> = ({
  label,
  helperText,
  error,
  size = "md",
  leftIcon,
  rightIcon,
  required,
  type = "text",
  disabled = false,
  id: externalId,
  className,
  onFocus,
  onBlur,
  ...rest
}) => {
  const generatedId = useId();
  const id = externalId ?? generatedId;

  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const hasLeft = Boolean(leftIcon);
  const hasRight = Boolean(isPassword || rightIcon);

  // Border & ring classes based on error/focus state
  const borderClass = error
    ? "text-input__wrapper--border-error"
    : focused
      ? "text-input__wrapper--border-focus"
      : "text-input__wrapper--border-default";

  const ringClass =
    focused && error
      ? "text-input__wrapper--ring-error"
      : focused
        ? "text-input__wrapper--ring-focus"
        : "";

  return (
    <div className={cn("text-input", className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-input__label",
            disabled
              ? "text-input__label--disabled"
              : error
                ? "text-input__label--error"
                : "text-input__label--default",
          )}
        >
          {label}
          {required && (
            <span className="text-input__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div
        className={cn(
          "text-input__wrapper",
          disabled
            ? "text-input__wrapper--disabled"
            : "text-input__wrapper--enabled",
          borderClass,
          ringClass,
        )}
      >
        {/* Left icon */}
        {leftIcon && (
          <span className="text-input__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Input */}
        <input
          id={id}
          type={resolvedType}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-hint` : undefined
          }
          className={cn(
            "text-input__input",
            `text-input__input--${size}`,
            hasLeft && "text-input__input--has-left",
            hasRight && "text-input__input--has-right",
          )}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {/* Right icon or password toggle */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
            className="text-input__password-toggle"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : (
          rightIcon && (
            <span className="text-input__icon--right" aria-hidden="true">
              {rightIcon}
            </span>
          )
        )}
      </div>

      {/* Error or helper text */}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-input__message text-input__message--error"
        >
          {error}
        </p>
      )}
      {!error && helperText && (
        <p
          id={`${id}-hint`}
          className="text-input__message text-input__message--helper"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

TextInput.displayName = "TextInput";
