import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  HiSearch,
  HiViewGrid,
  HiViewList,
  HiFilter,
  HiX,
  HiScale,
  HiCheckCircle,
  HiShieldCheck,
  HiArrowRight,
  HiRefresh,
} from 'react-icons/hi';
import ProductCard from '../components/ProductCard';
import ProductRow from '../components/ProductRow';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CATEGORIES, INCOTERMS } from '../lib/categories';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from '../components/ui/Table';

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial states from URL parameters for shareability
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialIncoterm = searchParams.get('incoterm') || 'All';
  const initialSort = searchParams.get('sort') || 'name';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [incotermFilter, setIncotermFilter] = useState(initialIncoterm);
  const [sortBy, setSortBy] = useState(initialSort);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Comparison State (max 3 commodities)
  const [comparedProducts, setComparedProducts] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const categories = ['All', ...CATEGORIES];
  const incoterms = ['All', ...INCOTERMS];

  // Sync state changes back to URL search params
  const updateUrlParams = useCallback((newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.category && newFilters.category !== 'All') params.set('category', newFilters.category);
    if (newFilters.incoterm && newFilters.incoterm !== 'All') params.set('incoterm', newFilters.incoterm);
    if (newFilters.sort && newFilters.sort !== 'name') params.set('sort', newFilters.sort);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: searchTerm || undefined,
        category: category !== 'All' ? category : undefined,
        sort: sortBy,
        incoterm: incotermFilter !== 'All' ? incotermFilter : undefined,
      };
      const { data } = await api.get('/products', { params });
      let items = Array.isArray(data) ? data : data?.products || [];

      // Strict client-side check: guarantee unrelated products never display under a selected category
      if (category !== 'All') {
        items = items.filter(
          (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
        );
      }
      if (incotermFilter !== 'All') {
        items = items.filter((p) => p.incoterm === incotermFilter);
      }

      setProducts(items);
    } catch (err) {
      console.error('Failed to fetch marketplace products', err);
      setError('Unable to synchronize marketplace positions. Please verify connection and retry.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, incotermFilter, sortBy]);

  // Debounce API calls and sync URL
  useEffect(() => {
    updateUrlParams({ search: searchTerm, category, incoterm: incotermFilter, sort: sortBy });
    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, category, incotermFilter, sortBy, fetchProducts, updateUrlParams]);

  // Comparison handler
  const handleToggleCompare = (product) => {
    const pId = String(product._id || product.id);
    const exists = comparedProducts.some((p) => String(p._id || p.id) === pId);

    if (exists) {
      setComparedProducts((prev) => prev.filter((p) => String(p._id || p.id) !== pId));
    } else {
      if (comparedProducts.length >= 3) {
        toast.error('Maximum 3 commodities can be compared side-by-side.');
        return;
      }
      setComparedProducts((prev) => [...prev, product]);
      toast.success(`Added ${product.name} to comparison.`);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setIncotermFilter('All');
    setSortBy('name');
  };

  const hasActiveFilters = useMemo(() => {
    return Boolean(searchTerm || category !== 'All' || incotermFilter !== 'All' || sortBy !== 'name');
  }, [searchTerm, category, incotermFilter, sortBy]);

  return (
    <div className="container py-8 md:py-12 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border-default mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Marketplace Sourcing
            </h1>
            <Badge variant="neutral" size="sm" className="font-mono">
              {loading ? 'Searching…' : `${products.length} Positions`}
            </Badge>
          </div>
          <p className="text-xs text-foreground-muted max-w-xl leading-relaxed">
            Verified international trade commodities, live FOB/CIF pricing, and export supply positions.
          </p>
        </div>

        {/* View Mode Switcher & Mobile Filter Trigger */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen((v) => !v)}
            className="md:hidden text-xs gap-1.5 h-8"
          >
            <HiFilter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </Button>

          <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-lg border border-border-default shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-surface text-foreground shadow-2xs font-medium'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
              title="Card Grid View"
              aria-label="Grid View"
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
              aria-label="Table View"
            >
              <HiViewList className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar (Desktop + Mobile Drawer) */}
      <div className={`space-y-3 mb-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="Search by commodity, SKU, or origin…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
              aria-label="Search commodities"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Selector */}
            <div className="flex items-center gap-1.5 bg-surface border border-border-default rounded-md px-2.5 h-9 text-xs">
              <span className="text-foreground-muted text-[11px]">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-foreground font-medium outline-none cursor-pointer pr-1"
                aria-label="Filter by Category"
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
                aria-label="Filter by Incoterm"
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
                aria-label="Sort products"
              >
                <option value="name" className="bg-surface text-foreground">Alphabetical (A-Z)</option>
                <option value="price-low" className="bg-surface text-foreground">Price: Low to High</option>
                <option value="price-high" className="bg-surface text-foreground">Price: High to Low</option>
              </select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 px-2.5 text-xs text-foreground-muted hover:text-foreground"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-foreground-muted text-[11px]">Active:</span>
            {category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-subtle border border-border-default text-[11px] text-foreground font-medium">
                Category: {category}
                <button type="button" onClick={() => setCategory('All')} className="hover:text-status-danger">✕</button>
              </span>
            )}
            {incotermFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-subtle border border-border-default text-[11px] text-foreground font-medium">
                Incoterm: {incotermFilter}
                <button type="button" onClick={() => setIncotermFilter('All')} className="hover:text-status-danger">✕</button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-subtle border border-border-default text-[11px] text-foreground font-medium">
                Search: &ldquo;{searchTerm}&rdquo;
                <button type="button" onClick={() => setSearchTerm('')} className="hover:text-status-danger">✕</button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[11px] text-accent-primary hover:underline ml-1 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Loading, Error, Results, or Empty */}
      <AnimatePresence mode="wait">
        {loading ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-[16/10] rounded-xl bg-surface-subtle animate-pulse border border-border-default" />
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
        ) : error ? (
          <div className="text-center py-16 px-4 rounded-xl border border-status-danger/20 bg-status-danger-bg/20 space-y-3">
            <div className="text-status-danger font-semibold text-sm">{error}</div>
            <Button variant="outline" size="sm" onClick={fetchProducts} className="gap-1.5">
              <HiRefresh className="w-3.5 h-3.5" />
              <span>Retry Synchronization</span>
            </Button>
          </div>
        ) : products.length > 0 ? (
          viewMode === 'grid' ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {products.map((product) => {
                const isCompared = comparedProducts.some(
                  (p) => String(p._id || p.id) === String(product._id || product.id)
                );
                return (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    isCompared={isCompared}
                    onToggleCompare={handleToggleCompare}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="table-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-border-default bg-surface overflow-x-auto shadow-2xs"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8 text-center">Cmp</TableHead>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Commodity / SKU</TableHead>
                    <TableHead>Origin / Sector</TableHead>
                    <TableHead className="text-right">Available Volume</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const isCompared = comparedProducts.some(
                      (p) => String(p._id || p.id) === String(product._id || product.id)
                    );
                    return (
                      <ProductRow
                        key={product._id || product.id}
                        product={product}
                        isCompared={isCompared}
                        onToggleCompare={handleToggleCompare}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </motion.div>
          )
        ) : (
          <div className="text-center py-20 px-4 rounded-xl border border-border-default bg-surface space-y-4">
            <div className="w-12 h-12 rounded-full bg-surface-subtle text-foreground-muted flex items-center justify-center mx-auto">
              <HiSearch className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">No matching trade positions found</h3>
              <p className="text-xs text-foreground-muted max-w-sm mx-auto mt-1">
                Try adjusting your search keywords, clearing selected category filters, or choosing different Incoterms.
              </p>
            </div>
            {hasActiveFilters && (
              <Button size="sm" variant="outline" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Comparison Dock */}
      <AnimatePresence>
        {comparedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-surface/95 backdrop-blur-md border border-border-default rounded-xl shadow-xl px-4 py-3 flex items-center gap-4 text-xs"
          >
            <div className="flex items-center gap-2 font-medium text-foreground">
              <HiScale className="w-4 h-4 text-accent-primary" />
              <span>
                Comparing <strong className="font-mono">{comparedProducts.length}</strong> of 3 items
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowComparisonModal(true)}
                className="h-8 px-3 text-xs font-semibold bg-accent-primary hover:bg-accent-hover text-accent-contrast shadow-2xs"
              >
                View Side-by-Side
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setComparedProducts([])}
                className="h-8 px-2 text-foreground-muted hover:text-foreground"
                aria-label="Clear comparison"
              >
                <HiX className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-Side Commodity Comparison Modal */}
      <AnimatePresence>
        {showComparisonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border-default rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 text-foreground"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6">
                <div className="flex items-center gap-2 text-base font-bold">
                  <HiScale className="w-5 h-5 text-accent-primary" />
                  <span>Commodity Comparison Specification</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowComparisonModal(false)}
                  className="text-foreground-muted hover:text-foreground p-1 text-sm"
                  aria-label="Close Comparison"
                >
                  ✕
                </button>
              </div>

              {/* Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparedProducts.map((p) => (
                  <div
                    key={p._id || p.id}
                    className="rounded-xl border border-border-default bg-canvas p-4 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-surface-subtle">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Badge variant="neutral" size="sm">{p.category}</Badge>
                        <h4 className="font-bold text-sm text-foreground mt-1.5">{p.name}</h4>
                        <div className="text-[11px] text-foreground-muted">{p.origin || 'Global'}</div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border-subtle text-xs">
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">Price:</span>
                          <span className="font-bold font-mono text-foreground">
                            ${p.price?.toLocaleString()} /{p.unit || 'Unit'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">Incoterm:</span>
                          <span className="font-semibold text-foreground">{p.incoterm || 'FOB'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">MOQ:</span>
                          <span className="font-mono text-foreground">
                            {p.moq?.toLocaleString() || 1} {p.unit || 'Unit'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">Available:</span>
                          <span className="font-mono text-foreground">
                            {p.quantity?.toLocaleString() || 0} {p.unit || 'Unit'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">Status:</span>
                          <span className="text-status-success font-medium flex items-center gap-1">
                            <HiShieldCheck className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border-subtle flex gap-2">
                      <Button
                        size="sm"
                        asChild
                        className="w-full text-xs font-semibold gap-1"
                      >
                        <a href={`/products/${p._id || p.id}`}>
                          <span>View Spec</span>
                          <HiArrowRight className="w-3 h-3" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleCompare(p)}
                        className="px-2.5 text-foreground-muted hover:text-status-danger"
                        title="Remove from comparison"
                      >
                        <HiX className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllProductsPage;
