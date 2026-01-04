import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import {
    HiMenu, HiX, HiMoon, HiSun, HiLogout,
    HiViewGrid, HiChevronDown, HiUser,
    HiShieldCheck, HiShoppingBag, HiClipboardList,
    HiGlobe, HiTruck, HiSparkles, HiChatAlt2,
    HiDocumentReport, HiUserGroup
} from 'react-icons/hi';

const Navbar = () => {
    const { user, logout, theme, toggleTheme } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const dropdownRef = useRef(null);

    const marketplaceLinks = [
        { title: 'Browse Categories', path: '/categories', icon: <HiViewGrid />, desc: 'Industrial, Electronics, and more.' },
        { title: 'Latest Trades', path: '/trades', icon: <HiClipboardList />, desc: 'Real-time commodity telemetry.' },
        { title: 'Global Logistics', path: '/shipping', icon: <HiTruck />, desc: 'Our algorithmic routing engine.' },
    ];

    const resourceLinks = [
        { title: 'Our Story', path: '/about', icon: <HiSparkles />, desc: 'The heritage of ExportHub.' },
        { title: 'Trade Experts', path: '/careers', icon: <HiUserGroup />, desc: 'Connect with sector architects.' },
        { title: 'Market Insights', path: '/news', icon: <HiDocumentReport />, desc: 'Deep-dive trade analysis.' },
        { title: 'Contact Support', path: '/contact', icon: <HiChatAlt2 />, desc: '24/7 technical assistance.' },
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
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2000,
            padding: scrolled ? '1rem 0' : '1.5rem 0',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none'
        }}>
            <nav className="container" style={{ pointerEvents: 'auto' }}>
                <div style={{
                    background: theme === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(10, 10, 15, 0.7)',
                    backdropFilter: 'blur(32px)',
                    WebkitBackdropFilter: 'blur(32px)',
                    border: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '24px',
                    padding: '0.8rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: scrolled ? '0 20px 40px -10px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.4s ease'
                }}>

                    {/* Left: Brand */}
                    <div className="flex items-center gap-12">
                        <Link to="/" className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                style={{
                                    width: '42px',
                                    height: '42px',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.3)'
                                }}
                            >
                                <HiGlobe style={{ color: 'white', fontSize: '1.5rem' }} />
                            </motion.div>
                            <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-1.5px', color: theme === 'light' ? '#0f172a' : 'white' }}>
                                IE<span style={{ color: 'var(--primary)' }}>HUB</span>
                            </span>
                        </Link>

                        {/* DESKTOP NAV */}
                        <div className="desktop-visible items-center gap-2">
                            <NavLink to="/" style={({ isActive }) => ({
                                padding: '0.6rem 1.2rem',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: 800,
                                opacity: isActive ? 1 : 0.6,
                                color: isActive ? 'var(--primary)' : 'inherit'
                            })}>Home</NavLink>

                            <NavLink to="/products" style={({ isActive }) => ({
                                padding: '0.6rem 1.2rem',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: 800,
                                opacity: isActive ? 1 : 0.6,
                                color: isActive ? 'var(--primary)' : 'inherit'
                            })}>All Products</NavLink>

                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setActiveMenu(activeMenu === 'marketplace' ? null : 'marketplace')}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'inherit',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: 800,
                                        fontSize: '0.9rem',
                                        opacity: 0.6,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Marketplace <HiChevronDown style={{ fontSize: '0.8rem', transform: activeMenu === 'marketplace' ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                                </button>
                                <AnimatePresence>
                                    {activeMenu === 'marketplace' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            ref={dropdownRef}
                                            style={{
                                                position: 'absolute',
                                                top: '140%',
                                                left: 0,
                                                width: '400px',
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '24px',
                                                padding: '1.5rem',
                                                boxShadow: 'var(--shadow-lg)',
                                                display: 'grid',
                                                gridTemplateColumns: '1fr',
                                                gap: '1rem'
                                            }}
                                        >
                                            {marketplaceLinks.map((link) => (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    onClick={() => setActiveMenu(null)}
                                                    className="nav-mega-item"
                                                >
                                                    <div className="nav-icon">{link.icon}</div>
                                                    <div>
                                                        <div className="nav-title">{link.title}</div>
                                                        <div className="nav-desc">{link.desc}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setActiveMenu(activeMenu === 'resources' ? null : 'resources')}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'inherit',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: 800,
                                        fontSize: '0.9rem',
                                        opacity: 0.6,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Resources <HiChevronDown style={{ fontSize: '0.8rem', transform: activeMenu === 'resources' ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                                </button>
                                <AnimatePresence>
                                    {activeMenu === 'resources' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            style={{
                                                position: 'absolute',
                                                top: '140%',
                                                left: 0,
                                                width: '400px',
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '24px',
                                                padding: '1.5rem',
                                                boxShadow: 'var(--shadow-lg)',
                                                display: 'grid',
                                                gridTemplateColumns: '1fr',
                                                gap: '1rem'
                                            }}
                                        >
                                            {resourceLinks.map((link) => (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    onClick={() => setActiveMenu(null)}
                                                    className="nav-mega-item"
                                                >
                                                    <div className="nav-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>{link.icon}</div>
                                                    <div>
                                                        <div className="nav-title">{link.title}</div>
                                                        <div className="nav-desc">{link.desc}</div>
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
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '14px',
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {theme === 'light' ? <HiMoon size={20} /> : <HiSun size={20} />}
                        </motion.button>

                        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>

                        {user ? (
                            <div style={{ position: 'relative' }}>
                                <motion.div
                                    onClick={() => setActiveMenu(activeMenu === 'profile' ? null : 'profile')}
                                    style={{
                                        cursor: 'pointer',
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '14px',
                                        overflow: 'hidden',
                                        border: '2px solid var(--primary)'
                                    }}
                                >
                                    <img src={user.photoURL || 'https://via.placeholder.com/40'} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </motion.div>
                                <AnimatePresence>
                                    {activeMenu === 'profile' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            style={{
                                                position: 'absolute',
                                                top: '140%',
                                                right: 0,
                                                width: '240px',
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '24px',
                                                padding: '1rem',
                                                boxShadow: 'var(--shadow-lg)'
                                            }}
                                        >
                                            <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                                                <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>{user.displayName}</div>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>{user.email}</div>
                                            </div>
                                            <Link to="/dashboard" onClick={() => setActiveMenu(null)} className="dropdown-item">Performance Hub</Link>
                                            <Link to="/dashboard/profile" onClick={() => setActiveMenu(null)} className="dropdown-item">Settings</Link>
                                            <button onClick={logout} className="dropdown-item" style={{ color: 'var(--danger)', border: 'none', background: 'transparent', width: '100%', cursor: 'pointer' }}>Sign Out</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', borderRadius: '16px', fontWeight: 800, fontSize: '0.9rem' }}>
                                PORTAL ACCESS
                            </Link>
                        )}

                        <button className="mobile-visible" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'transparent', border: 'none', color: theme === 'light' ? '#0f172a' : 'white' }}>
                            {mobileOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: theme === 'light' ? 'white' : '#0a0a0f',
                            zIndex: 3000,
                            padding: '2rem'
                        }}
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>IE<span style={{ color: 'var(--primary)' }}>HUB</span></span>
                            <button onClick={() => setMobileOpen(false)} style={{ background: 'transparent', border: 'none', color: 'inherit' }}><HiX size={32} /></button>
                        </div>

                        <div className="flex flex-col gap-6">
                            <Link to="/" onClick={() => setMobileOpen(false)} style={{ fontSize: '1.8rem', fontWeight: 900, color: 'inherit' }}>Home</Link>
                            <Link to="/products" onClick={() => setMobileOpen(false)} style={{ fontSize: '1.8rem', fontWeight: 900, color: 'inherit' }}>All Products</Link>
                            <div style={{ padding: '1rem 0' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '1rem' }}>Marketplace</div>
                                <div className="flex flex-col gap-4">
                                    {marketplaceLinks.map(link => (
                                        <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 700, opacity: 0.8 }}>{link.title}</Link>
                                    ))}
                                </div>
                            </div>
                            <div style={{ padding: '1rem 0' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '1rem' }}>Resources</div>
                                <div className="flex flex-col gap-4">
                                    {resourceLinks.map(link => (
                                        <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 700, opacity: 0.8 }}>{link.title}</Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
