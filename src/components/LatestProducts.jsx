import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { HiArrowRight } from 'react-icons/hi';

const LatestProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const { data } = await api.get('/products');
                const productsArray = Array.isArray(data) ? data : (data?.products || []);
                setProducts(productsArray.slice(0, 8)); // Show 8 for a better grid
            } catch (error) {
                console.error("Failed to fetch products", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) {
        return (
            <div className="container py-24 text-center">
                <div className="w-12 h-12 border-4 border-muted border-t-figma-blue rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Syncing Market Data...</p>
            </div>
        );
    }

    return (
        <section className="py-24 bg-muted/30">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                                Latest <span className="text-figma-blue">Products</span>
                            </h2>
                            <p className="text-muted-foreground font-medium text-lg">
                                Top-quality goods and industrial items available now for purchase across our global network.
                            </p>
                        </motion.div>
                    </div>
                    <Button variant="outline" asChild className="rounded-full font-bold border-2 hover:bg-figma-blue hover:text-white hover:border-figma-blue transition-all">
                        <Link to="/products" className="flex items-center gap-2">
                            View Marketplace <HiArrowRight />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>
                
                {products.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed rounded-3xl">
                        <p className="text-muted-foreground font-bold">No active listings found in the current cycle.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestProducts;
