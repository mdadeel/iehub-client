import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiCloudUpload, HiCurrencyDollar, HiCube } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

const AddExportPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect guest users back to dashboard
    if (user?.isGuest) {
        useEffect(() => {
            toast.error("This feature is not available in demo mode. Please create an account.");
            navigate('/dashboard');
        }, [navigate]);

        return (
            <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
                <p>Redirecting...</p>
            </div>
        );
    }

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

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
            console.error("Failed to add product:", error.response?.data || error.message);
            const errorMessage = error.response?.status === 413
                ? "Image too large. Please use a smaller file."
                : "Asset integration failed. Verify network status.";
            toast.error(errorMessage);
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
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <motion.h1
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}
                        >
                            New Export <span style={{ color: 'var(--secondary)' }}>Listing</span>
                        </motion.h1>
                        <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>Register your goods on the global trade network.</p>
                    </div>

                    <motion.div
                        className="card"
                        style={{
                            padding: '3rem',
                            background: 'var(--bg-glass)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '24px',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* Image Upload Section */}
                            <div className="flex justify-center mb-4">
                                <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '20px', overflow: 'hidden', background: 'var(--bg-inset)', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <input type="file" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2" style={{ opacity: 0.5 }}>
                                            <HiCloudUpload size={40} />
                                            <span style={{ fontWeight: 600 }}>Click to upload product image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Ceylon Black Tea"
                                        className="input-field"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-field"
                                    >
                                        <option>Spices</option>
                                        <option>Tea & Coffee</option>
                                        <option>Textiles</option>
                                        <option>Rubber</option>
                                        <option>Coconut Products</option>
                                        <option>Gemstones</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="form-group">
                                    <label><HiCurrencyDollar style={{ marginRight: '5px', marginBottom: '-2px' }} /> Unit Price (USD)</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="input-field"
                                    />
                                </div>
                                <div className="form-group">
                                    <label><HiCube style={{ marginRight: '5px', marginBottom: '-2px' }} /> Available Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        placeholder="Total units"
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Origin</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.origin}
                                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description (Optional)</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe quality, certifications, etc."
                                    className="input-field"
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-primary w-full"
                                    style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 800, borderRadius: '12px', justifyContent: 'center' }}
                                >
                                    {submitting ? <div className="spinner-sm"></div> : 'Publish Listing'}
                                </button>
                            </div>
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
            </div>
        </motion.div>
    );
};

export default AddExportPage;
