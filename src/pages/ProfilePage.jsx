import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiUserCircle, HiMail, HiBriefcase, HiCheckCircle } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Check if user is a guest
    const isGuestUser = user?.isGuest;

    // Mock user data extension since actual auth might just have basic info
    const [formData, setFormData] = useState({
        displayName: user?.displayName || (isGuestUser ? 'Demo User' : 'Trade Merchant'),
        email: user?.email || (isGuestUser ? 'demo@importexport.com' : ''),
        role: isGuestUser ? 'Demo Account' : 'Verified Exporter',
        company: isGuestUser ? 'Demo Company' : 'Global Trade Ltd.',
        location: isGuestUser ? 'Demo Location' : 'Colombo, Sri Lanka'
    });

    const handleSave = (e) => {
        e.preventDefault();
        // In a real app, API call to update profile
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: 'Updating profile...',
                success: 'Profile updated successfully!',
                error: 'Could not update profile.',
            }
        );
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ paddingTop: '2.5rem', paddingBottom: '6rem', maxWidth: '900px' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}
                >
                    User <span style={{ color: 'var(--secondary)' }}>Profile</span>
                </motion.h1>
                <p style={{ opacity: 0.6 }}>Manage your account settings and business preferences.</p>

                {isGuestUser && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.8rem',
                        background: 'var(--bg-inset)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        border: '1px solid var(--border-color)'
                    }}>
                        <p style={{ color: 'var(--secondary)', fontWeight: 600 }}>
                            You are currently using a demo account. Data may not be saved permanently.
                        </p>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <motion.div
                    className="card md:col-span-1"
                    style={{
                        padding: '2rem',
                        background: 'var(--bg-glass)',
                        textAlign: 'center',
                        border: '1px solid var(--border-color)',
                        borderRadius: '24px'
                    }}
                >
                    <div style={{ width: '120px', height: '120px', margin: '0 auto 1.5rem', borderRadius: '50%', background: 'var(--bg-inset)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--secondary)', position: 'relative' }}>
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--secondary)' }}>
                                {formData.displayName.charAt(0)}
                            </span>
                        )}
                        <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#10b981', color: 'white', padding: '0.25rem', borderRadius: '50%', border: '2px solid var(--bg-card)' }}>
                            <HiCheckCircle size={20} />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{formData.displayName}</h2>
                    <p style={{ opacity: 0.5, fontSize: '0.9rem', marginBottom: '1.5rem' }}>{formData.role}</p>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                        <div className="flex items-center gap-3 opacity-70">
                            <HiMail className="text-xl" />
                            <span style={{ fontSize: '0.9rem' }}>{formData.email}</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-70">
                            <HiBriefcase className="text-xl" />
                            <span style={{ fontSize: '0.9rem' }}>{formData.company}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Edit Form */}
                <motion.div
                    className="card md:col-span-2"
                    style={{
                        padding: '2.5rem',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '24px'
                    }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Account Details</h3>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="btn btn-sm"
                            style={{ background: isEditing ? 'var(--bg-inset)' : 'var(--primary)', border: 'none' }}
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="flex flex-col gap-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="label">Display Name</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Job Title / Role</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="label">Company Name</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Location</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                disabled={true} // Usually email is managed via auth provider
                                value={formData.email}
                                className="input-field"
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            />
                        </div>

                        {isEditing && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                                    Save Changes
                                </button>
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </div>

            <style>{`
                .label { font-size: 0.8rem; font-weight: 700; opacity: 0.6; margin-bottom: 0.5rem; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
                .input-field {
                    width: 100%;
                    padding: 0.9rem 1.1rem;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-inset);
                    color: var(--text-body);
                    outline: none;
                    transition: all 0.2s;
                }
                .input-field:focus:not(:disabled) {
                    border-color: var(--secondary);
                    background: var(--bg-card);
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
                }
                .input-field:disabled {
                    opacity: 0.7;
                    background: transparent;
                    border-color: transparent;
                    padding-left: 0;
                }
            `}</style>
        </motion.div>
    );
};

export default ProfilePage;
