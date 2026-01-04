import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { HiUserCircle, HiMail, HiPencil } from 'react-icons/hi';

const ProfilePage = () => {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.displayName || '');
    const [photo, setPhoto] = useState(user?.photoURL || '');

    const handleUpdate = (e) => {
        e.preventDefault();
        toast.success("Profile updated locally! (Mock)");
        setEditing(false);
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', overflow: 'hidden' }}>
                <div style={{ height: '150px', background: 'var(--primary)', position: 'relative' }}>
                    <div style={{
                        position: 'absolute', bottom: '-50px', left: '50px',
                        border: '5px solid white', borderRadius: '50%', overflow: 'hidden'
                    }}>
                        <img
                            src={user?.photoURL || 'https://i.pravatar.cc/150'}
                            alt="Profile"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                    </div>
                </div>

                <div style={{ padding: '70px 50px 50px 50px' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user?.displayName || 'Anonymous User'}</h1>
                            <p className="flex items-center gap-2" style={{ opacity: 0.7 }}><HiMail /> {user?.email || 'no-email@hub.com'}</p>
                        </div>
                        <button onClick={() => setEditing(!editing)} className="btn btn-secondary">
                            <HiPencil /> {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Account Information</h3>

                        {editing ? (
                            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label style={{ fontWeight: 600 }}>Display Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label style={{ fontWeight: 600 }}>Photo URL</label>
                                    <input
                                        type="url"
                                        value={photo}
                                        onChange={(e) => setPhoto(e.target.value)}
                                        style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '200px', marginTop: '1rem' }}>Save Changes</button>
                            </form>
                        ) : (
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase' }}>User ID</label>
                                    <p>{user?.uid || 'MOCK-UID-12345'}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase' }}>Account Status</label>
                                    <p style={{ color: 'var(--accent)', fontWeight: 700 }}>Active</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase' }}>Last Login</label>
                                    <p>{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
