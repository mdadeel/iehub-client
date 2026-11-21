import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useOrgs } from '../context/OrgsContext';
import { canManageListings, canManageOrgSettings } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { CommandPalette } from './ui/CommandPalette';
import OrganizationSwitcher from './OrganizationSwitcher';
import Logo from './Logo';
import {
    HiMenu, HiX, HiMoon, HiSun, HiLogout,
    HiChevronDown, HiUser, HiSearch,
    HiViewGrid, HiGlobeAlt, HiArrowUp, HiArrowDown,
    HiShoppingBag, HiTruck, HiDocumentText, HiShieldCheck, HiSupport,
    HiOutlineShoppingBag, HiOutlineTruck, HiOutlineDocumentText, HiOutlineShieldCheck, HiOutlineSupport
} from 'react-icons/hi';

const NAV_ITEMS = [
    { to: '/products', label: 'Source', icon: HiOutlineShoppingBag, activeIcon: HiShoppingBag },
    { to: '/shipping', label: 'Shipments', icon: HiOutlineTruck, activeIcon: HiTruck },
    { to: '/trades', label: 'Trades', icon: HiOutlineDocumentText, activeIcon: HiDocumentText },
    { to: '/about', label: 'Why us', icon: HiOutlineShieldCheck, activeIcon: HiShieldCheck },
    { to: '/contact', label: 'Trade desk', icon: HiOutlineSupport, activeIcon: HiSupport },
];

const Navbar = () => {
    const { user, logout, theme, toggleTheme } = useAuth();
    const { activeOrg } = useOrgs();
    const showSellerLinks = canManageListings(user, activeOrg);
    const showOrgSettings = canManageOrgSettings(user, activeOrg);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    // Home page carries its own photographic hero — let the nav sit over it until scroll.
    const overHero = location.pathname === '/' && !scrolled && !mobileOpen;

    // Global Cmd+K / Ctrl+K keyboard shortcut listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandOpen((prev) => !prev);
                return;
            }
            // "/" opens the palette, unless the user is typing in a field
            const el = e.target;
            const typing = el instanceof HTMLElement && (
                el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable
            );
            if (e.key === '/' && !typing) {
                e.preventDefault();
                setCommandOpen(true);
            }
            if (e.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        // Throttle with requestAnimationFrame — scroll fires every frame on trackpads.
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                setScrolled(window.scrollY > 10);
                ticking = false;
            });
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
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
                "fixed top-0 left-0 right-0 z-40 h-16 transition-all duration-300 border-b no-scrollbar",
                overHero && "bg-transparent border-white/10",
                !overHero && scrolled && "bg-surface/92 backdrop-blur-md border-border-default shadow-[0_1px_0_0_rgba(16,20,23,0.04)]",
                !overHero && !scrolled && "bg-surface border-border-subtle"
            )}>
                <nav className="container flex items-center justify-between h-full no-scrollbar">
                    {/* Left: Brand, Search Bar & Animated Nav Links */}
                    <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                        {/* Institutional Brand Logo & Trade Mark */}
                        <Logo overHero={overHero} size="md" />

                        {/* Search Bar on the Left — ghost pill, no border */}
                        <div className="hidden xl:flex items-center">
                            <button
                                type="button"
                                onClick={() => setCommandOpen(true)}
                                className={cn(
                                    "flex items-center gap-2 w-44 xl:w-56 h-9 px-3 text-[12px] rounded-md transition-colors",
                                    overHero
                                        ? "text-white/70 bg-white/10 hover:bg-white/15 hover:text-white/90"
                                        : "text-foreground-muted bg-surface-subtle/70 hover:bg-surface-subtle hover:text-foreground-secondary"
                                )}
                            >
                                <HiSearch className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                <span className="flex-1 text-left truncate">Search…</span>
                                <kbd className={cn("px-1.5 py-0.5 text-[10px] font-mono shrink-0 rounded-sm", overHero ? "bg-white/10 text-white/60" : "bg-surface text-foreground-subtle border border-border-subtle")}>
                                    ⌘K
                                </kbd>
                            </button>
                        </div>

                        {/* Desktop nav links */}
                        <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-xs">
                            {NAV_ITEMS.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => cn(
                                        "relative flex shrink-0 items-center whitespace-nowrap px-2.5 xl:px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors select-none",
                                        isActive
                                            ? overHero ? "text-white" : "text-foreground"
                                            : overHero
                                                ? "text-white/65 hover:text-white"
                                                : "text-foreground-muted hover:text-foreground"
                                    )}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className="relative z-10">{item.label}</span>
                                            <span
                                                className={cn(
                                                    "absolute bottom-0 left-3 right-3 h-[2px] transition-transform origin-left",
                                                    isActive ? "bg-accent-primary scale-x-100" : "scale-x-0 bg-transparent"
                                                )}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right: Status, Theme & User Actions */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        {user && !user.isGuest && (
                            <div className="hidden sm:flex items-center">
                                <OrganizationSwitcher compact />
                            </div>
                        )}
                        {/* Theme Toggle — ghost icon button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={cn(
                                "h-9 w-9 flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                                overHero
                                    ? "text-white/80 hover:text-white hover:bg-white/10"
                                    : "text-foreground-secondary hover:text-foreground hover:bg-surface-subtle"
                            )}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <HiMoon className="w-[18px] h-[18px]" /> : <HiSun className="w-[18px] h-[18px] text-status-warning" />}
                        </button>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className={cn(
                                        "flex items-center gap-2 pl-1 pr-1.5 sm:pr-2 py-1 rounded-md text-xs transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                                        overHero
                                            ? "text-white hover:bg-white/10"
                                            : "text-foreground hover:bg-surface-subtle"
                                    )}
                                    aria-label="User account menu"
                                    aria-expanded={profileOpen}
                                >
                                    <div className="w-7 h-7 rounded-full bg-accent-subtle text-accent-primary border border-accent-primary/20 flex items-center justify-center font-bold text-[11px] shrink-0 overflow-hidden">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user.displayName?.charAt(0) || "U"
                                        )}
                                    </div>
                                    <span className={cn("hidden md:inline font-semibold max-w-[90px] truncate text-left", overHero ? "text-white" : "text-foreground")}>
                                        {user.displayName?.split(' ')[0] || 'Account'}
                                    </span>
                                    <HiChevronDown className={cn("hidden sm:inline-block w-3.5 h-3.5 transition-transform shrink-0", overHero ? "text-white/60 group-hover:text-white" : "text-foreground-muted group-hover:text-foreground", profileOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 4, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 2, scale: 0.96 }}
                                            transition={{ duration: 0.12 }}
                                            style={{ transformOrigin: 'top right' }}
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

                                            {showSellerLinks && (
                                                <Link
                                                    to="/dashboard/my-exports"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-surface-hover text-foreground-secondary hover:text-foreground transition-colors"
                                                >
                                                    <HiArrowUp className="w-4 h-4 text-foreground-muted" />
                                                    My Inventory
                                                </Link>
                                            )}

                                            <Link
                                                to="/dashboard/my-imports"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-surface-hover text-foreground-secondary hover:text-foreground transition-colors"
                                            >
                                                <HiArrowDown className="w-4 h-4 text-foreground-muted" />
                                                Import Orders
                                            </Link>

                                            {showOrgSettings && (
                                                <Link
                                                    to="/dashboard/profile"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-surface-hover text-foreground-secondary hover:text-foreground transition-colors"
                                                >
                                                    <HiUser className="w-4 h-4 text-foreground-muted" />
                                                    Corporate Settings
                                                </Link>
                                            )}

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
                            <div className="flex items-center gap-1 sm:gap-1.5">
                                <Link
                                    to="/login"
                                    className={cn(
                                        "hidden sm:inline-flex items-center h-9 px-3 rounded-md text-[13px] font-medium transition-colors",
                                        overHero
                                            ? "text-white/80 hover:text-white hover:bg-white/10"
                                            : "text-foreground-secondary hover:text-foreground hover:bg-surface-subtle"
                                    )}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap h-9 bg-accent-primary rounded-md px-4 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover shadow-xs"
                                >
                                    Request quote
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button — ghost */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("lg:hidden h-9 w-9", overHero && "text-white hover:bg-white/10 hover:text-white")}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-nav-menu"
                        >
                            {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
                        </Button>
                    </div>
                </nav>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            id="mobile-nav-menu"
                            role="region"
                            aria-label="Mobile Navigation"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:hidden bg-surface border-b border-border-default overflow-hidden"
                        >
                            <div className="px-4 pt-3 pb-5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileOpen(false);
                                        setCommandOpen(true);
                                    }}
                                    className="flex items-center gap-2.5 w-full h-10 px-3 text-[13px] text-foreground-muted bg-surface-subtle rounded-md"
                                >
                                    <HiSearch className="w-4 h-4" />
                                    <span>Search commodities, suppliers, or orders…</span>
                                </button>

                                <nav className="grid gap-0.5 pt-3" aria-label="Primary">
                                    {NAV_ITEMS.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                onClick={() => setMobileOpen(false)}
                                                className={({ isActive }) => cn(
                                                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] transition-colors select-none",
                                                    isActive
                                                        ? "bg-accent-subtle text-accent-primary font-semibold"
                                                        : "text-foreground-secondary font-medium hover:bg-surface-subtle hover:text-foreground"
                                                )}
                                            >
                                                <Icon className="w-[18px] h-[18px] shrink-0 opacity-80" aria-hidden="true" />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        );
                                    })}
                                    {user && (
                                        <NavLink
                                            to="/dashboard"
                                            onClick={() => setMobileOpen(false)}
                                            className={({ isActive }) => cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] transition-colors select-none",
                                                isActive
                                                    ? "bg-accent-subtle text-accent-primary font-semibold"
                                                    : "text-foreground-secondary font-medium hover:bg-surface-subtle hover:text-foreground"
                                            )}
                                        >
                                            <HiViewGrid className="w-[18px] h-[18px] shrink-0 opacity-80" aria-hidden="true" />
                                            <span>Workspace</span>
                                        </NavLink>
                                    )}
                                </nav>

                                {/* Drawer footer — identity / auth */}
                                <div className="mt-4 pt-4 border-t border-border-subtle">
                                    {user ? (
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-accent-subtle text-accent-primary border border-accent-primary/20 flex items-center justify-center font-bold text-[11px] shrink-0 overflow-hidden">
                                                    {user.photoURL ? (
                                                        <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        user.displayName?.charAt(0) || "U"
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate text-[13px] font-semibold text-foreground">{user.displayName || 'Account'}</div>
                                                    <div className="truncate text-[11px] text-foreground-muted">{user.isGuest ? 'Demo sandbox' : user.email}</div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMobileOpen(false);
                                                    logout();
                                                }}
                                                className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-[12px] font-semibold text-foreground-secondary transition-colors hover:bg-status-danger-bg hover:text-status-danger"
                                            >
                                                <HiLogout className="w-4 h-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                to="/login"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex h-10 items-center justify-center rounded-md border border-border-default text-[13px] font-semibold text-foreground transition-colors hover:bg-surface-subtle"
                                            >
                                                Sign in
                                            </Link>
                                            <Link
                                                to="/register"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex h-10 items-center justify-center rounded-md bg-accent-primary text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover"
                                            >
                                                Request quote
                                            </Link>
                                        </div>
                                    )}
                                </div>
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
