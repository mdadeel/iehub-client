import { motion, AnimatePresence } from 'framer-motion';

const MyImportsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [imports, setImports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImports = async () => {
            if (!user?.email) return;
            setLoading(true);
            try {
                const { data } = await api.get(`/imports/${user.email}`);
                setImports(data);
            } catch (error) {
                console.error("Failed to fetch imports", error);
                toast.error("Cloud sync failed for import records.");
            } finally {
                setLoading(false);
            }
        };

        fetchImports();
    }, [user]);

    const handleRemove = async (id) => {
        if (!window.confirm("Archive this import record?")) return;
        try {
            await api.delete(`/imports/${id}`);
            setImports(imports.filter(item => item._id !== id));
            toast.success("Record archived from active manifest.");
        } catch {
            toast.error("Failed to update manifest.");
        }
    };

    if (loading) return (
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: 'auto' }}></div>
            <p style={{ marginTop: '1rem', opacity: 0.5 }}>Synchronizing import manifest...</p>
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
                        Import <span style={{ color: 'var(--primary)' }}>Manifest</span>
                    </motion.h1>
                    <p style={{ opacity: 0.5, fontWeight: 600 }}>Active resource allocations for your sector</p>
                </div>
                <Link to="/products" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: 700 }}>
                    Allocate New Assets
                </Link>
            </div>

            {imports.length === 0 ? (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.2 }}>📦</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>No active imports detected.</h3>
                    <p style={{ opacity: 0.5, marginBottom: '2rem' }}>Start building your global supply chain by browsing our verified marketplace.</p>
                    <Link to="/products" className="btn btn-primary">Browse Marketplace</Link>
                </motion.div>
            ) : (
                <div className="flex flex-col gap-4">
                    <AnimatePresence mode='popLayout'>
                        {imports.map((item, index) => {
                            const product = item.productId || {};
                            return (
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
                                            <img src={product.image || 'https://via.placeholder.com/100'} alt={product.name} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                                            <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                                                {product.category || 'Asset'}
                                            </div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{product.name || 'Unidentified Product'}</h3>
                                            <div style={{ fontSize: '0.85rem', opacity: 0.5, fontWeight: 600 }}>
                                                Origin: {product.origin || 'International'} | Status: <span style={{ color: '#10b981' }}>Secured</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.4, fontWeight: 800 }}>UNIT PRICE</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>${(product.price || 0).toFixed(2)}</div>
                                        </div>

                                        <div className="flex gap-2">
                                            {product._id && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1, background: 'var(--bg-inset)' }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => navigate(`/product/${product._id}`)}
                                                    className="op-btn"
                                                    title="Inspect Asset"
                                                >
                                                    <HiEye size={20} />
                                                </motion.button>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemove(item._id)}
                                                className="op-btn"
                                                style={{ color: '#f87171' }}
                                                title="Archive Record"
                                            >
                                                <HiTrash size={20} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

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

export default MyImportsPage;
