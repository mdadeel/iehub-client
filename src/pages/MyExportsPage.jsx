import { motion, AnimatePresence } from 'framer-motion';

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
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="card"
                style={{
                    maxWidth: '540px',
                    width: '90%',
                    padding: '3rem',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>Update Export Specifications</h3>
                    <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Modifying market listing for {product.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="modal-label">Public Product Name</label>
                        <input
                            type="text" required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="modal-input"
                        />
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="flex flex-col gap-2">
                            <label className="modal-label">Market Price ($)</label>
                            <input
                                type="number" required step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="modal-input"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="modal-label">Available Units</label>
                            <input
                                type="number" required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="modal-input"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3" style={{ marginTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ flex: 1, background: 'var(--bg-inset)', border: '1px solid var(--border-color)', fontWeight: 700 }}>Discard</button>
                        <button type="submit" disabled={updating} className="btn btn-primary" style={{ flex: 1.5, fontWeight: 800 }}>
                            {updating ? 'Synchronizing...' : 'Commit Updates'}
                        </button>
                    </div>
                </form>
            </motion.div>
            <style>{`
                .modal-label { fontSize: 0.7rem; font-weight: 800; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; }
                .modal-input { padding: 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-body); outline: none; transition: all 0.2s; }
                .modal-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
            `}</style>
        </motion.div>
    );
};

const MyExportsPage = () => {
    const { user } = useAuth();
    const [exports, setExports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchExports = useCallback(async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const { data } = await api.get(`/products?exporterEmail=${user.email}`);
            setExports(data);
        } catch (error) {
            console.error("Failed to fetch exports", error);
            toast.error("Critical error retrieving exported assets.");
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchExports();
    }, [fetchExports]);

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent deletion of this asset catalog?")) return;
        try {
            await api.delete(`/products/${id}`);
            setExports(exports.filter(item => item._id !== id));
            toast.success("Asset decommissioned successfully.");
        } catch {
            toast.error("Decommission protocol failed.");
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const { data } = await api.patch(`/products/${id}`, updatedData);
            setExports(exports.map(item => item._id === id ? data : item));
            toast.success("Global catalog updated.");
        } catch {
            toast.error("Catalog update failed.");
        }
    };

    if (loading) return (
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: 'auto' }}></div>
            <p style={{ marginTop: '1rem', opacity: 0.5 }}>Retrieving exported asset telemetry...</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ paddingTop: '120px', paddingBottom: '6rem' }}
        >
            <div className="flex justify-between items-end" style={{ marginBottom: '3.5rem' }}>
                <div>
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1.5px' }}
                    >
                        Export <span style={{ color: 'var(--secondary)' }}>Catalog</span>
                    </motion.h1>
                    <p style={{ opacity: 0.5, fontWeight: 600 }}>Proprietary assets listed on the global exchange</p>
                </div>
                <Link to="/dashboard/add-export" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: 700 }}>
                    Initialize New Asset
                </Link>
            </div>

            {exports.length === 0 ? (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.2 }}>🚀</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>No active exports found.</h3>
                    <p style={{ opacity: 0.5, marginBottom: '2rem' }}>You haven't introduced any products to the marketplace yet.</p>
                    <Link to="/dashboard/add-export" className="btn btn-primary">Add Your First Product</Link>
                </motion.div>
            ) : (
                <div className="flex flex-col gap-4">
                    <AnimatePresence mode='popLayout'>
                        {exports.map((item, index) => (
                            <motion.div
                                layout
                                key={item._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className="card"
                                style={{
                                    padding: '1.25rem 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'between',
                                    background: 'var(--bg-glass)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid var(--border-color)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                <div className="flex items-center gap-6" style={{ flex: 1 }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                                            {item.category}
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.name}</h3>
                                        <div style={{ fontSize: '0.85rem', opacity: 0.5, fontWeight: 600 }}>
                                            Supply: <strong style={{ color: 'var(--text-body)' }}>{item.quantity}</strong> | Origin: {item.origin}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.4, fontWeight: 800 }}>VALUATION</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)' }}>${item.price.toFixed(2)}</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1, background: 'var(--primary)', color: 'white' }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setSelectedProduct(item)}
                                            className="op-btn"
                                            title="Modify Specs"
                                        >
                                            <HiPencil size={20} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDelete(item._id)}
                                            className="op-btn"
                                            style={{ color: '#f87171' }}
                                            title="Decommission Asset"
                                        >
                                            <HiTrash size={20} />
                                        </motion.button>
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
                .op-btn {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    background: transparent;
                    color: var(--text-body);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--border-color);
                    border-top: 4px solid var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </motion.div>
    );
};

export default MyExportsPage;
