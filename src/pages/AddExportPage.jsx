import { motion } from 'framer-motion';

const AddExportPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        price: '',
        origin: '',
        rating: 5,
        quantity: '',
        category: 'Spices',
        description: ''
    });

    const categories = ['Spices', 'Textiles', 'Beverages', 'Food', 'Eco-Friendly', 'Fashion', 'Tech', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/products', {
                ...formData,
                exporterEmail: user.email
            });
            toast.success("Product integrated into global supply chain.");
            navigate('/dashboard/my-exports');
        } catch (error) {
            console.error("Failed to add product", error);
            toast.error("Asset integration failed. Verify network status.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ paddingTop: '120px', paddingBottom: '6rem' }}
        >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3.5rem' }}>
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1.5px' }}
                    >
                        Initialize <span style={{ color: 'var(--primary)' }}>Export SKU</span>
                    </motion.h1>
                    <p style={{ opacity: 0.5, fontWeight: 600 }}>Deploy your local resources to the verified global exchange</p>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="card"
                    style={{
                        padding: '3.5rem',
                        background: 'var(--bg-glass)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="flex flex-col gap-2" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Global Product Title</label>
                            <input
                                type="text" required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Example: Grade A Ceylon Cinnamon"
                                className="form-input"
                            />
                        </div>

                        <div className="flex flex-col gap-2" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Asset Resource (Image URL)</label>
                            <input
                                type="url" required
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://cloud-storage.com/asset-id-44.jpg"
                                className="form-input"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="form-label">Price Per Unit ($)</label>
                            <input
                                type="number" required step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0.00"
                                className="form-input"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="form-label">Provenance / Origin</label>
                            <input
                                type="text" required
                                value={formData.origin}
                                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                placeholder="Ex: Sri Lanka"
                                className="form-input"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="form-label">Classification Segment</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="form-input"
                                style={{ appearance: 'none' }}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="form-label">Initial Stock Allocation</label>
                            <input
                                type="number" required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="500"
                                className="form-input"
                            />
                        </div>

                        <div className="flex flex-col gap-2" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Asset Technical Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Provide comprehensive details for global verification..."
                                rows="4"
                                className="form-input"
                                style={{ fontFamily: 'inherit', resize: 'none' }}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary"
                            style={{
                                gridColumn: 'span 2',
                                justifyContent: 'center',
                                marginTop: '2rem',
                                padding: '1.2rem',
                                fontWeight: 900,
                                fontSize: '1.1rem',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {submitting ? 'PROCESSING PROTOCOL...' : 'DEPLOY ASSET TO MARKETPLACE'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>

            <style>{`
                .form-label { fontSize: 0.75rem; font-weight: 800; opacity: 0.5; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 0.2rem; }
                .form-input { 
                    padding: 1.1rem 1.25rem; 
                    background: var(--bg-card); 
                    border: 1px solid var(--border-color); 
                    border-radius: 14px; 
                    color: var(--text-body); 
                    font-size: 1rem;
                    outline: none; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                }
                .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); background: var(--bg-inset); }
                select.form-input {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1.25rem center;
                    background-size: 1.25rem;
                }
            `}</style>
        </motion.div>
    );
};

export default AddExportPage;
