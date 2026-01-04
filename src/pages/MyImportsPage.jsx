import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { HiTrash, HiEye } from 'react-icons/hi';
import toast from 'react-hot-toast';

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
                // Fetch imports by email
                const { data } = await api.get(`/imports/${user.email}`);
                setImports(data);
            } catch (error) {
                console.error("Failed to fetch imports", error);
                toast.error("Failed to load your imports");
            } finally {
                setLoading(false);
            }
        };

        fetchImports();
    }, [user]);

    const handleRemove = async (id) => {
        if (!window.confirm("Are you sure you want to remove this import?")) return;
        try {
            await api.delete(`/imports/${id}`);
            setImports(imports.filter(item => item._id !== id));
            toast.success("Import removed successfully.");
        } catch {
            toast.error("Failed to remove import");
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading imports...</div>;

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 className="section-title">My <span style={{ color: 'var(--primary)' }}>Imports</span></h1>

            {imports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <h3>You haven't imported any products yet.</h3>
                    <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Products</Link>
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    {imports.map(item => {
                        const product = item.productId || {};
                        return (
                            <div key={item._id} className="card flex items-center justify-between" style={{ padding: '1rem' }}>
                                <div className="flex items-center gap-4">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '80px', height: '80px', background: '#eee', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N/A</div>
                                    )}
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>{product.name || 'Unknown Product'}</h3>
                                        <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                            Imported Qty: <strong>{item.quantity}</strong> | Origin: {product.origin || 'N/A'}
                                        </div>
                                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>${(product.price || 0).toFixed(2)}</div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {product._id && (
                                        <button
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            className="btn"
                                            style={{ background: 'var(--bg-subtle-light)', padding: '0.5rem' }}
                                            title="View Details"
                                        >
                                            <HiEye size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemove(item._id)}
                                        className="btn"
                                        style={{ background: '#fee2e2', color: '#dc2626', padding: '0.5rem' }}
                                        title="Remove"
                                    >
                                        <HiTrash size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
        .dark .btn[style*="background: var(--bg-subtle-light)"] { background: #334155; color: white; }
        .dark .btn[style*="background: #fee2e2"] { background: #450a0a; color: #f87171; }
      `}</style>
        </div>
    );
};

export default MyImportsPage;
