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
            toast.success('Welcome back, Admin!');
            navigate('/admin/dashboard');
        } else {
            toast.error('Invalid credentials');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-dark)',
            color: 'white'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '3rem',
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px',
                        background: 'var(--primary)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '1.5rem'
                    }}>
                        <HiLockClosed />
                    </div>
                    <h2>Admin Portal</h2>
                    <p style={{ opacity: 0.6 }}>Secure Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', justifyContent: 'center' }}
                    >
                        Access Dashboard
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
