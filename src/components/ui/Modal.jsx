import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';

const BodyScrollLock = () => {
  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);
  return null;
};

const Modal = ({ open, onClose, children, className, maxWidth = 'max-w-lg' }) => {
  // Listen for Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <BodyScrollLock />
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative z-50 w-full rounded-xl border border-border-default bg-surface shadow-2xl overflow-hidden',
              maxWidth,
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

const ModalHeader = ({ className, title, description, onClose, children }) => (
  <div className={cn('flex items-start justify-between border-b border-border-default p-5', className)}>
    <div className="space-y-1 pr-4">
      {title && <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>}
      {description && <p className="text-xs text-foreground-muted">{description}</p>}
      {children}
    </div>
    {onClose && (
      <button
        onClick={onClose}
        className="rounded-md p-1.5 text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
        aria-label="Close modal"
      >
        <HiX className="h-4 w-4" />
      </button>
    )}
  </div>
);

const ModalContent = ({ className, children }) => (
  <div className={cn('p-5 space-y-4 max-h-[75vh] overflow-y-auto', className)}>
    {children}
  </div>
);

const ModalFooter = ({ className, children }) => (
  <div className={cn('border-t border-border-default bg-surface-subtle/40 p-4 px-5 flex items-center justify-end gap-2.5', className)}>
    {children}
  </div>
);

export { Modal, ModalHeader, ModalContent, ModalFooter };
