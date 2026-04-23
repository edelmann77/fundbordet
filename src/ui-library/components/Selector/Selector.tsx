import React, {
  useId,
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
} from "react";
import { cn } from "../../lib/cn";
import "./Selector.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectorSize = "sm" | "md" | "lg";

interface BaseProps {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  size?: SelectorSize;
  id?: string;
  className?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="0.9em" height="0.9em" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="0.7em" height="0.7em" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

// ─── Size maps ────────────────────────────────────────────────────────────────

// Styles moved to Selector.css

// ─── Component ────────────────────────────────────────────────────────────────

export const Selector: React.FC<
  BaseProps &
    (
      | { multiple?: false; value?: string; onChange?: (value: string) => void }
      | {
          multiple: true;
          value?: string[];
          onChange?: (value: string[]) => void;
        }
    )
> = ({
  options,
  multiple,
  label,
  placeholder = "Select…",
  disabled = false,
  error,
  helperText,
  size = "md",
  id: externalId,
  className,
  value,
  onChange,
}) => {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // ── Derived values ──────────────────────────────────────────────────────────

  const selectedValues: string[] = multiple
    ? ((value as string[] | undefined) ?? [])
    : value
      ? [value as string]
      : [];

  const isSelected = (v: string) => selectedValues.includes(v);

  // ── Close on outside click ──────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Scroll active option into view ──────────────────────────────────────────

  useEffect(() => {
    if (!open || activeIndex < 0 || !listRef.current) return;
    const items =
      listRef.current.querySelectorAll<HTMLElement>('[role="option"]');
    items[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  // ── Selection logic ─────────────────────────────────────────────────────────

  const select = (optionValue: string, optionDisabled?: boolean) => {
    if (optionDisabled) return;

    if (multiple) {
      const cur = (value as string[] | undefined) ?? [];
      const next = cur.includes(optionValue)
        ? cur.filter((v) => v !== optionValue)
        : [...cur, optionValue];
      (onChange as ((v: string[]) => void) | undefined)?.(next);
    } else {
      (onChange as ((v: string) => void) | undefined)?.(optionValue);
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleTriggerClick = () => {
    setOpen((v) => !v);
    if (!open) setActiveIndex(-1);
  };

  const handleOptionMouseEnter = (index: number, disabled?: boolean) => () => {
    if (!disabled) setActiveIndex(index);
  };

  const handleOptionMouseLeave = () => setActiveIndex(-1);

  const handleOptionClick = (optionValue: string, disabled?: boolean) => () =>
    select(optionValue, disabled);

  const removeTag = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!multiple) return;
    const cur = (value as string[] | undefined) ?? [];
    (onChange as ((v: string[]) => void) | undefined)?.(
      cur.filter((v) => v !== optionValue),
    );
  };

  const handleRemoveTag =
    (optionValue: string) => (e: React.MouseEvent<HTMLButtonElement>) =>
      removeTag(optionValue, e);

  // ── Keyboard handling ───────────────────────────────────────────────────────

  const openAndFocus = (startIndex = 0) => {
    setOpen(true);
    setActiveIndex(startIndex);
  };

  const handleTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) {
          setOpen(false);
        } else {
          openAndFocus(
            selectedValues.length
              ? options.findIndex((o) => o.value === selectedValues[0])
              : 0,
          );
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        openAndFocus(open ? Math.min(activeIndex + 1, options.length - 1) : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        openAndFocus(open ? Math.max(activeIndex - 1, 0) : options.length - 1);
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  const handleListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0) {
          select(options[activeIndex].value, options[activeIndex].disabled);
        }
        break;
      case "Escape":
      case "Tab":
        setOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  // ── Border / ring state ─────────────────────────────────────────────────────

  const borderClass = error
    ? "selector__trigger--border-error"
    : open
      ? "selector__trigger--border-focus"
      : "selector__trigger--border-default";

  const ringClass =
    open && error
      ? "selector__trigger--ring-error"
      : open
        ? "selector__trigger--ring-focus"
        : "";

  // ── Trigger display content ─────────────────────────────────────────────────

  const renderTriggerContent = () => {
    if (selectedValues.length === 0) {
      return (
        <span className="selector__trigger-placeholder">{placeholder}</span>
      );
    }

    if (multiple) {
      return (
        <span className="selector__trigger-content">
          {selectedValues.map((v) => {
            const opt = options.find((o) => o.value === v);
            if (!opt) return null;
            return (
              <span key={v} className="selector__tag">
                {opt.label}
                {!disabled && (
                  <button
                    type="button"
                    onMouseDown={handleRemoveTag(v)}
                    aria-label={`Remove ${opt.label}`}
                    tabIndex={-1}
                    className="selector__tag-remove"
                  >
                    <XIcon />
                  </button>
                )}
              </span>
            );
          })}
        </span>
      );
    }

    const selected = options.find((o) => o.value === (value as string));
    return (
      <span className="selector__trigger-value">
        {selected?.label ?? value}
      </span>
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className={cn("selector", className)}>
      {/* Label */}
      {label && (
        <label
          id={labelId}
          htmlFor={id}
          className={cn(
            "selector__label",
            disabled
              ? "selector__label--disabled"
              : error
                ? "selector__label--error"
                : "selector__label--default",
          )}
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={label ? labelId : undefined}
        disabled={disabled}
        onKeyDown={handleTriggerKey}
        onClick={handleTriggerClick}
        className={cn(
          "selector__trigger",
          `selector__trigger--${size}`,
          borderClass,
          ringClass,
        )}
      >
        {renderTriggerContent()}

        <span
          className={cn("selector__chevron", open && "selector__chevron--open")}
          aria-hidden="true"
        >
          <ChevronDown />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-multiselectable={multiple ?? false}
          aria-label={label ?? "Options"}
          onKeyDown={handleListKey}
          tabIndex={-1}
          className="selector__dropdown"
        >
          {options.length === 0 ? (
            <li className="selector__option selector__option--empty">
              No options available
            </li>
          ) : (
            options.map((option, index) => {
              const selected = isSelected(option.value);
              const active = activeIndex === index;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={option.disabled}
                  onMouseEnter={handleOptionMouseEnter(index, option.disabled)}
                  onMouseLeave={handleOptionMouseLeave}
                  onClick={handleOptionClick(option.value, option.disabled)}
                  className={cn(
                    "selector__option",
                    `selector__option--${size}`,
                    option.disabled && "disabled",
                    active && !option.disabled && "selector__option--active",
                    selected &&
                      !option.disabled &&
                      "selector__option--selected",
                  )}
                >
                  {/* Multi: checkbox  |  Single: checkmark placeholder */}
                  {multiple ? (
                    <span
                      className={cn(
                        "selector__checkbox",
                        selected
                          ? "selector__checkbox--checked"
                          : "selector__checkbox--unchecked",
                      )}
                      aria-hidden="true"
                    >
                      {selected && (
                        <svg viewBox="0 0 24 24" fill="white">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "selector__checkmark",
                        !selected && "selector__checkmark--hidden",
                      )}
                      aria-hidden="true"
                    >
                      <CheckIcon />
                    </span>
                  )}

                  <span className="selector__option-label">{option.label}</span>
                </li>
              );
            })
          )}
        </ul>
      )}

      {/* Error / helper */}
      {error && (
        <p role="alert" className="selector__message selector__message--error">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="selector__message selector__message--helper">
          {helperText}
        </p>
      )}
    </div>
  );
};

Selector.displayName = "Selector";
