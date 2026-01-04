import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { HiArrowLeft, HiCheckCircle, HiExclamation } from 'react-icons/hi';
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
            toast.success(`Successfully imported ${qty} units of ${product.name}!`);
            onSuccess(); // Refresh product data
            onClose();
        } catch (error) {
            console.error("Import failed", error);
            toast.error(error.response?.data?.message || "Import failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '90%', padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Import {product.name}</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8 }}>
                    Available Stock: <strong>{product.quantity}</strong> units
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Quantity to Import</label>
                        <input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: isOverLimit ? '2px solid var(--danger)' : '1px solid var(--border-color)'
                            }}
                        />
                        {isOverLimit && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>Cannot exceed available stock!</span>}
                    </div>

                    <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ flex: 1, border: '1px solid var(--border-color)' }}>Cancel</button>
                        <button
                            type="submit"
                            disabled={isOverLimit || qty < 1 || submitting}
                            className="btn btn-primary"
                            style={{ flex: 1, opacity: (isOverLimit || qty < 1 || submitting) ? 0.5 : 1 }}
                        >
                            {submitting ? 'Importing...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
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
            console.error(error);
            toast.error("Product not found");
            navigate('/products');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleImportClick = () => {
        if (!user) {
            toast.error("Please login to import products.");
            navigate("/login", { state: { from: { pathname: `/product/${id}` } } });
            return;
        }
        setShowModal(true);
    };

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading details...</div>;
    if (!product) return null;

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <button onClick={() => navigate(-1)} className="btn" style={{ marginBottom: '2rem', padding: '0.5rem 0' }}>
                <HiArrowLeft /> Back to Products
            </button>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                {/* Images Section */}
                <div style={{ position: 'relative' }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}
                    />
                    <div style={{
                        position: 'absolute', top: '1rem', left: '1rem',
                        background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 700
                    }}>
                        ${product.price.toFixed(2)}
                    </div>
                </div>

                {/* Info Section */}
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{product.name}</h1>

                    <div className="flex gap-4" style={{ marginBottom: '2rem' }}>
                        <span className="flex items-center gap-1" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                            <HiCheckCircle style={{ color: 'var(--accent)' }} /> {product.category}
                        </span>
                        <span className="flex items-center gap-1" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                            <HiExclamation style={{ color: 'var(--secondary)' }} /> Origin: {product.origin}
                        </span>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3>Overview</h3>
                        <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>{product.description}</p>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-surface)', border: 'none' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Import Specifications</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>• Instant sync with "My Imports"</li>
                            <li>• Real-time stock verification</li>
                            <li>• Secure trade documentation</li>
                            <li>• Current Available: <strong>{product.quantity} units</strong></li>
                        </ul>
                    </div>

                    <button
                        onClick={handleImportClick}
                        disabled={product.quantity < 1}
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: '2rem', padding: '1.2rem', fontSize: '1.10rem', opacity: product.quantity < 1 ? 0.5 : 1 }}
                    >
                        {product.quantity < 1 ? 'Out of Stock' : 'Import Now'}
                    </button>
                </div>
            </div>

            {showModal && (
                <ImportModal
                    product={product}
                    user={user}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchProduct}
                />
            )}
        </div>
    );
};

export default ProductDetailsPage;
