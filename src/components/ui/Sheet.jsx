import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { cn } from "@/lib/utils";

const BodyScrollLock = () => {
  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);
  return null;
};

const Sheet = ({ open, onClose, children, className }) => {
  // Listen for Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <BodyScrollLock />
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Surface */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative z-50 flex h-full w-full max-w-lg flex-col border-l border-border-default bg-surface shadow-2xl overflow-hidden",
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SheetHeader = ({ className, title, description, onClose, children }) => (
  <div className={cn("flex items-start justify-between border-b border-border-default p-6", className)}>
    <div className="space-y-1 pr-6">
      {title && <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>}
      {description && <p className="text-xs text-foreground-muted">{description}</p>}
      {children}
    </div>
    {onClose && (
      <button
        onClick={onClose}
        className="rounded-md p-1.5 text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
        aria-label="Close drawer"
      >
        <HiX className="h-4 w-4" />
      </button>
    )}
  </div>
);

const SheetContent = ({ className, children }) => (
  <div className={cn("flex-1 overflow-y-auto p-6 space-y-6", className)}>
    {children}
  </div>
);

const SheetFooter = ({ className, children }) => (
  <div className={cn("border-t border-border-default bg-surface-subtle/40 p-4 px-6 flex items-center justify-end gap-3", className)}>
    {children}
  </div>
);

export { Sheet, SheetHeader, SheetContent, SheetFooter };
