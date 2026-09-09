import * as React from "react";
import { cn } from "@/lib/utils";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface-subtle/30 p-8 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border-default bg-surface text-foreground-muted shadow-xs">
          <Icon className="h-6 w-6 text-foreground-secondary" />
        </div>
      )}
      <h3 className="text-base font-semibold tracking-tight text-foreground mb-1">
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-xs text-foreground-muted leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && <div className="flex items-center gap-3">{action}</div>}
      {children}
    </div>
  );
};

export { EmptyState };
