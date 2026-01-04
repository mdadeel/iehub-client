import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { HiSearch, HiFilter, HiSortAscending } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');

    // Hardcoded categories to ensure they appear even if DB is empty initially
    const categories = ['All', 'Spices', 'Textiles', 'Beverages', 'Food', 'Eco-Friendly', 'Fashion', 'Tech', 'Other'];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    search: searchTerm,
                    category: category,
                    sort: sortBy
                };
                const { data } = await api.get('/products', { params });
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        // Debounce search slightly to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, category, sortBy]);

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <section style={{ paddingBottom: '2rem' }}>
                <h1 className="section-title">Global <span style={{ color: 'var(--secondary)' }}>Product Marketplace</span></h1>

                {/* Search and Filters Bar */}
                <div className="card" style={{ padding: '1.5rem', marginBottom: '3rem' }}>
                    <div className="grid" style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        alignItems: 'end'
                    }}>
                        {/* Search */}
                        <div className="flex flex-col gap-1">
                            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}><HiSearch /> Search Products</label>
                            <input
                                type="text"
                                placeholder="Ex: Cinnamon..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex flex-col gap-1">
                            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}><HiFilter /> Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex flex-col gap-1">
                            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}><HiSortAscending /> Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="price-low">Price (Low to High)</option>
                                <option value="price-high">Price (High to Low)</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <p style={{ marginBottom: '1.5rem', fontWeight: 600, opacity: 0.7 }}>
                    {loading ? 'Search products...' : `Showing ${products.length} products`}
                </p>

                {/* Products Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
                ) : (
                    <div className="grid" style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {products.map(product => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <h2>No products found matching your criteria.</h2>
                        <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => {
                            setSearchTerm('');
                            setCategory('All');
                        }}>Reset Filters</button>
                    </div>
                )}
            </section>

            <style>{`
        .dark select, .dark input { 
          background: #1e293b; 
          color: white; 
          border-color: #334155 !important; 
        }
      `}</style>
        </div>
    );
};

export default AllProductsPage;
