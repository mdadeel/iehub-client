import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
        category: 'Spices', // Default
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
            toast.success("Product added successfully! It will appear on the marketplace.");
            setFormData({
                name: '', image: '', price: '', origin: '', rating: 5, quantity: '', category: 'Spices', description: ''
            });
            navigate('/my-exports');
        } catch (error) {
            console.error("Failed to add product", error);
            toast.error("Failed to add product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Add New Export</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.7 }}>
                    List your high-quality local products for the global market.
                </p>

                <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="flex flex-col gap-1" style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontWeight: 600 }}>Product Name</label>
                        <input
                            type="text" required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Pure Ceylon Cinnamon"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1" style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontWeight: 600 }}>Product Image (URL)</label>
                        <input
                            type="url" required
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Price ($)</label>
                        <input
                            type="number" required step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Origin Country</label>
                        <input
                            type="text" required
                            value={formData.origin}
                            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            placeholder="Ex: Sri Lanka"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Available Quantity</label>
                        <input
                            type="number" required
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            placeholder="Ex: 500"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label style={{ fontWeight: 600 }}>Rating (1-5)</label>
                        <input
                            type="number" min="1" max="5" required
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1" style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontWeight: 600 }}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your product..."
                            rows="3"
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd', fontFamily: 'inherit' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{ gridColumn: 'span 2', justifyContent: 'center', marginTop: '1rem', padding: '1rem', opacity: submitting ? 0.7 : 1 }}
                    >
                        {submitting ? 'Adding Product...' : 'Add Export Product'}
                    </button>
                </form>
            </div>
            <style>{`
        .dark .card { background: var(--bg-subtle-dark); color: white; }
        .dark input, .dark select, .dark textarea { background: #1e293b; color: white; border-color: #334155 !important; }
      `}</style>
        </div>
    );
};

export default AddExportPage;
