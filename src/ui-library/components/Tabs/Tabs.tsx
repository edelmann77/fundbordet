import React, {
  ReactNode,
  useId,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { cn } from "../../lib/cn";
import "./Tabs.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem {
  /** Unique identifier for this tab */
  value: string;
  /** Tab trigger label */
  label: ReactNode;
  /** Content rendered when this tab is active */
  children: ReactNode;
  /** Disables selection of this tab */
  disabled?: boolean;
}

export type TabVariant = "line" | "pill";
export type TabSize = "sm" | "md" | "lg";

// ─── Class maps ───────────────────────────────────────────────────────────────

// Styles moved to Tabs.css

// ─── Component ────────────────────────────────────────────────────────────────

export const Tabs: React.FC<{
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  className?: string;
}> = ({
  tabs,
  value: controlledValue,
  defaultValue,
  onChange,
  variant = "line",
  size = "md",
  className,
}) => {
  const uid = useId();
  const isControlled = controlledValue !== undefined;

  const [internalValue, setInternalValue] = useState<string>(
    () => defaultValue ?? tabs.find((t) => !t.disabled)?.value ?? "",
  );

  const activeValue = isControlled ? controlledValue : internalValue;

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activate = (value: string) => {
    if (!isControlled) setInternalValue(value);
    onChange?.(value);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const enabledIndices = tabs
      .map((t, i) => (t.disabled ? null : i))
      .filter((i): i is number => i !== null);

    const pos = enabledIndices.indexOf(index);

    let nextIndex: number | undefined;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        nextIndex = enabledIndices[(pos + 1) % enabledIndices.length];
        break;
      case "ArrowLeft":
        e.preventDefault();
        nextIndex =
          enabledIndices[
            (pos - 1 + enabledIndices.length) % enabledIndices.length
          ];
        break;
      case "Home":
        e.preventDefault();
        nextIndex = enabledIndices[0];
        break;
      case "End":
        e.preventDefault();
        nextIndex = enabledIndices[enabledIndices.length - 1];
        break;
    }

    if (nextIndex !== undefined) {
      tabRefs.current[nextIndex]?.focus();
      activate(tabs[nextIndex].value);
    }
  };

  const handleTabClick = (tab: (typeof tabs)[number]) => () => {
    if (!tab.disabled) {
      activate(tab.value);
    }
  };

  const handleTabKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLButtonElement>) =>
      handleKeyDown(e, index);

  return (
    <div className={cn("tabs", className)}>
      {/* Tab list */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={cn("tabs__list", variant === "pill" && "tabs__list--pill")}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.value === activeValue;
          const tabId = `${uid}-tab-${tab.value}`;
          const panelId = `${uid}-panel-${tab.value}`;

          return (
            <button
              key={tab.value}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={panelId}
              aria-disabled={tab.disabled}
              disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              onClick={handleTabClick(tab)}
              onKeyDown={handleTabKeyDown(index)}
              className={cn(
                "tabs__trigger",
                `tabs__trigger--${size}`,
                `tabs__trigger--${variant}`,
                isActive && "tabs__trigger--active",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      {tabs.map((tab) => {
        const tabId = `${uid}-tab-${tab.value}`;
        const panelId = `${uid}-panel-${tab.value}`;
        const isActive = tab.value === activeValue;

        return (
          <div
            key={tab.value}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
            tabIndex={0}
            className="tabs__panel"
          >
            {isActive && tab.children}
          </div>
        );
      })}
    </div>
  );
};

Tabs.displayName = "Tabs";
