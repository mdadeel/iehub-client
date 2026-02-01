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
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            background: scrolled ? 'var(--glass-bg)' : 'transparent',
            backdropFilter: scrolled ? 'var(--glass-blur)' : 'none',
            WebkitBackdropFilter: scrolled ? 'var(--glass-blur)' : 'none',
            borderBottom: scrolled ? '1px solid var(--border-color)' : 'none'
        }}>
            <nav className="container">
                <div style={{
                    height: scrolled ? '64px' : '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.4s ease'
                }}>

                    {/* Left: Brand */}
                    <div className="flex items-center gap-12">
                        <Link to="/" className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                style={{
                                    width: 'clamp(28px, 4vw, 34px)',
                                    height: 'clamp(28px, 4vw, 34px)',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '5px',
                                    boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.3)',
                                    overflow: 'hidden'
                                }}
                            >
                                <img src="/logo.png" alt="IEHUB Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </motion.div>
                            <span style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 900, letterSpacing: '-1px', color: theme === 'light' ? '#0f172a' : 'white' }}>
                                IE<span style={{ color: 'var(--primary)' }}>HUB</span>
                            </span>
                        </Link>

                        {/* DESKTOP NAV - CENTERED */}
                        <div className="desktop-visible items-center" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', gap: '0.5rem' }}>
                            <NavLink to="/" style={({ isActive }) => ({
                                padding: '0.6rem 1.2rem',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: 800,
                                opacity: isActive ? 1 : 0.6,
                                color: isActive ? 'var(--primary)' : 'inherit'
                            })}>Home</NavLink>

                            <NavLink to="/products" style={({ isActive }) => ({
                                padding: '0.5rem 1rem',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
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
                                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                            ref={dropdownRef}
                                            style={{
                                                position: 'absolute',
                                                top: 'calc(100% + 0.75rem)',
                                                left: '-100px',
                                                width: '300px',
                                                background: 'var(--bg-card)',
                                                backdropFilter: 'blur(30px)',
                                                WebkitBackdropFilter: 'blur(30px)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '20px',
                                                padding: '0.75rem',
                                                boxShadow: '0 20px 40px -8px rgba(0,0,0,0.2)',
                                            }}
                                        >
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.25rem' }}>
                                                {marketplaceLinks.map((link) => (
                                                    <Link
                                                        key={link.path}
                                                        to={link.path}
                                                        onClick={() => setActiveMenu(null)}
                                                        className="nav-mega-item"
                                                    >
                                                        <div className="nav-icon" style={{ background: 'rgba(37, 99, 235, 0.08)', color: 'var(--primary)' }}>{link.icon}</div>
                                                        <div>
                                                            <div className="nav-title">{link.title}</div>
                                                            <div className="nav-desc">{link.desc}</div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
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
                                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                            style={{
                                                position: 'absolute',
                                                top: 'calc(100% + 0.75rem)',
                                                left: '-100px',
                                                width: '300px',
                                                background: 'var(--bg-card)',
                                                backdropFilter: 'blur(30px)',
                                                WebkitBackdropFilter: 'blur(30px)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '20px',
                                                padding: '0.75rem',
                                                boxShadow: '0 20px 40px -8px rgba(0,0,0,0.2)',
                                            }}
                                        >
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.25rem' }}>
                                                {resourceLinks.map((link) => (
                                                    <Link
                                                        key={link.path}
                                                        to={link.path}
                                                        onClick={() => setActiveMenu(null)}
                                                        className="nav-mega-item"
                                                    >
                                                        <div className="nav-icon" style={{ background: 'rgba(16, 185, 129, 0.08)', color: 'var(--accent)' }}>{link.icon}</div>
                                                        <div>
                                                            <div className="nav-title">{link.title}</div>
                                                            <div className="nav-desc">{link.desc}</div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
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
                                width: 'clamp(38px, 5vw, 44px)',
                                height: 'clamp(38px, 5vw, 44px)',
                                borderRadius: '12px',
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

                        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 0.5rem', opacity: 0.3 }}></div>

                        {user ? (
                            <div style={{ position: 'relative' }}>
                                <motion.div
                                    onClick={() => setActiveMenu(activeMenu === 'profile' ? null : 'profile')}
                                    style={{
                                        cursor: 'pointer',
                                        width: 'clamp(38px, 5vw, 44px)',
                                        height: 'clamp(38px, 5vw, 44px)',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: user.isGuest ? '2px dashed var(--secondary)' : '2px solid var(--primary)'
                                    }}
                                >
                                    {user.isGuest ? (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'var(--bg-inset)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--secondary)'
                                        }}>
                                            <HiUser size={20} />
                                        </div>
                                    ) : (
                                        <img src={user.photoURL || 'https://via.placeholder.com/40'} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </motion.div>
                                <AnimatePresence>
                                    {activeMenu === 'profile' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                            style={{
                                                position: 'absolute',
                                                top: 'calc(100% + 0.75rem)',
                                                right: 0,
                                                width: '240px',
                                                background: 'var(--bg-card)',
                                                backdropFilter: 'blur(30px)',
                                                WebkitBackdropFilter: 'blur(30px)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '20px',
                                                padding: '0.75rem',
                                                boxShadow: '0 20px 40px -8px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            <div style={{ padding: '0 0.25rem 0.5rem 0.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                                                <div style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '-0.2px' }}>{user.displayName}</div>
                                                <div style={{ fontSize: '0.65rem', opacity: 0.4, fontWeight: 600 }}>
                                                    {user.email} {user.isGuest && '(Demo)'}
                                                </div>
                                                {user.isGuest && (
                                                    <div style={{
                                                        fontSize: '0.6rem',
                                                        opacity: 0.6,
                                                        marginTop: '0.4rem',
                                                        padding: '0.2rem 0.4rem',
                                                        background: 'var(--bg-inset)',
                                                        borderRadius: '4px',
                                                        display: 'inline-block'
                                                    }}>
                                                        DEMO MODE
                                                    </div>
                                                )}
                                            </div>
                                            <Link to="/dashboard" onClick={() => setActiveMenu(null)} className="dropdown-item">Performance Hub</Link>
                                            <Link to="/dashboard/profile" onClick={() => setActiveMenu(null)} className="dropdown-item">Settings</Link>
                                            <button onClick={logout} className="dropdown-item" style={{ color: 'var(--danger)', border: 'none', background: 'transparent', width: '100%', cursor: 'pointer' }}>Sign Out</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ padding: '0.6rem 2rem', borderRadius: '12px', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '1px' }}>
                                LOGIN
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
                            <div className="flex items-center gap-3">
                                <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
                                <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>IE<span style={{ color: 'var(--primary)' }}>HUB</span></span>
                            </div>
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
        </header >
    );
};

export default Navbar;
