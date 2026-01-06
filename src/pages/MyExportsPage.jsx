import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiPencil, HiTrash, HiSearch, HiCube, HiCurrencyDollar } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

const UpdateModal = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...product });
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await onUpdate(product._id, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card"
                style={{
                    width: '90%', maxWidth: '500px', padding: '2.5rem',
                    background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                    borderRadius: '24px'
                }}
            >
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Update Asset</h3>
                <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Modify listing for {product.name}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm">Product Name</label>
                        <input
                            type="text" required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm">Price ($)</label>
                            <input
                                type="number" required step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="input-field"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm">Quantity</label>
                            <input
                                type="number" required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button type="button" onClick={onClose} className="btn w-full" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
                        <button type="submit" disabled={updating} className="btn btn-primary w-full">
                            {updating ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const MyExportsPage = () => {
    const { user } = useAuth();

    // Handle guest users
    if (user?.isGuest) {
        return (
            <div className="container" style={{ paddingTop: '120px', textAlign: 'center', paddingBottom: '6rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>
                        My <span style={{ color: 'var(--secondary)' }}>Exports</span>
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
                            Export listings are not available in demo mode. Please create an account to access this feature.
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

    const [exports, setExports] = useState([]);
    const [filteredExports, setFilteredExports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchExports = useCallback(async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const { data } = await api.get(`/products?exporterEmail=${user.email}`);
            // Filter client-side just in case API returns all
            const myData = data.filter(item => item.exporterEmail === user.email);
            setExports(myData);
            setFilteredExports(myData);
        } catch (error) {
            console.error("Failed to fetch exports", error);
            const errorMessage = error.response?.data?.message || error.message || "Critical error retrieving exported assets.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchExports();
    }, [fetchExports]);

    useEffect(() => {
        const results = exports.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredExports(results);
    }, [searchTerm, exports]);

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently remove this asset from the market?")) return;
        try {
            await api.delete(`/products/${id}`);
            const updated = exports.filter(item => item._id !== id);
            setExports(updated);
            setFilteredExports(updated.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
            toast.success("Asset decommissioned.");
        } catch {
            toast.error("Decommission protocol failed.");
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const { data } = await api.patch(`/products/${id}`, updatedData);
            const updatedList = exports.map(item => item._id === id ? data : item);
            setExports(updatedList);
            // Re-apply filter
            setFilteredExports(updatedList.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
            toast.success("Catalog updated.");
        } catch {
            toast.error("Update failed.");
        }
    };

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
                        My <span style={{ color: 'var(--secondary)' }}>Exports</span>
                    </motion.h1>
                    <p style={{ opacity: 0.6, fontWeight: 500 }}>Manage your active market listings.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <HiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field w-full"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <Link to="/dashboard/add-export" className="btn btn-primary shrink-0">
                        + New Listing
                    </Link>
                </div>
            </div>

            {exports.length === 0 ? (
                <div className="card text-center p-12" style={{ border: '1px dashed var(--border-color)', opacity: 0.7 }}>
                    <h3 className="text-xl font-bold mb-2">No active exports</h3>
                    <p className="opacity-70 mb-6">You haven't listed any products yet.</p>
                    <Link to="/dashboard/add-export" className="btn btn-primary">Start Selling</Link>
                </div>
            ) : filteredExports.length === 0 ? (
                <div className="text-center opacity-50 py-12">No matching assets found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredExports.map((item, index) => (
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
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                        className="group-hover:scale-110"
                                    />
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                                        {item.status || 'Active'}
                                    </div>
                                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--secondary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                        {item.category}
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2 }}>{item.name}</h3>
                                    </div>
                                    <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{item.origin}</p>

                                    <div className="flex justify-between items-center p-3 mb-4" style={{ background: 'var(--bg-inset)', borderRadius: '12px' }}>
                                        <div className="flex items-center gap-2">
                                            <HiCube className="opacity-50" />
                                            <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-lg font-black text-[var(--primary)]">
                                            <span className="text-sm opacity-50 font-normal">$</span>
                                            {item.price.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-auto">
                                        <button
                                            onClick={() => setSelectedProduct(item)}
                                            className="btn flex-1"
                                            style={{ background: 'transparent', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                        >
                                            <HiPencil /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="btn flex-1"
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem' }}
                                        >
                                            <HiTrash />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {selectedProduct && (
                    <UpdateModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onUpdate={handleUpdate}
                    />
                )}
            </AnimatePresence>

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
                    border-color: var(--secondary);
                    background: var(--bg-card);
                }
                .spinner {
                    width: 40px; height: 40px;
                    border: 3px solid var(--border-color); border-top-color: var(--secondary);
                    border-radius: 50%; animation: spin 0.8s linear infinite;
                }
            `}</style>
        </motion.div>
    );
};

export default MyExportsPage;
