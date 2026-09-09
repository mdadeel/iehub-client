import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiSearch,
  HiViewGrid,
  HiViewList,
  HiFilter,
  HiChevronDown,
  HiRefresh,
} from 'react-icons/hi';
import ProductCard from '../components/ProductCard';
import ProductRow from '../components/ProductRow';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { CATEGORIES } from '../lib/categories';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from '../components/ui/Table';

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [incotermFilter, setIncotermFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const categories = CATEGORIES;

  const incoterms = ['All', 'FOB', 'CIF', 'EXW', 'DDP'];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        category,
        sort: sortBy,
        incoterm: incotermFilter !== 'All' ? incotermFilter : undefined,
      };
      const { data } = await api.get('/products', { params });
      const productsArray = Array.isArray(data) ? data : data?.products || [];
      setProducts(productsArray);
    } catch (error) {
      console.error('Failed to fetch marketplace products', error);
      toast.error('Marketplace synchronization failed. Please retry.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, incotermFilter, sortBy]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchProducts, 350);
    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  return (
    <div className="container py-8 md:py-12 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border-default mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Marketplace Catalog
            </h1>
            <Badge variant="neutral" size="sm">
              {products.length} {products.length === 1 ? 'Listing' : 'Listings'}
            </Badge>
          </div>
          <p className="text-xs text-foreground-muted max-w-xl leading-relaxed">
            Verified international trade commodities, FOB pricing, and export supply positions.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-surface-subtle p-1 rounded-lg border border-border-default shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1 ${
              viewMode === 'grid'
                ? 'bg-surface text-foreground shadow-2xs font-medium'
                : 'text-foreground-muted hover:text-foreground'
            }`}
            title="Card Grid View"
          >
            <HiViewGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1 ${
              viewMode === 'table'
                ? 'bg-surface text-foreground shadow-2xs font-medium'
                : 'text-foreground-muted hover:text-foreground'
            }`}
            title="Data Table View"
          >
            <HiViewList className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <Input
            placeholder="Filter by commodity, SKU, or origin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Selector */}
          <div className="flex items-center gap-1.5 bg-surface border border-border-default rounded-md px-2.5 h-9 text-xs">
            <span className="text-foreground-muted text-[11px]">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-foreground font-medium outline-none cursor-pointer pr-1"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-surface text-foreground">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Incoterm Selector */}
          <div className="flex items-center gap-1.5 bg-surface border border-border-default rounded-md px-2.5 h-9 text-xs">
            <span className="text-foreground-muted text-[11px]">Incoterm:</span>
            <select
              value={incotermFilter}
              onChange={(e) => setIncotermFilter(e.target.value)}
              className="bg-transparent text-foreground font-medium outline-none cursor-pointer pr-1"
            >
              {incoterms.map((inc) => (
                <option key={inc} value={inc} className="bg-surface text-foreground">
                  {inc === 'All' ? 'All Terms' : inc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-surface border border-border-default rounded-md px-2.5 h-9 text-xs">
            <span className="text-foreground-muted text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-foreground font-medium outline-none cursor-pointer pr-1"
            >
              <option value="name" className="bg-surface text-foreground">Alphabetical (A-Z)</option>
              <option value="price-low" className="bg-surface text-foreground">Price: Low to High</option>
              <option value="price-high" className="bg-surface text-foreground">Price: High to Low</option>
            </select>
          </div>

          {(searchTerm || category !== 'All' || incotermFilter !== 'All' || sortBy !== 'name') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setCategory('All');
                setIncotermFilter('All');
                setSortBy('name');
              }}
              className="h-9 px-2.5 text-xs text-foreground-muted hover:text-foreground"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Main Content: Loading, Results, or Empty */}
      <AnimatePresence mode="wait">
        {loading ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-[4/3] rounded-lg bg-surface-subtle animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-surface-subtle animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-surface-subtle animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 rounded-lg border border-border-default bg-surface animate-pulse" />
              ))}
            </div>
          )
        ) : products.length > 0 ? (
          viewMode === 'grid' ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="table-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Commodity / SKU</TableHead>
                    <TableHead>Origin / Sector</TableHead>
                    <TableHead className="text-right">Available Volume</TableHead>
                    <TableHead className="text-right">Unit Price (FOB)</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <ProductRow
                      key={product._id || product.id}
                      product={product}
                    />
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )
        ) : (
          <EmptyState
            icon={HiFilter}
            title="No matching commodities found"
            description="No trade listings currently match your selected filters or search query. Try broadening your criteria."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setCategory('All');
                  setSortBy('name');
                }}
              >
                Clear all filters
              </Button>
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllProductsPage;
