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
            {/* Header Content */}
            <div className="container" style={{ padding: '160px 2rem 0' }}>
                <button onClick={() => navigate(-1)} className="flex items-center gap-2" style={{
                    background: 'none', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer'
                }}>
                    <HiArrowLeft /> Back to Marketplace
                </button>
            </div>

            <main className="container" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'start' }}>
                {/* Left: Product Media */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ position: 'sticky', top: '100px' }}
                >
                    <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                        <div style={{
                            position: 'absolute', top: '1.5rem', right: '1.5rem',
                            background: 'rgba(2, 6, 23, 0.6)', backdropFilter: 'blur(10px)',
                            padding: '0.5rem 1rem', borderRadius: '30px', color: 'white', fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            <HiStar style={{ color: '#fbbf24' }} /> {product.rating}
                        </div>
                    </div>

                    {/* Secondary Info Grid */}
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
                        <div className="card" style={{ padding: '1rem', textAlign: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(4px)' }}>
                            <HiLocationMarker style={{ fontSize: '1.5rem', color: 'var(--danger)', marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6 }}>Origin</div>
                            <div style={{ fontWeight: 700 }}>{product.origin}</div>
                        </div>
                        <div className="card" style={{ padding: '1rem', textAlign: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(4px)' }}>
                            <HiInbox style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6 }}>Category</div>
                            <div style={{ fontWeight: 700 }}>{product.category}</div>
                        </div>
                        <div className="card" style={{ padding: '1rem', textAlign: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(4px)' }}>
                            <HiLightningBolt style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6 }}>Stock</div>
                            <div style={{ fontWeight: 700 }}>{product.quantity} Units</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ paddingTop: '1rem' }}
                >
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1, marginBottom: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2.5rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>${product.price.toFixed(2)}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>/ Unit</span>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '1rem' }}>Description</h3>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-body)', opacity: 0.9, lineHeight: 1.8 }}>
                            {product.description || "Premium quality product sourced directly from verified global traders. Ensures adherence to international trade standards and quality assurance protocols."}
                        </p>
                    </div>

                    <div className="card" style={{ background: 'var(--bg-surface)', border: 'none', padding: '2rem', marginBottom: '2.5rem' }}>
                        <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <HiCheckCircle style={{ color: 'var(--accent)' }} />
                            Trade Standards
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li className="flex items-center gap-3">
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                <span style={{ fontSize: '0.95rem' }}>Certified Sustainable Sourcing</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                <span style={{ fontSize: '0.95rem' }}>Instant Inventory Synchronization</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                <span style={{ fontSize: '0.95rem' }}>Secure Trade Documentation Bundle</span>
                            </li>
                        </ul>
                    </div>

                    <div style={{
                        position: 'sticky', bottom: '2rem', zIndex: 10,
                        padding: '1.5rem', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
                        borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <button
                            onClick={() => {
                                if (!user) {
                                    toast.error("Please login to import");
                                    navigate("/login", { state: { from: { pathname: `/product/${id}` } } });
                                    return;
                                }
                                setShowModal(true);
                            }}
                            disabled={product.quantity < 1}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', borderRadius: 'var(--radius-md)' }}
                        >
                            {product.quantity < 1 ? 'Restocking Soon' : 'Initiate Import Order'}
                        </button>
                    </div>
                </motion.div>
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
                    main { grid-template-columns: 1fr; gap: 2rem; }
                    main > div:first-child { position: relative !important; top: 0 !important; }
                    h1 { font-size: 2.5rem !important; }
                }
            `}</style>
        </div>
    );
};

export default ProductDetailsPage;
