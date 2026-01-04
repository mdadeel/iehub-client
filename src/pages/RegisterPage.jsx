import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const { registerUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        photo: '',
        password: ''
    });
    const navigate = useNavigate();

    const validatePassword = (pass) => {
        if (pass.length < 6) return "Password must be at least 6 characters long.";
        if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
        return null;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const passError = validatePassword(formData.password);
        if (passError) {
            toast.error(passError);
            return;
        }

        registerUser(formData.email, formData.password, formData.name, formData.photo)
            .then(() => {
                toast.success("Account infrastructure verified. Welcome.");
                navigate("/");
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
                minHeight: '90vh',
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
                    maxWidth: '520px',
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
                    bottom: '-50px',
                    left: '-50px',
                    width: '200px',
                    height: '200px',
                    background: 'var(--primary)',
                    filter: 'blur(100px)',
                    opacity: 0.1,
                    zIndex: 0
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                            Join the <span style={{ color: 'var(--primary)' }}>Network</span>
                        </h2>
                        <p style={{ opacity: 0.5, fontSize: '0.95rem' }}>Start trading worldwide with IE HUB</p>
                    </div>

                    <form onSubmit={handleRegister} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Full Name</label>
                            <input
                                type="text" required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Example: Global Traders Ltd"
                                className="auth-input"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Corporate Email</label>
                            <input
                                type="email" required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="admin@enterprise.com"
                                className="auth-input"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Company Logo / Photo URL</label>
                            <input
                                type="url"
                                value={formData.photo}
                                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                                placeholder="https://logo.com/my-company.jpg"
                                className="auth-input"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Master Password</label>
                            <input
                                type="password" required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="auth-input"
                            />
                            <p style={{ fontSize: '0.75rem', opacity: 0.4, margin: 0 }}>Must be 6+ characters with mixed casing</p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1.2rem', fontWeight: 900 }}
                        >
                            Build Network Access
                        </motion.button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.95rem', opacity: 0.7 }}>
                        Already have access? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800 }}>Login to Portal</Link>
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

export default RegisterPage;
