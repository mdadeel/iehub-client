import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiDotsVertical } from 'react-icons/hi';
import { cn } from '@/lib/utils';

/**
 * Minimal 3-dot action menu (popover). No dependency — outside click + Escape,
 * same pattern as CommandPalette. Render <DropdownMenu items={[...]}/> where each
 * item is { label, icon: Icon, onSelect, danger?: boolean, disabled?: boolean }.
 */
const DropdownMenu = ({ items, label = 'More actions', className }) => {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const ref = React.useRef(null);
  const menuItemsRef = React.useRef([]);

  React.useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
      return;
    }
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        const item = items[activeIndex];
        if (item && !item.disabled) {
          setOpen(false);
          item.onSelect?.();
        }
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, activeIndex, items]);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex h-8 w-8 min-h-[32px] min-w-[32px] items-center justify-center rounded-md text-foreground-secondary hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-all duration-75"
      >
        <HiDotsVertical className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 z-30 mt-1 min-w-[170px] overflow-hidden rounded-md border border-border-default bg-surface py-1 shadow-lg"
          >
            {items.map((item, idx) => {
              const Icon = item.icon;
              const isFocused = activeIndex === idx;
              return (
                <button
                  key={item.label}
                  ref={(el) => (menuItemsRef.current[idx] = el)}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    item.onSelect?.();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors duration-75 disabled:pointer-events-none disabled:opacity-50',
                    isFocused && 'bg-surface-hover',
                    item.danger
                      ? 'text-status-danger hover:bg-status-danger/10'
                      : 'text-foreground-secondary hover:bg-surface-hover hover:text-foreground'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { DropdownMenu };
