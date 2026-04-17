import React, { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./Breadcrumb.css";

export interface BreadcrumbItem {
  /** Visible text/content for the crumb */
  label: ReactNode;
  /** Link target for non-current crumbs */
  href?: string;
  /** Optional click handler for non-current crumbs */
  onClick?: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
  /** Marks this crumb as the active page */
  current?: boolean;
  /** Disables interaction for this crumb */
  disabled?: boolean;
}

export type BreadcrumbSize = "sm" | "md" | "lg";

export interface BreadcrumbProps {
  /** Ordered breadcrumb items from root to current page */
  items: BreadcrumbItem[];
  /** Accessible label for the breadcrumb nav */
  ariaLabel?: string;
  /** Separator rendered between items */
  separator?: ReactNode;
  /** Visual size variant */
  size?: BreadcrumbSize;
  /** Additional class names for the root nav */
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  ariaLabel = "Breadcrumb",
  separator = "/",
  size = "md",
  className,
}) => {
  const lastIndex = items.length - 1;

  return (
    <nav
      aria-label={ariaLabel}
      className={cn("breadcrumb", `breadcrumb--${size}`, className)}
    >
      <ul className="breadcrumb__list">
        {items.map((item, index) => {
          const isCurrent = item.current || index === lastIndex;

          return (
            <li key={index} className="breadcrumb__item">
              {isCurrent ? (
                <span className="breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  className={cn(
                    "breadcrumb__link",
                    item.disabled && "breadcrumb__link--disabled",
                  )}
                  href={item.disabled ? undefined : item.href}
                  onClick={item.disabled ? undefined : item.onClick}
                  aria-disabled={item.disabled || undefined}
                  tabIndex={item.disabled ? -1 : undefined}
                >
                  {item.label}
                </a>
              )}

              {index < lastIndex && (
                <span className="breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

Breadcrumb.displayName = "Breadcrumb";
