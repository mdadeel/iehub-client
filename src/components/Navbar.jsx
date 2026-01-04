import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import {
    HiMenu, HiX, HiMoon, HiSun, HiLogout,
    HiViewGrid, HiChevronDown, HiUser,
    HiShieldCheck
} from 'react-icons/hi';

const Navbar = () => {
    const { user, logout, theme, toggleTheme } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Products', path: '/products' },
        { title: 'About Us', path: '/about' },
        { title: 'Contact', path: '/contact' },
    ];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown on click outside
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
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: scrolled ? '0.5rem 0' : '0.8rem 0',
            transition: 'var(--transition)',
            pointerEvents: 'none'
        }}>
            <nav className="container" style={{ pointerEvents: 'auto' }}>
                <div style={{
                    background: theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.6rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: scrolled ? 'var(--shadow-lg)' : 'var(--shadow)',
                    transition: 'var(--transition)'
                }}>

                    {/* Brand / Logo */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <Link to="/" className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ rotate: 15 }}
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    background: 'var(--primary)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                                }}
                            >
                                <img src="/logo.png" alt="Logo" style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                            </motion.div>
                            <span style={{
                                fontSize: '1.25rem',
                                fontWeight: '800',
                                letterSpacing: '-0.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                            }}>
                                IE <span style={{ color: 'var(--primary)' }}>HUB</span>
                            </span>
                        </Link>
                    </div>

                    {/* Centered Navigation Links */}
                    <div className="hidden md-flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                style={({ isActive }) => ({
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    color: isActive ? 'var(--primary)' : 'inherit',
                                    opacity: isActive ? 1 : 0.7,
                                    position: 'relative',
                                    transition: 'var(--transition)'
                                })}
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.title}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-active"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '4px',
                                                    left: '1.2rem',
                                                    right: '1.2rem',
                                                    height: '2px',
                                                    background: 'var(--primary)',
                                                    borderRadius: '2px'
                                                }}
                                            />
                                        )}
                                        <motion.div
                                            className="hover-bg"
                                            style={{
                                                position: 'absolute',
                                                inset: '4px',
                                                background: 'var(--primary)',
                                                borderRadius: 'var(--radius-md)',
                                                opacity: 0,
                                                zIndex: -1
                                            }}
                                            whileHover={{ opacity: 0.08 }}
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifySelf: 'end', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                            onClick={toggleTheme}
                            className="btn"
                            style={{
                                padding: '0.6rem',
                                background: 'transparent',
                                borderRadius: '50%',
                                opacity: 0.7
                            }}
                        >
                            {theme === 'light' ? <HiMoon size={20} /> : <HiSun size={20} />}
                        </button>

                        <div style={{ width: '1px', height: '20px', background: 'rgba(128,128,128,0.2)', margin: '0 0.5rem' }} />

                        {user ? (
                            <div style={{ position: 'relative' }} ref={dropdownRef}>
                                <motion.div
                                    className="flex items-center gap-2"
                                    style={{ cursor: 'pointer', padding: '0.3rem 0.5rem', borderRadius: '30px', border: '1px solid transparent' }}
                                    whileHover={{ background: 'rgba(128,128,128,0.05)', borderColor: 'rgba(128,128,128,0.1)' }}
                                    onClick={() => setProfileOpen(!profileOpen)}
                                >
                                    <img
                                        src={user.photoURL || 'https://via.placeholder.com/40'}
                                        alt="Profile"
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                                    />
                                    <span className="hidden lg-block" style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.displayName?.split(' ')[0]}</span>
                                    <HiChevronDown style={{ fontSize: '0.8rem', opacity: 0.5, transform: profileOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                                </motion.div>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="dropdown-menu"
                                            style={{
                                                top: '120%',
                                                right: 0,
                                                minWidth: '220px',
                                                padding: '0.75rem',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                                            }}
                                        >
                                            <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user.displayName}</div>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.5, wordBreak: 'break-all' }}>{user.email}</div>
                                            </div>

                                            <Link to="/dashboard" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                                                <div style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', padding: '0.4rem', borderRadius: '6px' }}><HiViewGrid /></div>
                                                <span>Dashboard</span>
                                            </Link>
                                            <Link to="/dashboard/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                                                <div style={{ background: 'rgba(128,128,128,0.1)', color: 'gray', padding: '0.4rem', borderRadius: '6px' }}><HiUser /></div>
                                                <span>Profile</span>
                                            </Link>

                                            <div
                                                className="dropdown-item"
                                                style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem', color: 'var(--danger)' }}
                                                onClick={() => { logout(); setProfileOpen(false); }}
                                            >
                                                <div style={{ background: 'rgba(244,63,94,0.1)', padding: '0.4rem', borderRadius: '6px' }}><HiLogout /></div>
                                                <span>Sign Out</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem', borderRadius: '30px' }}>
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            className="md-hidden"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{ background: 'transparent', padding: '0.5rem', marginLeft: '0.5rem' }}
                        >
                            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            overflow: 'hidden',
                            background: theme === 'light' ? 'white' : 'var(--bg-subtle-dark)',
                            marginTop: '0.5rem',
                            borderBottom: '1px solid var(--border-light)'
                        }}
                    >
                        <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.path}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setMobileOpen(false)}
                                        style={{ fontSize: '1.2rem', fontWeight: '700', padding: '0.5rem 0', display: 'block' }}
                                    >
                                        {link.title}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hidden { display: none !important; }
                @media (min-width: 768px) {
                    .md-flex { display: flex !important; }
                    .md-hidden { display: none !important; }
                }
                @media (min-width: 1024px) {
                    .lg-block { display: block !important; }
                }
            `}} />
        </header>
    );
};

export default Navbar;
