import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useOrgs } from '../context/OrgsContext';
import { canManageListings, canManageOrgSettings } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { CommandPalette } from './ui/CommandPalette';
import OrganizationSwitcher from './OrganizationSwitcher';
import {
    HiMenu, HiX, HiMoon, HiSun, HiLogout,
    HiChevronDown, HiChevronRight, HiUser, HiSearch,
    HiViewGrid, HiGlobeAlt, HiArrowUp, HiArrowDown,
    HiShoppingBag, HiTruck, HiDocumentText, HiShieldCheck, HiSupport,
    HiOutlineShoppingBag, HiOutlineTruck, HiOutlineDocumentText, HiOutlineShieldCheck, HiOutlineSupport
} from 'react-icons/hi';

const NAV_ITEMS = [
    { to: '/products', label: 'Source Products', icon: HiOutlineShoppingBag, activeIcon: HiShoppingBag },
    { to: '/shipping', label: 'Track Shipments', icon: HiOutlineTruck, activeIcon: HiTruck },
    { to: '/trades', label: 'Recent Trades', icon: HiOutlineDocumentText, activeIcon: HiDocumentText },
    { to: '/about', label: 'Why IEHUB', icon: HiOutlineShieldCheck, activeIcon: HiShieldCheck },
    { to: '/contact', label: 'Trade Desk', icon: HiOutlineSupport, activeIcon: HiSupport },
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
                    {/* Left: Brand, Search Bar & Animated Nav Links */}
                    <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                        {/* Logo mark only (no text) */}
                        <Link to="/" className="flex items-center group select-none shrink-0" aria-label="IEHUB Home">
                            <div className="w-7 h-7 bg-accent-primary rounded-md flex items-center justify-center p-1 text-accent-contrast shadow-xs group-hover:bg-accent-hover transition-colors">
                                <span className="font-mono font-bold text-xs tracking-tighter">IE</span>
                            </div>
                        </Link>

                        {/* Search Bar on the Left */}
                        <div className="hidden lg:flex items-center">
                            <button
                                type="button"
                                onClick={() => setCommandOpen(true)}
                                className="flex items-center gap-2 w-48 xl:w-60 px-2.5 py-1.5 text-xs text-foreground-muted bg-surface-subtle border border-border-default rounded-md hover:border-border-hover transition-colors"
                            >
                                <HiSearch className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
                                <span className="flex-1 text-left truncate">Search…</span>
                                <kbd className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-mono text-foreground-muted border border-border-default shrink-0">
                                    ⌘K
                                </kbd>
                            </button>
                        </div>

                        {/* Desktop Nav Links with Icons & Active Indicator */}
                        <div className="hidden md:flex items-center gap-1 text-xs overflow-x-auto no-scrollbar">
                            {NAV_ITEMS.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => cn(
                                        "relative flex items-center gap-2 px-2.5 lg:px-3 py-1.5 rounded-md font-medium transition-colors select-none",
                                        isActive
                                            ? "text-foreground font-semibold"
                                            : "text-foreground-secondary hover:text-foreground hover:bg-surface-hover/40"
                                    )}
                                >
                                    {({ isActive }) => {
                                        const Icon = isActive ? item.activeIcon : item.icon;
                                        return (
                                            <>
                                                <Icon className={cn("relative z-10 w-4 h-4 shrink-0 transition-colors", isActive ? "text-accent-primary" : "text-foreground-muted")} aria-hidden="true" />
                                                <span className="relative z-10">{item.label}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="navbar-active-pill"
                                                        className="absolute inset-0 bg-surface-subtle border border-border-default/70 rounded-md z-0 shadow-2xs"
                                                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                                    />
                                                )}
                                            </>
                                        );
                                    }}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right: Status, Theme & User Actions */}
                    <div className="flex items-center gap-2">
                        {user && !user.isGuest && (
                            <div className="hidden sm:flex items-center">
                                <OrganizationSwitcher compact />
                            </div>
                        )}
                        {/* Theme Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="h-8 w-8 rounded-lg border border-border-default/80 bg-surface hover:bg-surface-hover text-foreground-secondary hover:text-foreground flex items-center justify-center transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <HiMoon className="w-4 h-4" /> : <HiSun className="w-4 h-4 text-status-warning" />}
                        </button>

                        <div className="h-4 w-px bg-border-default mx-0.5 hidden sm:block" />

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border-default/80 bg-surface hover:bg-surface-hover text-xs transition-all shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                                    aria-label="User account menu"
                                    aria-expanded={profileOpen}
                                >
                                    <div className="w-6 h-6 rounded-full bg-accent-subtle text-accent-primary border border-accent-primary/25 flex items-center justify-center font-bold text-[11px] shrink-0">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user.displayName?.charAt(0) || "U"
                                        )}
                                    </div>
                                    <span className="hidden sm:inline font-semibold text-foreground max-w-[90px] truncate text-left">
                                        {user.displayName?.split(' ')[0] || 'Account'}
                                    </span>
                                    <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-status-success shrink-0" title="Active Trader" />
                                    <HiChevronDown className={cn("w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground transition-transform shrink-0", profileOpen && "rotate-180")} />
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
                            className="md:hidden bg-surface border-b border-border-default overflow-hidden"
                        >
                            <div className="px-4 py-4 space-y-3">
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
                                    {NAV_ITEMS.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                onClick={() => setMobileOpen(false)}
                                                className={({ isActive }) => cn(
                                                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors select-none",
                                                    isActive
                                                        ? "bg-accent-subtle text-accent-primary font-semibold border border-accent-primary/20"
                                                        : "text-foreground hover:bg-surface-subtle"
                                                )}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Icon className="w-4 h-4 shrink-0 opacity-80" aria-hidden="true" />
                                                    <span>{item.label}</span>
                                                </div>
                                                <HiChevronRight className="w-4 h-4 text-foreground-muted opacity-60" aria-hidden="true" />
                                            </NavLink>
                                        );
                                    })}
                                    {user && (
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-accent-primary bg-accent-subtle/50 hover:bg-accent-subtle border border-accent-primary/15 mt-1 transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <HiViewGrid className="w-4 h-4" aria-hidden="true" />
                                                <span>Go to Workspace</span>
                                            </div>
                                            <HiChevronRight className="w-4 h-4" aria-hidden="true" />
                                        </Link>
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
