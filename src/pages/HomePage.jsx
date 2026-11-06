import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SEOHead from '../components/SEOHead';
import api from '../utils/api';
import { MOCK_PRODUCTS } from '../data/mockProducts';
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
  'Spices',
  'Food',
  'Beverages',
  'Metals',
  'Industrial Materials',
  'Textiles',
];

const CAPABILITIES = [
  {
    title: 'Ocean freight',
    image: '/images/svc-ocean.jpg',
    alt: 'Container ship carrying export cargo on the open sea',
    copy: 'FCL and LCL sailings with named-port Incoterms. The bill of lading lands in your inbox before the vessel berths.',
    tag: 'FCL · LCL · Reefer',
  },
  {
    title: 'Air freight',
    image: '/images/svc-air.jpg',
    alt: 'Freighter aircraft being loaded with air cargo pallets at dawn',
    copy: 'Confirmed uplift for perishables and high-value lots, with temperature logs and uplift proof on arrival.',
    tag: 'Perishable · AOG',
  },
  {
    title: 'Road & inland',
    image: '/images/svc-road.jpg',
    alt: 'Container truck hauling an export container on a highway',
    copy: 'Container drayage from factory gate to terminal, then first-mile delivery at the discharge country.',
    tag: 'Drayage · Last mile',
  },
  {
    title: 'Warehousing & inspection',
    image: '/images/svc-warehouse.jpg',
    alt: 'Export pallets and cartons inside a distribution warehouse',
    copy: 'Bonded storage, pre-shipment assay sampling and photo-verified loading reports before the container seals.',
    tag: 'Bonded · Assay',
  },
];

const STATS = [
  { value: '120+', label: 'Discharge ports', note: 'UN/LOCODE mapped' },
  { value: '2,840', label: 'Vetted exporters', note: 'KYB level 3' },
  { value: '99.6%', label: 'On-time clearance', note: 'Trailing 12 months' },
  { value: '24/7', label: 'Trade desk', note: 'Human, not a bot' },
];

const WHY_POINTS = [
  {
    icon: HiClipboardCheck,
    title: 'Assayed before it is listed',
    copy: 'SGS or Bureau Veritas paperwork is attached to the lot, not promised in a WhatsApp thread.',
  },
  {
    icon: HiLockClosed,
    title: 'Escrow tied to the bill of lading',
    copy: 'Your deposit sits in segregated custody and only moves when the carrier documents are verified.',
  },
  {
    icon: HiScale,
    title: 'One contract, every Incoterm',
    copy: 'FOB, CIF, EXW and DDP priced side by side so landed cost is decided before the PO, not after.',
  },
  {
    icon: HiGlobeAlt,
    title: 'A named person on every order',
    copy: 'Each consignment gets a desk officer with a direct line, from booking through to discharge.',
  },
];

const CORRIDORS = [
  {
    lane: 'Trans-Eurasia',
    corridor: 'Haiphong (VN) → Rotterdam (NL)',
    transit: '22 days',
    commodity: 'Robusta coffee · Spices',
    carriers: 'MSC, Maersk',
    rate: '$1,420 / FEU',
    image: '/images/svc-ocean.jpg',
  },
  {
    lane: 'Trans-Pacific',
    corridor: 'Santos (BR) → Qingdao (CN)',
    transit: '34 days',
    commodity: 'Soybeans · Yellow corn',
    carriers: 'COSCO, CMA CGM',
    rate: '$1,850 / FEU',
    image: '/images/hero-port.jpg',
  },
  {
    lane: 'Southeast Asia–Americas',
    corridor: 'Ho Chi Minh (VN) → Los Angeles (US)',
    transit: '18 days',
    commodity: 'Jasmine rice · Natural rubber',
    carriers: 'ONE, Evergreen',
    rate: '$2,100 / FEU',
    image: '/images/cta-port-night.jpg',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'The assay certificate came attached to the lot, not three emails later. That alone cut two weeks off our approval cycle.',
    name: 'Farhana Islam',
    role: 'Head of Procurement',
    company: 'Delta Foods · Chattogram',
    initials: 'FI',
  },
  {
    quote:
      'We had a container held at Rotterdam. The desk officer had the corrected documents filed before our bank even opened.',
    name: 'Lukas Meier',
    role: 'Import Manager',
    company: 'Nordkorn GmbH · Hamburg',
    initials: 'LM',
  },
  {
    quote:
      'Escrow released exactly when the bill of lading cleared. No chasing, no advance wire to a broker we had never met.',
    name: 'Priya Raman',
    role: 'Category Director',
    company: 'Meridian Textiles · Chennai',
    initials: 'PR',
  },
];

const INDUSTRIES = [
  {
    name: 'Agriculture & agro-processing',
    copy: 'Rice, pulses, spices and oilseeds from audited cooperatives.',
    image: '/images/ind-agriculture.jpg',
    span: 'md:col-span-2 md:row-span-2',
    height: 'min-h-[280px] sm:min-h-[420px]',
  },
  {
    name: 'Textiles & apparel',
    copy: 'Cut-and-sew capacity with WRAP and BSCI audit trails.',
    image: '/images/ind-textiles.jpg',
    span: 'md:col-span-2',
    height: 'min-h-[200px]',
  },
  {
    name: 'Seafood & frozen',
    copy: 'Cold-chain certified shrimp and frozen lines.',
    image: '/images/ind-seafood.jpg',
    span: 'md:col-span-1',
    height: 'min-h-[200px]',
  },
  {
    name: 'Metals & minerals',
    copy: 'Cathodes, billets and scrap with assay on file.',
    image: '/images/com-copper.jpg',
    span: 'md:col-span-1',
    height: 'min-h-[200px]',
  },
  {
    name: 'Warehousing & ICDs',
    copy: 'Bonded sheds and inland container depots.',
    image: '/images/svc-warehouse.jpg',
    span: 'md:col-span-2',
    height: 'min-h-[200px]',
  },
];

const STANDARDS = [
  {
    title: 'ICC Incoterms® 2020',
    subtitle: 'Commercial trade terms',
    desc: 'Delivery obligations, risk transfer and insurance protocols standardized across FOB, CIF, EXW and DDP shipments.',
    code: 'ICC-2020',
  },
  {
    title: 'ICC UCP 600 rules',
    subtitle: 'Documentary credits',
    desc: 'Letters of credit, negotiable bills of lading and commercial invoices follow harmonized banking rules.',
    code: 'UCP-600',
  },
  {
    title: 'UN/LOCODE taxonomy',
    subtitle: 'Port identification',
    desc: 'Five-character United Nations port codes identify origin and discharge terminals across 120+ ports.',
    code: 'ISO-3166',
  },
  {
    title: 'Custodial escrow',
    subtitle: 'Bilateral settlement',
    desc: 'Buyer capital held in a segregated ledger until cargo documents and delivery sign-off are verified.',
    code: 'ESCROW',
  },
];

const TRUST_MARKS = [
  'ICC Incoterms 2020',
  'UCP 600',
  'SGS Inspection',
  'Bureau Veritas',
  'UN/LOCODE',
  'IATA CASS',
  'FIATA Forwarder',
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
        title="IEHUB | Verified Commodity Sourcing & Escrow-Protected Trade"
        description="Source lab-verified export commodities, lock Incoterms pricing and settle with escrow protection across 120+ global ports."
        canonicalUrl="https://iehub-client.vercel.app/"
        schemaData={homeSchema}
      />

      <Hero />

      {/* Accreditation strip */}
      <section className="border-b border-border-subtle bg-surface">
        <div className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-subtle sm:justify-between">
          {TRUST_MARKS.map((mark) => (
            <span key={mark} className="whitespace-nowrap">
              {mark}
            </span>
          ))}
        </div>
      </section>

      {/* ─────────────────────────  Capabilities  ───────────────────────── */}
      <section id="capabilities" className="section grid-lines bg-canvas">
        <div className="container">
          <div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-accent-primary">01</span>
                <span className="t-meta">What we do</span>
              </div>
              <h2 className="t-h2 reveal">
                From the origin floor to the port gate.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground-secondary">
                Four services under one contract — so nobody can hand your consignment to a
                different agent halfway across the ocean.
              </p>
            </div>
            <Link to="/products" className="link-underline shrink-0 text-sm">
              Explore all services <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((cap, i) => (
              <article
                key={cap.title}
                className="panel panel-lift group relative flex flex-col"
              >
                <span className="absolute inset-x-0 -top-px z-10 h-[2px] scale-x-0 bg-accent-primary transition-transform duration-300 group-hover:scale-x-100" />
                <div className="media aspect-[4/3]">
                  <img src={cap.image} alt={cap.alt} loading="lazy" />
                  <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center bg-accent-primary font-mono text-[13px] font-bold text-white">
                    0{i + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground-subtle">
                    {cap.tag}
                  </div>
                  <h3 className="t-h3 mt-2">{cap.title}</h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-secondary">
                    {cap.copy}
                  </p>
                  <Link
                    to="/products"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-primary"
                  >
                    Learn more <HiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Stats band  ───────────────────────── */}
      <section className="bg-[#101417] text-white">
        <div className="container grid grid-cols-2 gap-y-8 py-10 sm:py-12 lg:grid-cols-4 lg:gap-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-0 lg:px-10 ${i !== 0 ? 'lg:border-l lg:border-white/12' : ''} ${
                i === 2 ? 'lg:pl-10' : ''
              }`}
            >
              <div className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-white">
                {stat.label}
              </div>
              <div className="mt-1 text-[13px] text-white/45">{stat.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────  Why IEHUB  ───────────────────────── */}
      <section className="section bg-surface">
        <div className="container grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="media aspect-[4/5] w-full">
              <img
                src="/images/why-inspection.jpg"
                alt="Inspection officer checking export pallets against a loading plan"
                loading="lazy"
              />
            </div>
            <div className="panel absolute -bottom-6 -right-2 hidden w-44 p-4 shadow-float sm:block lg:-right-8 lg:w-52">
              <div className="font-mono text-2xl font-bold text-accent-primary">98.4%</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground-secondary">
                First-pass document approval
              </div>
            </div>
            <div className="absolute left-4 top-4 bg-[#101417]/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white backdrop-blur">
              Chattogram · loading bay 04
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-accent-primary">02</span>
              <span className="t-meta">Why IEHUB</span>
            </div>
            <h2 className="t-h2 reveal">
              Built for buyers who cannot afford surprises.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-foreground-secondary">
              Most cross-border losses are not market losses. They are document losses — a
              certificate that arrives late, a container that was never inspected, a deposit wired
              to a broker who stopped replying.
            </p>

            <div className="mt-8 space-y-6">
              {WHY_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="flex gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-accent-subtle text-accent-primary">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <div>
                      <h3 className="t-h3">{point.title}</h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-foreground-secondary">
                        {point.copy}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/about"
              className="mt-9 inline-flex items-center gap-2 border border-foreground px-6 py-3 text-[14px] font-semibold text-foreground transition-colors hover:bg-foreground hover:text-canvas"
            >
              How the platform works <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Market board  ───────────────────────── */}
      <section className="section border-t border-border-subtle bg-canvas">
        <div className="container">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-accent-primary">03</span>
                <span className="t-meta">Live trade board</span>
              </div>
              <h2 className="t-h2 reveal">Open export positions.</h2>
              <p className="mt-3 max-w-xl text-sm text-foreground-secondary">
                Active supply with assayed specs, named-port pricing and allocation available this
                month.
              </p>
            </div>
            <Link to="/products" className="link-underline shrink-0 text-sm">
              All {products.length || '30+'} lots <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Category tabs */}
          <div className="mb-5 flex items-center gap-6 overflow-x-auto border-b border-border-default pb-0 no-scrollbar">
            {CATEGORY_TABS.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative whitespace-nowrap pb-3 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    active
                      ? 'text-foreground'
                      : 'text-foreground-subtle hover:text-foreground-secondary'
                  }`}
                >
                  {cat}
                  {active && (
                    <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-accent-primary" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden shadow-card">
              <div className="grid grid-cols-1 gap-px bg-border-subtle sm:grid-cols-2 xl:grid-cols-4">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-full bg-surface px-6 py-14 text-center">
                      <div className="t-h3">No active lots under this category</div>
                      <p className="mx-auto mt-2 max-w-md text-[14px] text-foreground-secondary">
                        Allocation moves weekly. The desk can usually source off-market volume
                        inside three working days.
                      </p>
                      <Link to="/contact" className="link-underline mt-4 text-[14px]">
                        Ask for allocation <HiArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    filteredProducts.slice(0, 4).map((p) => {
                      const id = p._id || p.id;
                      const origin = p.origin || p.portOfOrigin || 'Global';
                      const incoterm = p.incoterm || 'FOB';
                      const unit = p.unit || 'MT';
                      const moq = p.moq || 1;
                      const isVerified =
                        p.verificationStatus === 'verified' || !p.verificationStatus;

                      return (
                        <Link
                          key={id}
                          to={`/products/${id}`}
                          className="group flex flex-col bg-surface transition-colors hover:bg-surface-subtle/60"
                        >
                          <div className="media relative aspect-[5/4] w-full">
                            {p.image ? (
                              <img src={p.image} alt="" loading="lazy" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.16em] text-foreground-muted">
                                Lot {String(id).slice(-4)}
                              </div>
                            )}
                            {isVerified && (
                              <span className="absolute left-3 top-3 inline-flex items-center gap-1 bg-surface/95 px-2 py-1 text-[11px] font-semibold text-status-success backdrop-blur">
                                <HiShieldCheck className="h-3.5 w-3.5" />
                                Lab verified
                              </span>
                            )}
                          </div>

                          <div className="flex flex-1 flex-col p-4">
                            <div className="t-meta">
                              {p.category}
                              {p.hsCode ? ` · HS ${p.hsCode}` : ''}
                            </div>
                            <h3 className="t-h3 mt-1.5 leading-snug group-hover:text-accent-primary">
                              {p.name}
                            </h3>

                            <div className="mt-3 flex items-baseline gap-1.5 font-mono">
                              <span className="text-[17px] font-bold text-foreground">
                                ${(p.price || 0).toLocaleString()}
                              </span>
                              <span className="text-[13px] text-foreground-muted">/{unit}</span>
                              <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.1em] text-accent-primary">
                                {incoterm}
                              </span>
                            </div>

                            <div className="mt-3 space-y-1.5 border-t border-border-subtle pt-3 text-[13px] text-foreground-secondary">
                              <div className="flex items-center gap-1.5">
                                <HiLocationMarker className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" />
                                <span className="truncate">{origin}</span>
                              </div>
                              <div className="flex items-center justify-between font-mono">
                                <span className="text-foreground-muted">MOQ</span>
                                <span className="font-semibold text-foreground">
                                  {moq.toLocaleString()} {unit}
                                </span>
                              </div>
                              <div className="flex items-center justify-between font-mono">
                                <span className="text-foreground-muted">Available</span>
                                <span className="font-semibold text-foreground">
                                  {(p.quantity || 0).toLocaleString()} {unit}
                                </span>
                              </div>
                            </div>

                            <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-accent-primary">
                              Inspect lot
                              <HiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>

            <div className="flex flex-col gap-2 border-t border-border-default bg-surface-subtle px-4 py-3 text-[13px] text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 font-mono">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isDbSynced ? 'bg-status-success' : 'bg-accent-primary'
                  }`}
                />
                {isDbSynced ? 'Live database synchronised' : 'Fast cache active · auto-syncing'}
              </span>
              <Link to="/products" className="font-semibold text-accent-primary hover:underline">
                Explore the full catalog →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Trade lanes  ───────────────────────── */}
      <section className="section border-t border-border-default bg-surface">
        <div className="container">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-accent-primary">04</span>
                <span className="t-meta">Terminal network</span>
              </div>
              <h2 className="t-h2 reveal">Lanes we are moving this week.</h2>
              <p className="mt-3 max-w-xl text-sm text-foreground-secondary">
                Direct liner routing from origin facility to primary discharge port — with the
                carrier and the rate visible before you book.
              </p>
            </div>
            <Link to="/shipping" className="link-underline shrink-0 text-sm">
              All corridors <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {CORRIDORS.map((c) => (
              <Link
                key={c.corridor}
                to="/shipping"
                className="panel panel-lift group flex flex-col"
              >
                <div className="media aspect-[16/9]">
                  <img src={c.image} alt="" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D10]/70 to-transparent" />
                  <span className="absolute left-3 top-3 bg-white/95 px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#14181B]">
                    {c.lane}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="font-mono text-[13px] uppercase tracking-[0.1em] text-white/80">
                      Transit
                    </span>
                    <span className="font-mono text-sm font-bold">{c.transit}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="t-h3 leading-snug">
                    {c.corridor}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-foreground-secondary">{c.commodity}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3">
                    <span className="text-[13px] text-foreground-muted">{c.carriers}</span>
                    <span className="font-mono text-[13px] font-bold text-foreground">
                      {c.rate}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Buyer quotes  ───────────────────────── */}
      <section className="section border-t border-border-subtle bg-canvas">
        <div className="container">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-accent-primary">05</span>
                <span className="t-meta">Trade desk in practice</span>
              </div>
              <h2 className="t-h2 reveal">What buyers say after month one.</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-display text-2xl font-bold text-foreground">4.9</div>
              <div className="text-[11px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-foreground-muted">
                Average buyer rating
                <br />
                over 1,240 settlements
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border-default md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex flex-col bg-surface p-6">
                <div className="font-display text-3xl leading-none text-accent-primary">“</div>
                <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-foreground-secondary">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border-subtle pt-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#101417] font-mono text-[13px] font-bold text-white">
                    {t.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold text-foreground">
                      {t.name}
                    </span>
                    <span className="block truncate text-[13px] text-foreground-muted">
                      {t.role} · {t.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Industries  ───────────────────────── */}
      <section className="section border-t border-border-default bg-surface">
        <div className="container">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-accent-primary">06</span>
                <span className="t-meta">Industries we serve</span>
              </div>
              <h2 className="t-h2 reveal">Sectors we know by name.</h2>
              <p className="mt-3 max-w-xl text-sm text-foreground-secondary">
                Category-specific paperwork, inspection norms and packaging rules — not a generic
                freight template.
              </p>
            </div>
            <Link to="/categories" className="link-underline shrink-0 text-sm">
              Browse categories <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {INDUSTRIES.map((ind) => (
              <Link
                key={ind.name}
                to="/categories"
                className={`group relative overflow-hidden ${ind.span} ${ind.height}`}
              >
                <img
                  src={ind.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="photo-scrim absolute inset-0" />
                <div className="relative flex h-full flex-col justify-end p-5">
                  <h3 className="text-base font-bold text-white">{ind.name}</h3>
                  <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-white/70">
                    {ind.copy}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
                    Explore <HiArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}

            <Link
              to="/contact"
              className="group flex min-h-[200px] flex-col justify-between bg-accent-primary p-6 text-white md:col-span-2"
            >
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  Off-market allocation
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold leading-tight">
                  Not seeing your category?
                </h3>
              </div>
              <div className="flex items-end justify-between gap-4">
                <p className="max-w-[18rem] text-[13px] leading-relaxed text-white/80">
                  Our desk sources outside the board every week. Send the spec and we will come back
                  with names.
                </p>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/40 transition-colors group-hover:bg-white group-hover:text-accent-primary">
                  <HiArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Governance  ───────────────────────── */}
      <section className="section border-t border-border-subtle bg-canvas">
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-accent-primary">07</span>
              <span className="t-meta">Regulatory framework</span>
            </div>
            <h2 className="t-h2 reveal">The paperwork is our problem.</h2>
            <p className="mt-3 text-sm text-foreground-secondary">
              Every contract and settlement on IEHUB follows published international trade rules —
              so your compliance team has something to point at.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border-default sm:grid-cols-2 lg:grid-cols-4">
            {STANDARDS.map((s, i) => (
              <div key={s.title} className="flex flex-col bg-surface p-6">
                <div className="flex items-start justify-between">
                  <span className="font-display text-2xl font-bold text-border-hover">
                    0{i + 1}
                  </span>
                  <span className="border border-border-default px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground-muted">
                    {s.code}
                  </span>
                </div>
                <h3 className="mt-4 text-[14px] font-bold text-foreground">{s.title}</h3>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-primary">
                  {s.subtitle}
                </div>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-foreground-secondary">
                  {s.desc}
                </p>
                <div className="mt-4 flex items-center gap-1.5 border-t border-border-subtle pt-3 text-[13px] font-medium text-status-success">
                  <HiShieldCheck className="h-3.5 w-3.5" />
                  Enforced on platform
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────  Closing CTA  ───────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0A0D10] text-white">
        <img
          src="/images/cta-port-night.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090B] via-[#07090B]/92 to-[#07090B]/55" />

        <div className="relative container py-16 sm:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="eyebrow eyebrow-light mb-5">Start a trade</div>
              <h2 className="t-h2 reveal">
                Ready to move your next consignment?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                Send us the commodity, the volume and the discharge port. You will get named
                exporters, assayed specs and a landed cost — usually within one working day.
              </p>
            </div>

            <div className="lg:col-span-5 lg:pl-6">
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  to="/contact"
                  className="inline-flex flex-1 items-center justify-center gap-2 bg-accent-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#9C1016]"
                >
                  Request a quote <HiArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex flex-1 items-center justify-center gap-2 border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5"
                >
                  Browse the board
                </Link>
              </div>
              <div className="mt-6 space-y-2 text-[13px] text-white/55">
                <div className="flex items-center gap-2">
                  <HiDocumentText className="h-4 w-4 shrink-0" /> No listing fee · clearance fee on
                  execution
                </div>
                <div className="flex items-center gap-2">
                  <HiTruck className="h-4 w-4 shrink-0" /> Reply within 4 working hours, Dhaka time
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
