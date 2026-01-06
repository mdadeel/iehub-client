import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LatestProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const { data } = await api.get('/products');
                // Ensure data is an array before setting products
                const productsArray = Array.isArray(data) ? data : (data?.products || []);
                setProducts(productsArray.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch products", error);
                setProducts([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '1.5rem', opacity: 0.4, fontWeight: 600 }}>Syncing latest opportunities...</p>
                <style>{`
                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 3px solid var(--border-color);
                        border-top: 3px solid var(--primary);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto;
                    }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <section style={{ padding: '8rem 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1.5px' }}
                    >
                        Market <span style={{ color: 'var(--primary)' }}>Opportunities</span>
                    </motion.h2>
                    <p style={{ opacity: 0.5, fontWeight: 600, fontSize: '1.1rem' }}>Identified high-yield assets currently available for acquisition</p>
                </div>

                <div className="grid" style={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '3rem'
                }}>
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id || product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '5rem' }}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                    >
                        <Link
                            to="/products"
                            className="btn btn-primary"
                            style={{
                                padding: '1.2rem 3.5rem',
                                fontWeight: 900,
                                letterSpacing: '1px',
                                boxShadow: '0 10px 30px -5px rgba(37, 99, 235, 0.3)'
                            }}
                        >
                            EXPLORE ALL ASSETS
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LatestProducts;
