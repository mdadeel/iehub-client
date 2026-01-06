import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiEye, HiTrash, HiSearch, HiGlobeAlt, HiCube } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

const MyImportsPage = () => {
    const { user } = useAuth();

    // Handle guest users
    if (user?.isGuest) {
        return (
            <div className="container" style={{ paddingTop: '120px', textAlign: 'center', paddingBottom: '6rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>
                        My <span style={{ color: 'var(--primary)' }}>Imports</span>
                    </h1>
                    <div style={{
                        padding: '2rem',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '24px',
                        marginBottom: '2rem'
                    }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                            You are currently using a demo account.
                        </p>
                        <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
                            Import tracking is not available in demo mode. Please create an account to access this feature.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link to="/register" className="btn btn-primary">Create Account</Link>
                            <Link to="/dashboard" className="btn">Back to Dashboard</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const [imports, setImports] = useState([]);
    const [filteredImports, setFilteredImports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchImports = useCallback(async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            // Using products endpoint to simulate imports (products from others)
            const { data } = await api.get('/products');
            const otherProducts = data.filter(p => p.exporterEmail !== user.email);
            setImports(otherProducts);
            setFilteredImports(otherProducts);
        } catch (error) {
            console.error("Failed to fetch imports", error);
            const errorMessage = error.response?.data?.message || error.message || "Critical error retrieving imports.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchImports();
    }, [fetchImports]);

    useEffect(() => {
        const results = imports.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.origin.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredImports(results);
    }, [searchTerm, imports]);

    if (loading) return (
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: 'auto' }}></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}
        >
            <div className="flex flex-col md:flex-row justify-between items-end gap-6" style={{ marginBottom: '3rem' }}>
                <div>
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}
                    >
                        My <span style={{ color: 'var(--primary)' }}>Imports</span>
                    </motion.h1>
                    <p style={{ opacity: 0.6, fontWeight: 500 }}>Track incoming shipments and global acquisitions.</p>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                    <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                        <HiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input 
                            type="text" 
                            placeholder="Search by name or origin..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field w-full"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                </div>
            </div>

            {imports.length === 0 ? (
                <div className="card text-center p-12" style={{ border: '1px dashed var(--border-color)', opacity: 0.7 }}>
                    <h3 className="text-xl font-bold mb-2">No active imports</h3>
                    <p className="opacity-70">Browse the global marketplace to start importing assets.</p>
                </div>
            ) : filteredImports.length === 0 ? (
                <div className="text-center opacity-50 py-12">No matching imports found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredImports.map((item, index) => (
                            <motion.div
                                layout
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="card group"
                                style={{
                                    padding: '0',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    background: 'var(--bg-glass)',
                                    display: 'flex', flexDirection: 'column'
                                }}
                            >
                                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                                    <img 
                                        src={item.image || 'https://via.placeholder.com/300'} 
                                        alt={item.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)', transition: 'filter 0.3s' }}
                                        className="group-hover:grayscale-0"
                                    />
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(59, 130, 246, 0.9)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                                        {item.status || 'In Transit'}
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '1.5rem 1.5rem 0.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                                        <div className="flex items-center gap-2 text-white">
                                            <HiGlobeAlt className="text-blue-400" />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.origin}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.5rem' }}>{item.name}</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                                        <div className="flex flex-col p-2 rounded-lg" style={{ background: 'var(--bg-inset)' }}>
                                            <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase' }}>Quantity</span>
                                            <span style={{ fontWeight: 800 }}>{item.quantity} Units</span>
                                        </div>
                                        <div className="flex flex-col p-2 rounded-lg" style={{ background: 'var(--bg-inset)' }}>
                                            <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase' }}>Value</span>
                                            <span style={{ fontWeight: 800 }}>${item.price.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-[var(--border-color)] flex justify-between items-center">
                                        <span style={{ fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic' }}>
                                            ETA: 14 Days
                                        </span>
                                        <Link 
                                            to={`/products/${item._id}`}
                                            className="btn btn-sm"
                                            style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                                        >
                                            <HiEye className="mr-1" /> Track
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <style>{`
                .input-field {
                    padding: 0.8rem 1rem;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-inset);
                    color: var(--text-heading);
                    outline: none;
                    transition: all 0.2s;
                }
                .input-field:focus {
                    border-color: var(--primary);
                    background: var(--bg-card);
                }
                .spinner {
                    width: 40px; height: 40px;
                    border: 3px solid var(--border-color); border-top-color: var(--primary);
                    border-radius: 50%; animation: spin 0.8s linear infinite;
                }
            `}</style>
        </motion.div>
    );
};

export default MyImportsPage;
