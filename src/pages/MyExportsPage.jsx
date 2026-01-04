import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { HiPencil, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

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
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
            <div className="card" style={{ maxWidth: '500px', width: '90%', padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Update Export Details</h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Product Name</label>
                        <input
                            type="text" required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="flex flex-col gap-1">
                            <label style={{ fontWeight: 600 }}>Price ($)</label>
                            <input
                                type="number" required step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label style={{ fontWeight: 600 }}>Quantity</label>
                            <input
                                type="number" required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ flex: 1, border: '1px solid #ddd' }}>Cancel</button>
                        <button type="submit" disabled={updating} className="btn btn-primary" style={{ flex: 1 }}>
                            {updating ? 'Updating...' : 'Update Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
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
            toast.error("Failed to load your exports");
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchExports();
    }, [fetchExports]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            setExports(exports.filter(item => item._id !== id));
            toast.success("Product deleted successfully.");
        } catch {
            toast.error("Failed to delete product");
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const { data } = await api.patch(`/products/${id}`, updatedData);
            setExports(exports.map(item => item._id === id ? data : item));
            toast.success("Product updated successfully!");
        } catch {
            toast.error("Failed to update product");
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading exports...</div>;

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 className="section-title">My <span style={{ color: 'var(--secondary)' }}>Exports</span></h1>

            {exports.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.7 }}>
                    <h3>You haven't listed any products yet.</h3>
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    {exports.map(item => (
                        <div key={item._id} className="card flex items-center justify-between" style={{ padding: '1rem' }}>
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                                <div>
                                    <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                        Available: <strong>{item.quantity}</strong> | Origin: {item.origin}
                                    </p>
                                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>${item.price.toFixed(2)}</div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedProduct(item)}
                                    className="btn"
                                    style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem' }}
                                    title="Update"
                                >
                                    <HiPencil size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="btn"
                                    style={{ background: '#fee2e2', color: '#dc2626', padding: '0.5rem' }}
                                    title="Delete"
                                >
                                    <HiTrash size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedProduct && (
                <UpdateModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default MyExportsPage;
