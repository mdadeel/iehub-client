import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaGoogle } from 'react-icons/fa';
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
                toast.success("Account created successfully!");
                navigate("/");
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Create Account</h2>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Full Name</label>
                        <input
                            type="text" required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Email Address</label>
                        <input
                            type="email" required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Photo URL</label>
                        <input
                            type="url"
                            value={formData.photo}
                            onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                            placeholder="https://example.com/photo.jpg"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Password</label>
                        <input
                            type="password" required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                        Register
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
