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
                // Fetch all/latest. If backend supports sorting by date natively, good.
                // Our productRoutes.js defaults to createdAt: -1 (Newest first) so this is perfect.
                const { data } = await api.get('/products');
                setProducts(data.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>Loading latest opportunities...</div>;
    }

    return (
        <section>
            <div className="container">
                <h2 className="section-title">Latest Global <span style={{ color: 'var(--secondary)' }}>Opportunities</span></h2>

                <div className="grid" style={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
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

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link to="/products" className="btn btn-secondary" style={{ padding: '1rem 3rem' }}>
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestProducts;
