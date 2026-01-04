import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiLockClosed } from 'react-icons/hi';
import { motion } from 'framer-motion';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (email === 'admin121@gmail.com' && password === 'admin121') {
            localStorage.setItem('isAdmin', 'true');
            toast.success('Central command authorized. Welcome, Admin.');
            navigate('/admin/dashboard');
        } else {
            toast.error('Authorization failed. Access denied.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)',
            color: 'white',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    padding: '3.5rem',
                    background: 'rgba(17, 24, 39, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    borderRadius: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'var(--primary)',
                    filter: 'blur(80px)',
                    opacity: 0.15,
                    pointerEvents: 'none'
                }} />

                <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
                    <motion.div
                        initial={{ rotate: -20, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            width: '72px', height: '72px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
                            borderRadius: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            fontSize: '2rem',
                            boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.5)'
                        }}>
                        <HiLockClosed />
                    </motion.div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Admin <span style={{ color: 'var(--primary)' }}>Portal</span></h2>
                    <p style={{ opacity: 0.4, fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>High-Security Zone</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1.5px', marginLeft: '4px' }}>Security ID</label>
                        <input
                            type="email"
                            placeholder="admin@enterprise.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="admin-input"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1.5px', marginLeft: '4px' }}>Access Key</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="admin-input"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            marginTop: '1.5rem',
                            justifyContent: 'center',
                            padding: '1.2rem',
                            fontWeight: 900,
                            letterSpacing: '1px',
                            borderRadius: '14px',
                            fontSize: '1rem'
                        }}
                    >
                        AUTHORIZE ACCESS
                    </motion.button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', opacity: 0.3, fontWeight: 500 }}>
                        All sessions are logged and encrypted. <br />
                        Unauthorized access attempts will be flagged.
                    </p>
                </div>
            </motion.div>

            <style>{`
                .admin-input {
                    padding: 1.1rem 1.25rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 14px;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .admin-input:focus {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }
            `}</style>
        </div>
    );
};

export default AdminLoginPage;
