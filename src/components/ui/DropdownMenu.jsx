import * as React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { cn } from '@/lib/utils';

/**
 * Minimal 3-dot action menu (popover). No dependency — outside click + Escape,
 * same pattern as CommandPalette. Render <DropdownMenu items={[...]}/> where each
 * item is { label, icon: Icon, onSelect, danger?: boolean, disabled?: boolean }.
 */
const DropdownMenu = ({ items, label = 'More actions', className }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

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
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-secondary hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      >
        <HiDotsVertical className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-1 min-w-[160px] overflow-hidden rounded-md border border-border-default bg-surface py-1 shadow-lg"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  item.onSelect?.();
                }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors disabled:pointer-events-none disabled:opacity-50',
                  item.danger
                    ? 'text-status-danger hover:bg-status-danger/10'
                    : 'text-foreground-secondary hover:bg-surface-hover hover:text-foreground'
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { DropdownMenu };
