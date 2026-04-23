import React, { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import "./ProgressSpinner.css";

export type ProgressSpinnerSize = "sm" | "md" | "lg";
export type ProgressSpinnerTone = "forest" | "earth" | "sky";

export const ProgressSpinner: React.FC<
  Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
    size?: ProgressSpinnerSize;
    tone?: ProgressSpinnerTone;
    label?: string;
    showLabel?: boolean;
  }
> = ({
  size = "md",
  tone = "forest",
  label = "Scanning the trail…",
  showLabel = false,
  className,
  ...rest
}) => {
  return (
    <span
      className={cn(
        "progress-spinner",
        `progress-spinner--${size}`,
        `progress-spinner--${tone}`,
        className,
      )}
      role="status"
      aria-label={label}
      {...rest}
    >
      <span className="progress-spinner__visual" aria-hidden="true">
        <span className="progress-spinner__ring" />
        <span className="progress-spinner__ring progress-spinner__ring--inner" />
        <span className="progress-spinner__orbit progress-spinner__orbit--outer">
          <span className="progress-spinner__marker progress-spinner__marker--lead" />
        </span>
        <span className="progress-spinner__orbit progress-spinner__orbit--inner">
          <span className="progress-spinner__marker progress-spinner__marker--tail" />
        </span>
        <span className="progress-spinner__core" />
      </span>
      <span
        className={cn(
          "progress-spinner__label",
          !showLabel && "progress-spinner__label--sr-only",
        )}
      >
        {label}
      </span>
    </span>
  );
};

ProgressSpinner.displayName = "ProgressSpinner";
