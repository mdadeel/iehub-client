import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { CommandPalette } from './ui/CommandPalette';
import {
    HiMenu, HiX, HiMoon, HiSun, HiLogout,
    HiChevronDown, HiUser, HiSearch,
    HiViewGrid, HiGlobeAlt, HiArrowUp, HiArrowDown
} from 'react-icons/hi';

const Navbar = () => {
    const { user, logout, theme, toggleTheme } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Global Cmd+K / Ctrl+K keyboard shortcut listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <header className={cn(
                "fixed top-0 left-0 right-0 z-40 h-14 transition-colors duration-150 border-b no-scrollbar",
                scrolled
                    ? "bg-surface/85 backdrop-blur-md border-border-default shadow-2xs"
                    : "bg-surface border-border-subtle"
            )}>
                <nav className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8 no-scrollbar">
                    {/* Left: Brand & Animated Nav Links */}
                    <div className="flex items-center gap-4 lg:gap-6 min-w-0">
                        <Link to="/" className="flex items-center gap-2 group select-none shrink-0">
                            <div className="w-7 h-7 bg-accent-primary rounded-md flex items-center justify-center p-1 text-accent-contrast shadow-xs">
                                <span className="font-mono font-bold text-xs tracking-tighter">IE</span>
                            </div>
                            <span className="font-semibold text-sm tracking-tight text-foreground">
                                IE<span className="text-foreground-muted font-normal">HUB</span>
                            </span>
                        </Link>

                        {/* Desktop Nav Links with Animated Active Indicator — task-based */}
                        <div className="hidden md:flex items-center gap-1 text-xs overflow-x-auto no-scrollbar">
                            {[
                                { to: '/products', label: 'Source Products' },
                                { to: '/shipping', label: 'Track Shipments' },
                                { to: '/trades', label: 'Recent Trades' },
                                { to: '/about', label: 'Why IEHUB' },
                                { to: '/contact', label: 'Trade Desk' },
                            ].map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => cn(
                                        "relative px-2.5 lg:px-3 py-1.5 rounded-md font-medium transition-colors select-none",
                                        isActive
                                            ? "text-foreground font-semibold"
                                            : "text-foreground-secondary hover:text-foreground hover:bg-surface-hover/40"
                                    )}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className="relative z-10">{item.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-active-pill"
                                                    className="absolute inset-0 bg-surface-subtle border border-border-default/70 rounded-md z-0 shadow-2xs"
                                                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Center: Command Palette Trigger Button */}
                    <div className="hidden lg:flex items-center">
                        <button
                            type="button"
                            onClick={() => setCommandOpen(true)}
                            className="flex items-center gap-2 w-56 xl:w-72 px-3 py-1.5 text-xs text-foreground-muted bg-surface-subtle border border-border-default rounded-md hover:border-border-hover transition-colors"
                        >
                            <HiSearch className="w-3.5 h-3.5 text-foreground-muted" />
                            <span className="flex-1 text-left truncate">Search commodities, suppliers, or orders…</span>
                            <kbd className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-mono text-foreground-muted border border-border-default">
                                ⌘K
                            </kbd>
                        </button>
                    </div>

                    {/* Right: Status, Theme & User Actions */}
                    <div className="flex items-center gap-2.5">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-8 w-8 text-foreground-secondary hover:text-foreground"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <HiMoon className="w-4 h-4" /> : <HiSun className="w-4 h-4 text-status-warning" />}
                        </Button>

                        <div className="h-4 w-px bg-border-default mx-0.5 hidden sm:block" />

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 p-1 rounded-md hover:bg-surface-hover text-xs transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-accent-subtle text-accent-primary border border-accent-primary/20 flex items-center justify-center font-semibold text-xs">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user.displayName?.charAt(0) || "T"
                                        )}
                                    </div>
                                    <span className="hidden sm:inline font-medium text-foreground max-w-[100px] truncate">
                                        {user.displayName?.split(' ')[0]}
                                    </span>
                                    <HiChevronDown className={cn("w-3.5 h-3.5 text-foreground-muted transition-transform", profileOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 2, scale: 0.98 }}
                                            transition={{ duration: 0.12 }}
                                            className="absolute right-0 top-full mt-1.5 w-56 bg-surface border border-border-default rounded-lg shadow-xl p-1.5 z-50 text-xs"
                                        >
                                            <div className="px-2.5 py-2 border-b border-border-subtle mb-1">
                                                <div className="font-semibold text-foreground truncate">{user.displayName}</div>
                                                <div className="text-[11px] text-foreground-muted truncate">{user.email}</div>
                                                <div className="mt-1.5">
                                                    <Badge variant={user.isGuest ? "warning" : "success"} size="sm" hasDot>
                                                        {user.isGuest ? "Demo Sandbox" : "Verified Trader"}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <Link
                                                to="/dashboard"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-surface-hover text-foreground-secondary hover:text-foreground transition-colors"
                                            >
                                                <HiViewGrid className="w-4 h-4 text-foreground-muted" />
                                                Dashboard Overview
                                            </Link>

                                            <Link
                                                to="/dashboard/my-exports"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-surface-hover text-foreground-secondary hover:text-foreground transition-colors"
                                            >
                                                <HiArrowUp className="w-4 h-4 text-foreground-muted" />
                                                My Inventory
                                            </Link>

                                            <Link
                                                to="/dashboard/my-imports"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-surface-hover text-foreground-secondary hover:text-foreground transition-colors"
                                            >
                                                <HiArrowDown className="w-4 h-4 text-foreground-muted" />
                                                Import Orders
                                            </Link>

                                            <Link
                                                to="/dashboard/profile"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-surface-hover text-foreground-secondary hover:text-foreground transition-colors"
                                            >
                                                <HiUser className="w-4 h-4 text-foreground-muted" />
                                                Corporate Settings
                                            </Link>

                                            <div className="border-t border-border-subtle my-1" />

                                            <button
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    logout();
                                                }}
                                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-status-danger-bg text-status-danger w-full text-left transition-colors"
                                            >
                                                <HiLogout className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/login">Sign in</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link to="/register">Start Sourcing</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden h-8 w-8"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle navigation"
                        >
                            {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
                        </Button>
                    </div>
                </nav>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className="md:hidden bg-surface border-b border-border-default overflow-hidden px-4 py-4 space-y-3"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileOpen(false);
                                    setCommandOpen(true);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground-muted bg-surface-subtle border border-border-default rounded-md"
                            >
                                <HiSearch className="w-4 h-4" />
                                <span>Search commodities, suppliers, or orders…</span>
                            </button>

                            <div className="grid gap-1 pt-2">
                                <Link
                                    to="/products"
                                    onClick={() => setMobileOpen(false)}
                                    className="px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-surface-subtle"
                                >
                                    Source Products
                                </Link>
                                <Link
                                    to="/shipping"
                                    onClick={() => setMobileOpen(false)}
                                    className="px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-surface-subtle"
                                >
                                    Track Shipments
                                </Link>
                                <Link
                                    to="/trades"
                                    onClick={() => setMobileOpen(false)}
                                    className="px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-surface-subtle"
                                >
                                    Recent Trades
                                </Link>
                                <Link
                                    to="/about"
                                    onClick={() => setMobileOpen(false)}
                                    className="px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-surface-subtle"
                                >
                                    Why IEHUB
                                </Link>
                                <Link
                                    to="/contact"
                                    onClick={() => setMobileOpen(false)}
                                    className="px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-surface-subtle"
                                >
                                    Trade Desk
                                </Link>
                                {user && (
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setMobileOpen(false)}
                                        className="px-3 py-2 rounded-md text-xs font-medium text-accent-primary hover:bg-accent-subtle"
                                    >
                                        Go to Workspace
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Global Command Palette */}
            <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
        </>
    );
};

export default Navbar;
