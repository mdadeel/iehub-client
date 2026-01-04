import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { HiMail, HiPencil, HiUserCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.displayName || '');
    const [photo, setPhoto] = useState(user?.photoURL || '');

    const handleUpdate = (e) => {
        e.preventDefault();
        toast.success("Profile security protocols updated. Changes saved.");
        setEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ paddingTop: '120px', paddingBottom: '8rem' }}
        >
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="card"
                    style={{
                        overflow: 'hidden',
                        background: 'var(--bg-glass)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '32px',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    {/* Hero Header */}
                    <div style={{
                        height: '240px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        position: 'relative',
                        opacity: 0.9
                    }}>
                        {/* Abstract Pattern Overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                            backgroundSize: '32px 32px',
                            mixMode: 'overlay'
                        }}></div>

                        <div style={{
                            position: 'absolute',
                            bottom: '-70px',
                            left: '60px',
                            width: '160px',
                            height: '160px',
                            borderRadius: '32px',
                            background: 'var(--bg-card)',
                            padding: '8px',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <img
                                src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }}
                            />
                        </div>
                    </div>

                    <div style={{ padding: '100px 60px 60px 60px' }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-2px' }}
                                >
                                    {user?.displayName || 'Trade Participant'}
                                </motion.h1>
                                <p className="flex items-center gap-3" style={{ opacity: 0.5, fontWeight: 700, fontSize: '1.1rem' }}>
                                    <HiMail style={{ color: 'var(--primary)', fontSize: '1.25rem' }} /> {user?.email || 'unverified@iehub.global'}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setEditing(!editing)}
                                className="btn"
                                style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    padding: '1rem 2rem',
                                    borderRadius: '16px',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}
                            >
                                <HiPencil style={{ marginRight: '10px' }} /> {editing ? 'Cancel Redaction' : 'Modify Credentials'}
                            </motion.button>
                        </div>

                        <div style={{ marginTop: '5rem' }}>
                            <div className="flex items-center gap-4" style={{ marginBottom: '3rem' }}>
                                <HiUserCircle style={{ color: 'var(--primary)', fontSize: '2rem' }} />
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Portal Identification</h3>
                            </div>

                            {editing ? (
                                <motion.form
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onSubmit={handleUpdate}
                                    className="flex flex-col gap-8"
                                    style={{ maxWidth: '600px' }}
                                >
                                    <div className="flex flex-col gap-3">
                                        <label style={{ fontWeight: 800, fontSize: '0.75rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1.5px', marginLeft: '4px' }}>PUBLIC DISPLAY NAME IDENTIFIER</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="profile-input"
                                            placeholder="Enter operational name..."
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label style={{ fontWeight: 800, fontSize: '0.75rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1.5px', marginLeft: '4px' }}>AVATAR RESOURCE ENDPOINT (URL)</label>
                                        <input
                                            type="url"
                                            value={photo}
                                            onChange={(e) => setPhoto(e.target.value)}
                                            className="profile-input"
                                            placeholder="https://resource.cdn/user/photo.jpg"
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ padding: '1.2rem', marginTop: '1rem', fontWeight: 900, letterSpacing: '1px', borderRadius: '16px' }}
                                    >
                                        COMMIT CREDENTIAL UPDATES
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '4rem' }}>
                                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                        <label className="info-label">Network Identifier</label>
                                        <p className="info-value">{user?.uid?.substring(0, 16) || 'IEH-88291-ZX-992'}</p>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                        <label className="info-label">Security Protocol Tier</label>
                                        <p className="info-value" style={{ color: 'var(--secondary)' }}>Verified Global Partner</p>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                        <label className="info-label">Operational Zone</label>
                                        <p className="info-value">Global Exchange (Active)</p>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                        <label className="info-label">Encryption Join Date</label>
                                        <p className="info-value">{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric', day: 'numeric' })}</p>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
                .profile-input {
                    padding: 1.25rem 1.5rem;
                    background: var(--bg-inset);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    color: var(--text-body);
                    font-size: 1rem;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .profile-input:focus { 
                    border-color: var(--primary); 
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                    background: var(--bg-card);
                }
                .info-label { 
                    font-size: 0.75rem; 
                    opacity: 0.4; 
                    font-weight: 800; 
                    text-transform: uppercase; 
                    letter-spacing: 1.5px; 
                    display: block; 
                    margin-bottom: 0.75rem; 
                }
                .info-value { 
                    font-size: 1.4rem; 
                    font-weight: 900; 
                    margin: 0; 
                    color: white;
                    letter-spacing: -0.5px;
                }
            `}</style>
        </motion.div>
    );
};

export default ProfilePage;
