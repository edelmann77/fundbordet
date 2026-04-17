import React, { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./Card.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardVariant = "default" | "elevated" | "outlined" | "filled";

export interface CardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** Visual style of the card */
  variant?: CardVariant;
  /** Card title */
  title?: ReactNode;
  /** Subtitle shown beneath the title */
  subtitle?: ReactNode;
  /** URL of an image displayed at the top of the card */
  image?: string;
  /** Alt text for the card image */
  imageAlt?: string;
  /** Footer / action area content */
  footer?: ReactNode;
  /** Padding applied to the body and footer (e.g. "card__body--md"). Defaults to "card__body--md". */
  padding?: "card__body--sm" | "card__body--md" | "card__body--lg";
  children?: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Card: React.FC<CardProps> = ({
  variant = "default",
  title,
  subtitle,
  image,
  imageAlt,
  footer,
  padding,
  className,
  children,
  ...rest
}) => {
  const hasHeader = title || subtitle;
  const bodyPadding = padding ?? "card__body--md";
  const footerPaddingMap: Record<string, string> = {
    "card__body--sm": "card__footer--sm",
    "card__body--md": "card__footer--md",
    "card__body--lg": "card__footer--lg",
  };
  const footerPadding = footerPaddingMap[bodyPadding] || "card__footer--md";

  return (
    <div className={cn("card", `card--${variant}`, className)} {...rest}>
      {/* Image */}
      {image && (
        <img src={image} alt={imageAlt ?? ""} className="card__image" />
      )}

      {/* Body */}
      <div className={cn("card__body", bodyPadding)}>
        {hasHeader && (
          <div className="card__header">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
        )}
        {children && <div className="card__content">{children}</div>}
      </div>

      {/* Footer */}
      {footer && (
        <div className={cn("card__footer", footerPadding)}>{footer}</div>
      )}
    </div>
  );
};

Card.displayName = "Card";
