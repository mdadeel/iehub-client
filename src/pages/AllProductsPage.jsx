import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { HiSearch, HiFilter, HiSortAscending } from 'react-icons/hi';
import ProductCard from '../components/ProductCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

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

                const productsArray = Array.isArray(data) ? data : (data?.products || []);
                setProducts(productsArray);
            } catch (error) {
                console.error("Failed to fetch products", error);
                toast.error("Telemetry error: Global market sync failed.");
                setProducts([]);
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
            className="container py-24"
        >
            <div className="mb-12">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                    Global <span className="text-figma-blue">Marketplace</span>
                </h1>
                <p className="text-muted-foreground font-medium text-lg max-w-2xl">
                    Discover and acquire verified international assets with end-to-end synchronization.
                </p>
            </div>

            {/* Filter Bar */}
            <Card className="p-4 mb-12 bg-muted/30 border-none shadow-none">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                    <div className="grid gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Search Assets</label>
                        <div className="relative">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Identification..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-12 bg-background border-2 focus-visible:ring-figma-blue"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Classification</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="flex h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:border-figma-blue transition-colors appearance-none cursor-pointer"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Telemetry Sort</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:border-figma-blue transition-colors appearance-none cursor-pointer"
                        >
                            <option value="name">Product Name (A-Z)</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between md:justify-end lg:col-span-1">
                        <div className="text-right">
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verified Results</div>
                            <div className="text-2xl font-black text-figma-blue">{products.length}</div>
                        </div>
                    </div>
                </div>
            </Card>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-40 text-center"
                    >
                        <div className="w-12 h-12 border-4 border-muted border-t-figma-blue rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Synchronizing Global Inventory...</p>
                    </motion.div>
                ) : products.length > 0 ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {products.map((product, index) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-40 text-center border-4 border-dashed rounded-3xl"
                    >
                        <HiSearch className="w-16 h-16 text-muted mx-auto mb-6" />
                        <h2 className="text-3xl font-black tracking-tighter mb-4 text-foreground">Zero Signals Detected</h2>
                        <p className="text-muted-foreground font-medium mb-8">Modify your identification parameters to discover verified assets.</p>
                        <Button 
                            onClick={() => { setSearchTerm(''); setCategory('All'); }}
                            className="bg-figma-blue hover:bg-figma-blue/90 rounded-full font-black px-8 h-12"
                        >
                            RESET PARAMETERS
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AllProductsPage;
