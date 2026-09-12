import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiSearch,
  HiPlus,
  HiGlobeAlt,
  HiMoon,
  HiSun,
  HiViewGrid,
  HiArrowDown,
  HiArrowUp,
  HiUser,
  HiShieldCheck,
  HiX,
} from "react-icons/hi";
import { useAuth } from "@/hooks/useAuth";

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

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, theme, setTheme } = useAuth();
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef(null);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const actions = React.useMemo(() => {
    const list = [
      {
        id: "nav-overview",
        title: "Go to Trade Overview",
        subtitle: "Main metrics, trade pipeline & performance",
        category: "Navigation",
        icon: HiViewGrid,
        shortcut: "G D",
        run: () => navigate("/dashboard"),
      },
      {
        id: "nav-market",
        title: "Explore Marketplace",
        subtitle: "Browse verified B2B commodities & products",
        category: "Navigation",
        icon: HiGlobeAlt,
        shortcut: "G M",
        run: () => navigate("/products"),
      },
      {
        id: "nav-imports",
        title: "My Import Orders",
        subtitle: "Track active shipments, POs & deliveries",
        category: "Navigation",
        icon: HiArrowDown,
        shortcut: "G I",
        run: () => navigate("/imports"),
      },
      {
        id: "nav-exports",
        title: "My Export Listings",
        subtitle: "Manage inventory, pricing & active offers",
        category: "Navigation",
        icon: HiArrowUp,
        shortcut: "G E",
        run: () => navigate("/exports"),
      },
      {
        id: "act-new-export",
        title: "List New Commodity for Export",
        subtitle: "Publish a new wholesale or bulk listing",
        category: "Actions",
        icon: HiPlus,
        shortcut: "N E",
        run: () => navigate("/exports/new"),
      },
      {
        id: "act-profile",
        title: "Account & Profile Settings",
        subtitle: "Manage company verification & team credentials",
        category: "Account",
        icon: HiUser,
        shortcut: "G P",
        run: () => navigate("/profile"),
      },
      {
        id: "act-theme",
        title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
        subtitle: "Toggle between obsidian dark and clean light theme",
        category: "Actions",
        icon: theme === "dark" ? HiSun : HiMoon,
        shortcut: "T",
        run: () => {
          if (typeof setTheme === "function") {
            setTheme(theme === "dark" ? "light" : "dark");
          } else {
            const isDark = document.documentElement.classList.contains("dark");
            if (isDark) {
              document.documentElement.classList.remove("dark");
              localStorage.setItem("theme", "light");
            } else {
              document.documentElement.classList.add("dark");
              localStorage.setItem("theme", "dark");
            }
          }
        },
      },
    ];

    if (user?.role === "admin" || localStorage.getItem("isAdmin") === "true") {
      list.push({
        id: "nav-admin",
        title: "Admin Command Center",
        subtitle: "System health, user audits & compliance",
        category: "Administration",
        icon: HiShieldCheck,
        run: () => navigate("/admin/dashboard"),
      });
    }

    return list;
  }, [navigate, user, theme, setTheme]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [actions, query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        filtered[activeIndex].run();
        onClose();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          <BodyScrollLock />
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-50 w-full max-w-xl overflow-hidden rounded-xl border border-border-default bg-surface shadow-2xl"
          >
            {/* Search Input Bar */}
            <div className="flex items-center border-b border-border-default px-4">
              <HiSearch className="h-4 w-4 text-foreground-muted shrink-0 mr-3" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search commands, navigate or type an action..."
                className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-foreground-muted outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="rounded-md p-1 text-foreground-muted hover:text-foreground"
                >
                  <HiX className="h-3.5 w-3.5" />
                </button>
              )}
              <kbd className="ml-2 hidden sm:inline-flex items-center gap-1 rounded bg-surface-subtle px-1.5 py-0.5 text-[10px] font-mono text-foreground-muted border border-border-default">
                ESC
              </kbd>
            </div>

            {/* List Results */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-foreground-muted">
                  No matching commands or routes found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        item.run();
                        onClose();
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-surface-hover text-foreground"
                          : "text-foreground-secondary hover:bg-surface-hover/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                            isSelected
                              ? "border-accent-primary/30 bg-accent-subtle text-accent-primary"
                              : "border-border-default bg-surface-subtle text-foreground-muted"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="font-medium text-foreground truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-foreground-muted truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      {item.shortcut && (
                        <kbd className="shrink-0 rounded bg-surface-subtle px-1.5 py-0.5 text-[10px] font-mono text-foreground-muted border border-border-default ml-2">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="flex items-center justify-between border-t border-border-subtle bg-surface-subtle/50 px-4 py-2 text-[11px] text-foreground-muted">
              <div className="flex items-center gap-2">
                <span>Navigate</span>
                <kbd className="rounded bg-surface px-1 text-[10px] font-mono border border-border-default">↑</kbd>
                <kbd className="rounded bg-surface px-1 text-[10px] font-mono border border-border-default">↓</kbd>
                <span>Select</span>
                <kbd className="rounded bg-surface px-1 text-[10px] font-mono border border-border-default">↵</kbd>
              </div>
              <span className="text-[10px]">IEHUB Command Runner</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { CommandPalette };
