import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]",
  {
    variants: {
      variant: {
        default: "bg-accent-primary text-accent-contrast shadow-xs hover:bg-accent-hover",
        primary: "bg-accent-primary text-accent-contrast shadow-xs hover:bg-accent-hover",
        destructive: "bg-status-danger text-accent-contrast shadow-xs hover:opacity-90",
        outline: "border border-border-default bg-surface text-foreground hover:bg-surface-hover hover:border-border-hover shadow-2xs",
        secondary: "bg-surface-subtle text-foreground border border-border-default hover:bg-surface-hover shadow-2xs",
        ghost: "text-foreground-secondary hover:bg-surface-hover hover:text-foreground",
        link: "text-accent-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-[11px]",
        lg: "h-10 rounded-md px-6 text-sm",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
