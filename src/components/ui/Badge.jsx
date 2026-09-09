import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors select-none",
  {
    variants: {
      variant: {
        neutral: "bg-surface-subtle text-foreground-secondary border border-border-default",
        accent: "bg-accent-subtle text-accent-primary border border-accent-primary/20",
        success: "bg-status-success-bg text-status-success border border-status-success/20",
        warning: "bg-status-warning-bg text-status-warning border border-status-warning/20",
        danger: "bg-status-danger-bg text-status-danger border border-status-danger/20",
        outline: "text-foreground-secondary border border-border-default bg-transparent",
      },
      size: {
        sm: "px-2 py-0.25 text-[10px]",
        default: "px-2.5 py-0.5 text-[11px]",
        lg: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  }
);

const dotColors = {
  neutral: "bg-foreground-muted",
  accent: "bg-accent-primary",
  success: "bg-status-success",
  warning: "bg-status-warning",
  danger: "bg-status-danger",
  outline: "bg-foreground-muted",
};

const Badge = React.forwardRef(({ className, variant = "neutral", size, hasDot = false, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {hasDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant] || "bg-current")}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </div>
  );
});

Badge.displayName = "Badge";

export { Badge };
