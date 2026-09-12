import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 min-h-[38px] w-full rounded-md border border-border-default bg-surface px-3 py-1.5 text-sm sm:text-xs text-foreground shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-foreground-muted focus-visible:outline-none focus-visible:border-accent-primary focus-visible:ring-2 focus-visible:ring-accent-primary/20 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-foreground-subtle disabled:opacity-75",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
