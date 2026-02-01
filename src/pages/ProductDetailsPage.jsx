import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import {
    HiArrowLeft, HiCheckCircle, HiStar, HiLocationMarker,
    HiInbox, HiLightningBolt, HiShieldCheck, HiTrendingUp,
    HiCube, HiInformationCircle
} from 'react-icons/hi';
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
            toast.success(`Trade Request Successful: ${qty} units processed.`);
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Trade execution failed");
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
                background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
            }}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="card"
                style={{
                    maxWidth: '400px', width: '90%', padding: '2rem',
                    background: 'var(--bg-card)', borderRadius: '24px',
                    border: '1px solid var(--primary-light)',
                    boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.25)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '56px', height: '56px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)',
                        borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', margin: '0 auto 1rem'
                    }}>
                        <HiShieldCheck />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Trade Execution</h2>
                    <p style={{ opacity: 0.5, fontSize: '0.8rem', fontWeight: 600 }}>ID: {product._id?.substring(0, 8)}...</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div style={{
                        padding: '1rem', background: 'var(--bg-inset)',
                        borderRadius: '16px', border: '1px solid var(--border-color)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4 }}>Availability</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{product.quantity} Units</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4 }}>Unit Price</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-light)' }}>${product.price}</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label style={{ fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5 }}>Transaction Volume</label>
                        <input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                            className="market-input"
                            style={{
                                padding: '0.8rem',
                                fontSize: '1.1rem',
                                textAlign: 'center',
                                borderRadius: '12px',
                                border: isOverLimit ? '2px solid var(--danger)' : '1px solid var(--border-color)',
                                background: 'var(--bg-inset)',
                                width: '100%'
                            }}
                        />
                        {isOverLimit && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', textAlign: 'center', fontWeight: 700 }}>EXCEEDS QUOTA LIMIT</span>}
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            type="submit"
                            disabled={isOverLimit || qty < 1 || submitting}
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', borderRadius: '12px' }}
                        >
                            {submitting ? 'EXECUTING...' : 'AUTHORIZE TRADE'}
                        </button>
                        <button type="button" onClick={onClose} style={{
                            background: 'transparent', border: 'none', color: 'var(--text-muted)',
                            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
                        }}>
                            ABORT TRANSACTION
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
    const { user, theme } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchProduct = useCallback(async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
        } catch (error) {
            toast.error("Telemetry Link Broken: Asset Not Found");
            navigate('/products');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    if (loading) return (
        <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1.5rem', fontWeight: 800, opacity: 0.4, letterSpacing: '1px' }}>INITIALIZING ASSET TELEMETRY...</p>
        </div>
    );

    if (!product) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)', position: 'relative' }}>
            {/* Background Mesh Overlay */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: '400px',
                background: `radial-gradient(circle at 50% -20%, ${theme === 'light' ? 'rgba(37,99,235,0.05)' : 'rgba(37,99,235,0.15)'}, transparent)`,
                pointerEvents: 'none', zIndex: 0
            }}></div>

            <main className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '80px', paddingBottom: '4rem' }}>
                {/* Header/Back Link */}
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-2"
                    style={{
                        background: 'transparent', border: 'none', color: 'var(--text-muted)',
                        marginBottom: '1rem', fontWeight: 800, fontSize: '0.7rem',
                        textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer'
                    }}
                >
                    <HiArrowLeft /> Terminal Index
                </button>

                <div className="grid main-layout-grid" style={{ gridTemplateColumns: '0.85fr 1.15fr', gap: '2.5rem', alignItems: 'start' }}>
                    {/* Left: Product Visuals */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                            style={{
                                padding: '1rem', borderRadius: '24px', overflow: 'hidden',
                                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
                                boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)', position: 'relative'
                            }}
                        >
                            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '1.1/1' }}>
                                <motion.img
                                    src={product.image}
                                    alt={product.name}
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute', top: '1rem', left: '1rem',
                                    background: 'var(--primary)', color: 'white',
                                    padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.6rem',
                                    fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px',
                                    boxShadow: '0 10px 20px rgba(37,99,235,0.3)'
                                }}>
                                    Live Stream Enabled
                                </div>
                            </div>

                            {/* Status Bar */}
                            <div style={{
                                marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-inset)',
                                borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div className="flex items-center gap-2">
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.7 }}>Channel Active</span>
                                </div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)' }}>REF-{product._id?.substring(0, 4).toUpperCase()}</div>
                            </div>
                        </motion.div>

                        {/* Quick Metrics Grid */}
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                            {[
                                { label: 'Origin Port', value: product.origin, icon: <HiLocationMarker />, color: 'var(--primary)' },
                                { label: 'Asset Class', value: product.category, icon: <HiCube />, color: 'var(--secondary)' },
                                { label: 'Net Capacity', value: `${product.quantity} Units`, icon: <HiTrendingUp />, color: 'var(--accent)' }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="card"
                                    style={{ padding: '0.75rem', textAlign: 'left', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                                >
                                    <div style={{ fontSize: '1rem', color: item.color, marginBottom: '0.35rem' }}>{item.icon}</div>
                                    <div style={{ fontSize: '0.5rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '0.5px' }}>{item.label}</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.value}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Technical Details */}
                    <div style={{ paddingTop: '1rem' }}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3" style={{ marginBottom: '0.75rem' }}>
                                <div style={{
                                    padding: '0.3rem 0.6rem', background: theme === 'light' ? '#f1f5f9' : '#1e293b',
                                    borderRadius: '6px', fontSize: '0.6rem', fontWeight: 800, opacity: 0.8
                                }}>{product.category}</div>
                                <div className="flex items-center gap-1">
                                    <HiStar style={{ color: 'var(--secondary)', fontSize: '0.85rem' }} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>{product.rating} HubScore</span>
                                </div>
                            </div>

                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px', lineHeight: 1.1 }}>
                                {product.name}
                            </h1>

                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem',
                                padding: '1.25rem', background: 'var(--bg-glass)', borderRadius: '16px',
                                border: '1px solid var(--border-color)', marginBottom: '1.5rem'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '1px' }}>Market Value</div>
                                    <div className="flex items-baseline gap-1" style={{ marginTop: '0.2rem' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>${product.price.toLocaleString()}</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.4 }}>USD/U</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center border-l" style={{ paddingLeft: '1.5rem', borderColor: 'var(--border-color)' }}>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4 }}>Availability</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, marginTop: '0.2rem' }}>{product.quantity} In Stock</div>
                                </div>
                            </div>

                            <section style={{ marginBottom: '2rem', padding: 0 }}>
                                <h3 style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase',
                                    letterSpacing: '1px', color: 'var(--primary)', marginBottom: '0.75rem'
                                }}>
                                    <HiInformationCircle /> Asset Intelligence
                                </h3>
                                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.6, fontWeight: 500 }}>
                                    {product.description || "Sophisticated commodity listing with verified supply chain origin. Rigorously tested for international compliance standards."}
                                </p>
                            </section>

                            {/* Trade Certifications Grid */}
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {[
                                    { title: 'ISO Sync', desc: '9001:2015', icon: <HiCheckCircle /> },
                                    { title: 'Logistics', desc: 'Secure Chain', icon: <HiCube /> },
                                    { title: 'Custody', desc: 'E2E Tracking', icon: <HiShieldCheck /> },
                                    { title: 'Protocol', desc: 'Algo Ready', icon: <HiLightningBolt /> }
                                ].map((cert, idx) => (
                                    <div key={idx} style={{
                                        padding: '0.75rem', border: '1px solid var(--border-color)',
                                        borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center'
                                    }}>
                                        <div style={{ color: 'var(--primary)', fontSize: '1rem' }}>{cert.icon}</div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 900 }}>{cert.title}</div>
                                            <div style={{ fontSize: '0.6rem', fontWeight: 600, opacity: 0.4 }}>{cert.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Action Bar */}
                            <div style={{
                                position: 'sticky', bottom: '2rem',
                                background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(24px)',
                                padding: '0.8rem 1.25rem', borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                                display: 'flex', alignItems: 'center', gap: '1rem'
                            }}>
                                <div className="flex-grow desktop-visible" style={{ color: 'white' }}>
                                    <div style={{ fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.5 }}>Execution Volume</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 900 }}>${product.price.toLocaleString()} Base Unit</div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            toast.error("Security Bypass Blocked: Login Required");
                                            navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
                                            return;
                                        }
                                        setShowModal(true);
                                    }}
                                    disabled={product.quantity < 1}
                                    className="btn btn-primary"
                                    style={{
                                        padding: '0.75rem 1.5rem', borderRadius: '10px',
                                        fontWeight: 900, fontSize: '0.8rem', flex: 1,
                                        boxShadow: '0 10px 20px rgba(37,99,235,0.4)'
                                    }}
                                >
                                    {product.quantity < 1 ? 'STOCK DEPLETED' : 'SECURE IMPORT CHANNEL'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
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
                    .main-layout-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
                    .main-layout-grid > div { position: relative !important; top: 0 !important; }
                    h1 { font-size: 2rem !important; }
                }
                .market-input:focus {
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    );
};

export default ProductDetailsPage;

