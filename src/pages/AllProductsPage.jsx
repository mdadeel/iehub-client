import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { HiSearch, HiFilter, HiSortAscending } from 'react-icons/hi';
import ProductCard from '../components/ProductCard';

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');

    const categories = ['All', 'Spices', 'Textiles', 'Beverages', 'Food', 'Eco-Friendly', 'Fashion', 'Tech', 'Other'];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = { search: searchTerm, category, sort: sortBy };
                const { data } = await api.get('/products', { params });
                // Ensure data is an array before setting products
                const productsArray = Array.isArray(data) ? data : (data?.products || []);
                setProducts(productsArray);
            } catch (error) {
                console.error("Failed to fetch products", error);
                toast.error("Telemetry error: Global market sync failed.");
                setProducts([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchProducts, 400);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, category, sortBy]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ paddingBottom: '4rem', paddingTop: '2rem' }}
        >
            <section>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.4rem', letterSpacing: '-1px' }}
                    >
                        Global <span style={{ color: 'var(--primary)' }}>Marketplace</span>
                    </motion.h1>
                    <p style={{ opacity: 0.5, fontSize: '1rem', fontWeight: 600 }}>Sourcing premium assets from verified international sectors.</p>
                </div>

                {/* Glass Filter Bar */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                    style={{
                        padding: '1.5rem',
                        marginBottom: '3rem',
                        background: 'var(--bg-glass)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '24px',
                        boxShadow: 'var(--shadow)'
                    }}
                >
                    <div className="grid" style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2.5rem',
                        alignItems: 'end'
                    }}>
                        <div className="flex flex-col gap-3">
                            <label style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.4 }}>
                                <HiSearch style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Identification
                            </label>
                            <input
                                type="text"
                                placeholder="Search products or origin..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="market-input"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.4 }}>
                                <HiFilter style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Classification
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="market-select"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.4 }}>
                                <HiSortAscending style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Telemetry Sort
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="market-select"
                            >
                                <option value="name">Product Name (A-Z)</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
                        {products.length} Opportunities Verified
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ textAlign: 'center', padding: '10rem 0' }}
                        >
                            <div className="spinner"></div>
                            <p style={{ marginTop: '1.5rem', opacity: 0.4, fontWeight: 600 }}>Synchronizing global inventory...</p>
                        </motion.div>
                    ) : products.length > 0 ? (
                        <motion.div
                            key="grid"
                            className="grid"
                            style={{
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '2rem'
                            }}
                        >
                            {products.map((product, index) => (
                                <motion.div
                                    key={product._id || product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '10rem 0' }}
                        >
                            <HiSearch size={80} style={{ opacity: 0.05, marginBottom: '2rem' }} />
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Zero Signals Detected</h2>
                            <p style={{ opacity: 0.4, marginBottom: '2.5rem', fontWeight: 600 }}>Modify your identification parameters to discover verified assets.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-primary"
                                onClick={() => { setSearchTerm(''); setCategory('All'); }}
                                style={{ padding: '1rem 2.5rem', fontWeight: 800 }}
                            >
                                RESET ALL PARAMETERS
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <style>{`
                .market-input, .market-select {
                    padding: 1.1rem 1.4rem;
                    border-radius: 16px;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    color: var(--text-body);
                    outline: none;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .market-input:focus, .market-select:focus { 
                    border-color: var(--primary); 
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                    background: var(--bg-inset);
                }
                .market-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.3)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1.25rem center;
                    background-size: 1.25rem;
                }
                .spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid var(--border-color);
                    border-top: 4px solid var(--primary);
                    border-radius: 50%;
                    animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                    margin: 0 auto;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </motion.div>
    );
};

export default AllProductsPage;
