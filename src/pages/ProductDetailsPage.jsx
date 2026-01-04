import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { HiArrowLeft, HiCheckCircle, HiStar, HiLocationMarker, HiInbox, HiLightningBolt } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ImportModal = ({ product, user, onClose, onSuccess }) => {
    const [qty, setQty] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const isOverLimit = qty > product.quantity;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isOverLimit) return;
        setSubmitting(true);

        try {
            await api.post('/imports', {
                productId: product._id,
                quantity: qty,
                userId: user.uid,
                userEmail: user.email
            });
            toast.success(`Successfully imported ${qty} units!`);
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Import failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card"
                style={{ maxWidth: '450px', width: '90%', padding: '2.5rem', background: 'var(--bg-card)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '60px', height: '60px', background: 'var(--primary)', color: 'white',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', margin: '0 auto 1rem'
                    }}>
                        <HiInbox />
                    </div>
                    <h2 style={{ fontSize: '1.5rem' }}>Finalize Import</h2>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{product.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.6 }}>Available Stock</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{product.quantity} Units</div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quantity to Import</label>
                        <input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                            style={{
                                padding: '1rem',
                                fontSize: '1.1rem',
                                textAlign: 'center',
                                borderRadius: 'var(--radius-md)',
                                border: isOverLimit ? '2px solid var(--danger)' : '1px solid var(--border-color)',
                                background: 'var(--bg-inset)'
                            }}
                        />
                        {isOverLimit && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', textAlign: 'center' }}>Exceeds stock limit!</span>}
                    </div>

                    <div className="flex gap-3" style={{ marginTop: '0.5rem' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ flex: 1, background: 'var(--bg-inset)' }}>Cancel</button>
                        <button
                            type="submit"
                            disabled={isOverLimit || qty < 1 || submitting}
                            className="btn btn-primary"
                            style={{ flex: 1.5 }}
                        >
                            {submitting ? 'Processing...' : 'Confirm Import'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchProduct = useCallback(async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
        } catch (error) {
            toast.error("Product not found");
            navigate('/products');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    if (loading) return (
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem' }}>Loading product details...</p>
        </div>
    );

    if (!product) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
            <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <div className="grid" style={{ gridTemplateColumns: 'minmax(300px, 1.2fr) 1fr', gap: '3rem', alignItems: 'start' }}>
                    {/* Left: Product Media */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', aspectRatio: '1' }}>
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'rgba(2, 6, 23, 0.6)', backdropFilter: 'blur(10px)',
                                padding: '0.4rem 0.8rem', borderRadius: '30px', color: 'white', fontWeight: 700,
                                display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem'
                            }}>
                                <HiStar style={{ color: '#fbbf24' }} /> {product.rating}
                            </div>
                        </div>

                        {/* Secondary Info Grid */}
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                            <div className="card" style={{ padding: '0.8rem', textAlign: 'center', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                                <HiLocationMarker style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.4rem' }} />
                                <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.6, fontWeight: 800 }}>Origin</div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{product.origin}</div>
                            </div>
                            <div className="card" style={{ padding: '0.8rem', textAlign: 'center', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                                <HiInbox style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '0.4rem' }} />
                                <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.6, fontWeight: 800 }}>Category</div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{product.category}</div>
                            </div>
                            <div className="card" style={{ padding: '0.8rem', textAlign: 'center', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                                <HiLightningBolt style={{ fontSize: '1.2rem', color: 'var(--accent)', marginBottom: '0.4rem' }} />
                                <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.6, fontWeight: 800 }}>Stock</div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{product.quantity} Units</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div style={{
                            display: 'inline-block', padding: '0.4rem 0.8rem', background: 'var(--primary)',
                            color: 'white', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900,
                            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem'
                        }}>
                            Verified Asset: {product.category}
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-1px', lineHeight: 1.1 }}>{product.name}</h1>

                        <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <HiStar key={i} style={{ color: i < product.rating ? 'var(--secondary)' : 'rgba(255,255,255,0.1)', fontSize: '1rem' }} />
                                ))}
                            </div>
                            <span style={{ opacity: 0.5, fontSize: '0.85rem', fontWeight: 700 }}>({product.reviews || 42} global validations)</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)' }}>${product.price.toLocaleString()}</span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>/ Unit</span>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1.5px', color: 'var(--primary)', marginBottom: '0.75rem', fontWeight: 800 }}>Detailed Description</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', opacity: 0.7, lineHeight: 1.7 }}>
                                {product.description || "Premium quality product sourced directly from verified global traders. Ensures adherence to international trade standards and quality assurance protocols."}
                            </p>
                        </div>

                        <div className="card" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-color)', padding: '1.5rem', marginBottom: '2.5rem', borderRadius: '24px' }}>
                            <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800 }}>
                                <HiCheckCircle style={{ color: 'var(--secondary)' }} />
                                Trade Standards
                            </h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <li className="flex items-center gap-3">
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>Certified Sustainable Sourcing (ISO-9001)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>Instant Global Inventory Synchronization</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>Secure Trade Documentation Bundle (Verified)</span>
                                </li>
                            </ul>
                        </div>

                        <div style={{
                            position: 'sticky', bottom: '2rem', zTarget: 10,
                            padding: '1.25rem', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)',
                            borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <button
                                onClick={() => {
                                    if (!user) {
                                        toast.error("Authentication required for import");
                                        navigate("/login", { state: { from: { pathname: `/product/${id}` } } });
                                        return;
                                    }
                                    setShowModal(true);
                                }}
                                disabled={product.quantity < 1}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 900, borderRadius: '14px' }}
                            >
                                {product.quantity < 1 ? 'Restocking Soon' : 'Initiate Import Order'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>

            <AnimatePresence>
                {showModal && (
                    <ImportModal
                        product={product}
                        user={user}
                        onClose={() => setShowModal(false)}
                        onSuccess={fetchProduct}
                    />
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 1024px) {
                    main { grid-template-columns: 1fr !important; gap: 2rem; }
                    h1 { font-size: 2rem !important; }
                }
            `}</style>
        </div>
    );
};

export default ProductDetailsPage;
