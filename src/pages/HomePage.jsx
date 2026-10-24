import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SEOHead from '../components/SEOHead';
import api from '../utils/api';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { Badge } from '../components/ui/Badge';
import {
  HiArrowRight,
  HiShieldCheck,
  HiLocationMarker,
  HiDocumentText,
  HiTruck,
  HiLockClosed,
  HiClipboardCheck,
  HiScale,
  HiGlobeAlt,
} from 'react-icons/hi';

const CATEGORY_TABS = [
  'All',
  'Agriculture',
  'Industrial Materials',
  'Food Ingredients',
  'Metals',
  'Energy',
];

const CORRIDORS = [
  {
    lane: 'Trans-Eurasia',
    corridor: 'Haiphong (VN) → Rotterdam (NL)',
    transit: '22 Days Transit',
    commodity: 'Grade 1 Robusta Coffee · Spices',
    carriers: 'MSC, Maersk',
    rate: 'FCL $1,420 / FEU',
  },
  {
    lane: 'Trans-Pacific',
    corridor: 'Santos (BR) → Qingdao (CN)',
    transit: '34 Days Transit',
    commodity: 'Non-GMO Soybeans · Yellow Corn',
    carriers: 'COSCO, CMA CGM',
    rate: 'FCL $1,850 / FEU',
  },
  {
    lane: 'Southeast Asia–Americas',
    corridor: 'Ho Chi Minh (VN) → Los Angeles (US)',
    transit: '18 Days Transit',
    commodity: 'Jasmine Rice · RSS3 Natural Rubber',
    carriers: 'ONE, Evergreen',
    rate: 'FCL $2,100 / FEU',
  },
];

const STANDARDS = [
  {
    title: 'ICC Incoterms® 2020',
    subtitle: 'Commercial Trade Terms',
    desc: 'Standardized delivery obligations, freight risk transfer, and insurance protocols across FOB, CIF, EXW, and DDP shipments.',
    code: 'ICC-2020',
  },
  {
    title: 'ICC UCP 600 Rules',
    subtitle: 'Documentary Credits & B/L',
    desc: 'Harmonized international banking rules governing letters of credit, negotiable Bills of Lading, and commercial invoices.',
    code: 'UCP-600',
  },
  {
    title: 'UN/LOCODE Taxonomy',
    subtitle: 'Global Port Identification',
    desc: 'Standardized 5-character United Nations port codes identifying origin and discharge maritime terminals across 120+ ports.',
    code: 'ISO-3166',
  },
  {
    title: 'Fiduciary Escrow Custody',
    subtitle: 'Bilateral Settlement Protocol',
    desc: 'Buyer capital held in segregated custody ledger until carrier bill of lading and port delivery sign-off are verified.',
    code: 'ESCROW-LEDGER',
  },
];

const HomePage = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDbSynced, setIsDbSynced] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let hasTriggered = false;

    const fetchDatabaseProducts = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      window.removeEventListener('scroll', handleScrollTrigger);
      window.removeEventListener('wheel', handleScrollTrigger);
      window.removeEventListener('touchmove', handleScrollTrigger);

      api
        .get('/products')
        .then(({ data }) => {
          if (!isMounted) return;
          const items = Array.isArray(data) ? data : data?.products || [];
          if (items.length > 0) {
            setProducts(items);
            setIsDbSynced(true);
          }
        })
        .catch((err) => {
          console.debug('Background DB fetch deferred, continuing with instant mock lots', err);
        });
    };

    const handleScrollTrigger = () => {
      if (window.scrollY > 20 || document.documentElement.scrollTop > 20) {
        fetchDatabaseProducts();
      }
    };

    window.addEventListener('scroll', handleScrollTrigger, { passive: true });
    window.addEventListener('wheel', handleScrollTrigger, { passive: true });
    window.addEventListener('touchmove', handleScrollTrigger, { passive: true });

    // Fallback: If user stays idle on the hero without scrolling, start loading real data after 3.5s
    const idleTimer = setTimeout(() => {
      fetchDatabaseProducts();
    }, 3500);

    return () => {
      isMounted = false;
      window.removeEventListener('scroll', handleScrollTrigger);
      window.removeEventListener('wheel', handleScrollTrigger);
      window.removeEventListener('touchmove', handleScrollTrigger);
      clearTimeout(idleTimer);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products.slice(0, 8);
    return products
      .filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase())
      .slice(0, 8);
  }, [products, selectedCategory]);

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://iehub-client.vercel.app/#organization',
        name: 'IEHUB Global Trade Network',
        url: 'https://iehub-client.vercel.app',
        description:
          'Institutional B2B commodity trading platform and international trade infrastructure.',
        knowsAbout: [
          'International Trade',
          'Incoterms 2020',
          'Commercial Escrow',
          'Commodity Markets',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://iehub-client.vercel.app/#website',
        url: 'https://iehub-client.vercel.app',
        name: 'IEHUB',
        publisher: { '@id': 'https://iehub-client.vercel.app/#organization' },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <SEOHead
        title="IEHUB | Institutional Commodity Marketplace & International Trade OS"
        description="Source verified export-ready commodities, execute bilateral purchase orders under ICC Incoterms 2020, and manage milestone escrow settlement across 120+ global ports."
        canonicalUrl="https://iehub-client.vercel.app/"
        schemaData={homeSchema}
      />

      {/* Hero Section */}
      <Hero />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: Commodity Market Board (High Signal Data Table)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 border-b border-border-default bg-surface">
        <div className="container max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-mono font-semibold uppercase text-accent-primary tracking-wider mb-1">
                Live Trade Board
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Verified Export Commodity Positions
              </h2>
              <p className="text-xs sm:text-sm text-foreground-muted mt-1 max-w-2xl">
                Active commercial supply positions with verified lab assays, live FOB/CIF pricing, and immediate stock allocation.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-primary hover:underline shrink-0"
            >
              <span>View All {products.length || '30+'} Marketplace Lots</span>
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-4 border-b border-border-subtle">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-foreground text-canvas font-semibold'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface-subtle'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Commodity Market Board Table */}
          <div className="border border-border-default rounded-lg overflow-hidden bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-subtle border-b border-border-default text-foreground-muted font-mono uppercase text-[11px]">
                    <th className="py-3 px-4 font-semibold">Commodity &amp; Spec</th>
                    <th className="py-3 px-4 font-semibold">Origin &amp; Port</th>
                    <th className="py-3 px-4 font-semibold">Available Volume</th>
                    <th className="py-3 px-4 font-semibold">Incoterm Price</th>
                    <th className="py-3 px-4 font-semibold">Inspection</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-foreground-muted">
                        No active lots currently listed under this category.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const id = p._id || p.id;
                      const origin = p.origin || p.portOfOrigin || 'Global';
                      const incoterm = p.incoterm || 'FOB';
                      const unit = p.unit || 'MT';
                      const moq = p.moq || 1;
                      const isVerified = p.verificationStatus === 'verified' || !p.verificationStatus;

                      return (
                        <tr
                          key={id}
                          className="hover:bg-surface-subtle/70 transition-colors group"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt=""
                                  className="w-9 h-9 rounded object-cover border border-border-subtle shrink-0"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded bg-surface-subtle border border-border-subtle flex items-center justify-center font-mono text-[10px] text-foreground-muted shrink-0">
                                  LOT
                                </div>
                              )}
                              <div className="min-w-0">
                                <Link
                                  to={`/products/${id}`}
                                  className="font-semibold text-foreground group-hover:text-accent-primary truncate block"
                                >
                                  {p.name}
                                </Link>
                                <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted mt-0.5">
                                  <span>{p.category}</span>
                                  {p.hsCode && (
                                    <>
                                      <span>·</span>
                                      <span className="font-mono">HS {p.hsCode}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-foreground-secondary">
                            <div className="flex items-center gap-1">
                              <HiLocationMarker className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
                              <span className="truncate">{origin}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono">
                            <div className="font-semibold text-foreground">
                              {(p.quantity || 0).toLocaleString()} {unit}
                            </div>
                            <div className="text-[11px] text-foreground-muted">
                              MOQ: {moq.toLocaleString()} {unit}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono">
                            <div className="font-bold text-foreground">
                              ${(p.price || 0).toLocaleString()}
                              <span className="font-normal text-foreground-muted text-[11px] ml-0.5">
                                /{unit}
                              </span>
                            </div>
                            <div className="text-[11px] font-semibold text-accent-primary">
                              {incoterm} Named Port
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-status-success bg-status-success-bg px-2 py-0.5 rounded border border-status-success/20">
                                <HiShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                <span>SGS Lab Verified</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-foreground-muted">
                                Standard Review
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <Link
                              to={`/products/${id}`}
                              className="inline-flex items-center gap-1 font-semibold text-xs text-accent-primary hover:underline"
                            >
                              <span>Inspect</span>
                              <HiArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="py-3 px-4 bg-surface-subtle border-t border-border-default flex items-center justify-between text-xs text-foreground-muted font-mono">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isDbSynced ? 'bg-status-success' : 'bg-accent-primary'}`} />
                <span>{isDbSynced ? 'Live Database Synchronized' : 'Fast Cache Active · Auto-Syncing'}</span>
              </span>
              <Link to="/products" className="text-accent-primary font-semibold hover:underline">
                Explore Full Catalog →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: Institutional Trade Execution Architecture
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 border-b border-border-default bg-canvas">
        <div className="container max-w-7xl">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-mono font-semibold uppercase text-accent-primary tracking-wider mb-1">
              Bilateral Execution Model
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              How International Trade Executes on IEHUB
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted mt-2">
              Structured trade architecture eliminating email chain fragmentation, wire-transfer defaults, and documentation discrepancies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-border-default bg-surface p-5 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-accent-primary">01 / ASSAY</span>
                  <HiClipboardCheck className="w-5 h-5 text-foreground-muted" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">
                  Pre-Shipment Lab Verification
                </h3>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  Every commodity lot requires accredited lab certificates (SGS, Bureau Veritas) documenting moisture, defect limits, purity, and crop grade before listing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-foreground-muted">
                Audit Trail Attached to Lot
              </div>
            </div>

            <div className="border border-border-default bg-surface p-5 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-accent-primary">02 / CONTRACT</span>
                  <HiDocumentText className="w-5 h-5 text-foreground-muted" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">
                  Bilateral Digital Purchase Orders
                </h3>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  Binding commercial contracts codifying Incoterms® 2020 delivery terms, named port of destination, laycan window, and packaging unit specifications.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-foreground-muted">
                Atomic Inventory Allocation
              </div>
            </div>

            <div className="border border-border-default bg-surface p-5 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-accent-primary">03 / ESCROW</span>
                  <HiLockClosed className="w-5 h-5 text-foreground-muted" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">
                  Custodial Escrow Protection
                </h3>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  Buyer commercial payments are held securely in a neutral fiduciary escrow ledger. Exporters receive guaranteed settlement without buyer payment default risk.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-foreground-muted">
                Zero Direct Unprotected Wires
              </div>
            </div>

            <div className="border border-border-default bg-surface p-5 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-accent-primary">04 / CLEARANCE</span>
                  <HiTruck className="w-5 h-5 text-foreground-muted" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">
                  Ocean Telemetry &amp; Settlement
                </h3>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  Vessel IMO, container BIC, and digital negotiable Bill of Lading verification. Consignee delivery sign-off at the discharge terminal triggers automated escrow payout.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-foreground-muted">
                Dual Sign-Off Settlement
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: Maritime Corridors & Global Terminal Network
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 border-b border-border-default bg-surface">
        <div className="container max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-mono font-semibold uppercase text-accent-primary tracking-wider mb-1">
                Terminal Infrastructure
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Active Maritime Trade Corridors
              </h2>
              <p className="text-xs sm:text-sm text-foreground-muted mt-1 max-w-xl">
                Direct containerized liner routing connecting origin facilities directly to primary international discharge ports.
              </p>
            </div>

            <Link
              to="/shipping"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-primary hover:underline shrink-0"
            >
              <span>Explore Ocean Logistics Telemetry</span>
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORRIDORS.map((c) => (
              <div
                key={c.corridor}
                className="border border-border-default bg-surface rounded-lg p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-accent-primary font-semibold">{c.lane}</span>
                    <span className="text-foreground-muted">{c.transit}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    {c.corridor}
                  </h3>
                  <p className="text-xs text-foreground-secondary mt-1">
                    {c.commodity}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
                  <span className="text-foreground-muted">{c.carriers}</span>
                  <span className="font-semibold text-foreground">{c.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: Institutional Governance & Compliance Standards
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 border-b border-border-default bg-canvas">
        <div className="container max-w-7xl">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-mono font-semibold uppercase text-accent-primary tracking-wider mb-1">
              Regulatory Framework
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Institutional Trade Governance Standards
            </h2>
            <p className="text-xs sm:text-sm text-foreground-muted mt-2">
              Every transaction, contract, and settlement executed on the platform adheres to global trade law standards and fiduciary compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STANDARDS.map((s) => (
              <div
                key={s.title}
                className="border border-border-default bg-surface p-5 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-subtle border border-border-subtle text-foreground-muted">
                      {s.code}
                    </span>
                    <HiScale className="w-4 h-4 text-foreground-muted" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">
                    {s.title}
                  </h3>
                  <div className="text-[11px] font-mono text-accent-primary mb-2">
                    {s.subtitle}
                  </div>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-status-success flex items-center gap-1">
                  <HiShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Platform Standard Enforced</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: Institutional CTA Strip (Flat, High Contrast, Solid)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-16 bg-[#0B1220] text-white">
        <div className="container max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold uppercase bg-white/10 text-[#60A5FA] border border-white/15 mb-3">
                Institutional Onboarding
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Execute Cross-Border Commodity Trades With Full Recourse
              </h2>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl">
                Source verified export lots, issue binding purchase orders under standardized Incoterms, and eliminate counterparty wire default risk through fiduciary escrow.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to="/products"
                className="px-5 py-2.5 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs sm:text-sm text-center transition-colors shadow-sm"
              >
                Access Marketplace Lots
              </Link>
              <Link
                to="/contact"
                className="px-5 py-2.5 rounded border border-white/20 hover:bg-white/10 text-white font-medium text-xs sm:text-sm text-center transition-colors"
              >
                Contact Port Trade Desk
              </Link>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-white/50">
            <div>
              Platform Fiduciary Protocol: Zero advance wire transfers · Settlements processed under bilateral escrow rules.
            </div>
            <div>
              No recurring subscription fees · Standard clearance fees apply
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
