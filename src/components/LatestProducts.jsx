import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { HiArrowRight } from 'react-icons/hi';

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data } = await api.get('/products');
        const productsArray = Array.isArray(data) ? data : data?.products || [];
        setProducts(productsArray.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch products', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <div className="w-8 h-8 border-2 border-border-default border-t-accent-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-foreground-muted">Loading live marketplace listings...</p>
      </div>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-surface border-b border-border-default">
      <div className="container max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="max-w-xl">
            <Badge variant="neutral" size="sm" className="mb-3 font-mono text-[11px]">
              Live marketplace — trade opportunities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              What you can source right now.
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              Verified lots with origin, MOQ, and inspection status visible before you issue a purchase order — not after.
            </p>
          </div>

          <Button variant="outline" size="sm" asChild className="shrink-0 gap-1.5 text-sm">
            <Link to="/products">
              <span>View all verified lots</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border-default rounded-lg">
            <p className="text-xs text-foreground-muted">No active listings currently registered.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestProducts;
