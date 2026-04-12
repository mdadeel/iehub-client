import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import {
    HiMenu, HiX, HiMoon, HiSun, HiLogout,
    HiChevronDown, HiUser,
    HiViewGrid, HiClipboardList,
    HiTruck, HiSparkles, HiChatAlt2,
    HiDocumentReport, HiUserGroup
} from 'react-icons/hi';

const Navbar = () => {
    const { user, logout, theme, toggleTheme } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const dropdownRef = useRef(null);

    const marketplaceLinks = [
        { title: 'Categories', path: '/categories', icon: <HiViewGrid />, desc: 'Find products by sector.' },
        { title: 'Recent Trades', path: '/trades', icon: <HiClipboardList />, desc: 'Real-time market activity.' },
        { title: 'Shipping', path: '/shipping', icon: <HiTruck />, desc: 'Delivery and logistics.' },
    ];

    const resourceLinks = [
        { title: 'Our Story', path: '/about', icon: <HiSparkles />, desc: 'Learn about us.' },
        { title: 'Our Team', path: '/careers', icon: <HiUserGroup />, desc: 'Meet our trade experts.' },
        { title: 'Market News', path: '/news', icon: <HiDocumentReport />, desc: 'Market analysis.' },
        { title: 'Support', path: '/contact', icon: <HiChatAlt2 />, desc: '24/7 help center.' },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-[50] transition-all duration-300",
            scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
        )}>
            <nav className="container flex items-center justify-between h-16 md:h-20">
                {/* Left: Brand */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-figma-blue rounded-lg flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(13,153,255,0.3)] group-hover:rotate-6 transition-transform">
                            <img src="/logo.png" alt="IEHUB" className="w-full h-full object-contain brightness-0 invert" />
                        </div>
                        <span className="font-black text-xl tracking-tighter">
                            IE<span className="text-figma-blue">HUB</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        <NavLink to="/" className={({ isActive }) => cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}>Home</NavLink>
                        
                        <NavLink to="/products" className={({ isActive }) => cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}>Marketplace</NavLink>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setActiveMenu(activeMenu === 'resources' ? null : 'resources')}
                                className={cn(
                                    "flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                                    activeMenu === 'resources' ? "bg-muted text-primary" : "text-muted-foreground"
                                )}
                            >
                                Resources <HiChevronDown className={cn("w-4 h-4 transition-transform", activeMenu === 'resources' && "rotate-180")} />
                            </button>
                            
                            <AnimatePresence>
                                {activeMenu === 'resources' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full mt-2 w-64 bg-card border rounded-xl shadow-xl p-2 grid gap-1"
                                    >
                                        {[...marketplaceLinks, ...resourceLinks].map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={() => setActiveMenu(null)}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    {link.icon}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold leading-tight">{link.title}</div>
                                                    <div className="text-[10px] text-muted-foreground">{link.desc}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full"
                    >
                        {theme === 'light' ? <HiMoon className="w-5 h-5" /> : <HiSun className="w-5 h-5" />}
                    </Button>

                    <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setActiveMenu(activeMenu === 'profile' ? null : 'profile')}
                                className="flex items-center gap-2 p-1 pl-3 border rounded-full hover:bg-muted transition-colors"
                            >
                                <span className="text-xs font-bold hidden sm:block">{user.displayName?.split(' ')[0]}</span>
                                <div className="w-8 h-8 rounded-full overflow-hidden border bg-muted flex items-center justify-center">
                                    {user.photoURL ? <img src={user.photoURL} alt="" /> : <HiUser className="w-5 h-5" />}
                                </div>
                            </button>
                            
                            <AnimatePresence>
                                {activeMenu === 'profile' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-56 bg-card border rounded-xl shadow-xl p-2"
                                    >
                                        <div className="px-3 py-2 border-b mb-1">
                                            <div className="text-sm font-bold truncate">{user.displayName}</div>
                                            <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                                        </div>
                                        <Link to="/dashboard" onClick={() => setActiveMenu(null)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm transition-colors">
                                            Dashboard
                                        </Link>
                                        <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive text-sm w-full text-left transition-colors">
                                            <HiLogout className="w-4 h-4" /> Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                <Link to="/login">Sign in</Link>
                            </Button>
                            <Button asChild className="bg-figma-blue hover:bg-figma-blue/90 shadow-[0_4px_14px_rgba(13,153,255,0.4)]">
                                <Link to="/register">Join Network</Link>
                            </Button>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-background border-b overflow-hidden"
                    >
                        <div className="container py-6 grid gap-4">
                            <Link to="/" onClick={() => setMobileOpen(false)} className="text-2xl font-bold">Home</Link>
                            <Link to="/products" onClick={() => setMobileOpen(false)} className="text-2xl font-bold">Marketplace</Link>
                            <div className="grid gap-2 pt-4 border-t">
                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Resources</div>
                                {[...marketplaceLinks, ...resourceLinks].map(link => (
                                    <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-2">
                                        <div className="text-primary">{link.icon}</div>
                                        <div className="font-medium">{link.title}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
