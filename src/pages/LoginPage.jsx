import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaGoogle } from 'react-icons/fa';
import toast from 'react-hot-toast';

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
                toast.success("Welcome back!");
                navigate(from, { replace: true });
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    const handleGoogleLogin = () => {
        loginWithGoogle()
            .then(() => {
                toast.success("Logged in with Google!");
                navigate(from, { replace: true });
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Welcome Back</h2>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <label style={{ fontWeight: 600 }}>Password</label>
                            <Link to="/reset" style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>Forgot Password?</Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                        Login
                    </button>
                </form>

                <div style={{ textAlign: 'center', margin: '1.5rem 0', position: 'relative' }}>
                    <hr style={{ opacity: 0.2 }} />
                    <span style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'var(--bg-card)',
                        padding: '0 1rem',
                        fontSize: '0.8rem',
                        opacity: 0.6
                    }}>OR</span>
                </div>

                <button onClick={handleGoogleLogin} className="btn" style={{
                    width: '100%',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                    background: 'white',
                    color: 'var(--text-light)'
                }}>
                    <FaGoogle style={{ color: '#db4437' }} /> Login with Google
                </button>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Register Now</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
