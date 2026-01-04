import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';

const LoginPage = () => {
    const { loginUser, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleLogin = (e) => {
        e.preventDefault();
        loginUser(email, password)
            .then(() => {
                toast.success("Authentication successful. Welcome to IE HUB.");
                navigate(from, { replace: true });
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    const handleGoogleLogin = () => {
        loginWithGoogle()
            .then(() => {
                toast.success("Global Access Granted.");
                navigate(from, { replace: true });
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                paddingTop: '160px',
                paddingBottom: '4rem'
            }}
        >
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="card"
                style={{
                    maxWidth: '480px',
                    width: '100%',
                    padding: '3.5rem',
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative background glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'var(--primary)',
                    filter: 'blur(80px)',
                    opacity: 0.1,
                    zIndex: 0
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                            Welcome <span style={{ color: 'var(--primary)' }}>Back</span>
                        </h2>
                        <p style={{ opacity: 0.5, fontSize: '0.95rem' }}>Access your global trade dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Corporate Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="auth-input"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Secure Password</label>
                                <Link to="/reset" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Recovery</Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="auth-input"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1.2rem', fontWeight: 900 }}
                        >
                            Sign In to Portal
                        </motion.button>
                    </form>

                    <div style={{ textAlign: 'center', margin: '2rem 0', position: 'relative' }}>
                        <div style={{ height: '1px', background: 'var(--border-color)', width: '100%' }}></div>
                        <span style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'var(--bg-card)',
                            padding: '0 1.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            opacity: 0.4
                        }}>SECURE CONNECT</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, background: 'var(--bg-inset)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleLogin}
                        className="btn"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            border: '1px solid var(--border-color)',
                            background: 'transparent',
                            padding: '1rem',
                            fontWeight: 700,
                            color: 'var(--text-body)'
                        }}
                    >
                        <FaGoogle style={{ marginRight: '10px', color: '#EA4335' }} /> Continue with Google
                    </motion.button>

                    <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.95rem', opacity: 0.7 }}>
                        New to the network? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800 }}>Create Corporate ID</Link>
                    </p>
                </div>
            </motion.div>

            <style>{`
                .auth-input {
                    padding: 1.1rem 1.25rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border-color);
                    background: var(--bg-card);
                    color: var(--text-body);
                    width: 100%;
                    outline: none;
                    transition: all 0.3s;
                    font-size: 1rem;
                }
                .auth-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
            `}</style>
        </motion.div>
    );
};

export default LoginPage;
