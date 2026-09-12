import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SEOHead from '../components/SEOHead';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  HiArrowRight,
  HiCheckCircle,
  HiShieldCheck,
  HiDocumentText,
  HiTruck,
  HiGlobeAlt,
  HiLockClosed,
  HiEye,
  HiClipboardCheck,
  HiOfficeBuilding,
  HiPhone,
  HiMail,
  HiChat,
  HiCreditCard,
  HiTable,
} from 'react-icons/hi';

// ─────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase text-accent-primary mb-4">
    <span className="w-6 h-px bg-accent-primary" />
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────
// S2 — How global trade usually breaks (network.jpg)
// ─────────────────────────────────────────────────────────────
const TradeBreaksSection = () => {
  const traditionalPain = [
    { label: 'Emails', detail: '12-person threads, no source of truth', icon: HiMail, color: 'bg-[#EA4335]', logo: '✉' },
    { label: 'Spreadsheets', detail: 'v14_final_FINAL.xlsx — counts drift', icon: HiTable, color: 'bg-[#34A853]', logo: '▦' },
    { label: 'WhatsApp', detail: 'Voice notes, forwarded PDFs', icon: HiChat, color: 'bg-[#25D366]', logo: '◐' },
    { label: 'Freight forwarders', detail: 'One quote per email, no visibility', icon: HiTruck, color: 'bg-[#4285F4]', logo: '▤' },
    { label: 'Banks', detail: 'Wire first, hope docs arrive', icon: HiCreditCard, color: 'bg-[#1A1F71]', logo: '$' },
    { label: 'Customs brokers', detail: 'Paper chase, demurrage daily', icon: HiDocumentText, color: 'bg-[#FF6D00]', logo: '⧉' },
  ];
  const unified = [
    { step: '01', title: 'One supplier directory', desc: 'Verified exporters with inspection reports attached — not a PDF in your inbox.' },
    { step: '02', title: 'One purchase order', desc: 'Digital PO with Incoterms, destination port, and payment terms. Stock allocated instantly.' },
    { step: '03', title: 'One escrow', desc: 'Funds held until the carrier validates the clean bill of lading. No advance wire to a stranger.' },
    { step: '04', title: 'One timeline', desc: 'Inspection → shipping → customs → delivery — tracked in the same place you bought it.' },
  ];

  return (
    <section id="trade-breaks" className="py-20 md:py-28 bg-surface border-b border-border-default overflow-hidden">
      <div className="container max-w-[1280px]">
        {/* Editorial heading — left aligned, not centered */}
        <div className="max-w-[720px] mb-12">
          <SectionLabel>Why importing and exporting is so painful</SectionLabel>
          <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-bold tracking-[-0.03em] text-foreground leading-[1.05] mb-4">
            How global trade usually breaks.
          </h2>
          <p className="text-[18px] leading-[1.6] text-foreground-secondary">
            Most businesses don&apos;t lose money on product. They lose it in the gaps — between the spreadsheet, the WhatsApp thread, the forwarder quote, and the customs desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 items-start">
          {/* Left — messy network visual — compact */}
          <div className="relative rounded-2xl overflow-hidden bg-canvas border border-border-default">
            <div className="aspect-[16/10] relative overflow-hidden">
              <img src="/images/network.jpg" alt="Messy network of emails, spreadsheets, and brokers" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              {/* Overlay — high contrast so texts visible */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                <div className="inline-flex items-center gap-2 bg-status-danger text-white text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-2 shadow-sm">
                  Traditional process
                </div>
                <p className="text-[12px] font-mono text-white leading-relaxed max-w-[520px] hidden sm:block drop-shadow">
                  Emails → Spreadsheets → WhatsApp → Freight forwarder → Bank → Customs broker — none agree on what shipped.
                </p>
              </div>
            </div>
            {/* Pain list — compact, logo-driven */}
            <div className="p-4 bg-surface grid grid-cols-1 sm:grid-cols-2 gap-3">
              {traditionalPain.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex gap-3 p-3 rounded-xl border border-border-subtle bg-canvas hover:border-border-default transition-colors">
                    <div className={`w-9 h-9 rounded-lg ${item.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-foreground leading-tight">{item.label}</div>
                      <div className="text-[12px] text-foreground-muted leading-[1.4] line-clamp-1">{item.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — unified workflow, clean */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl bg-accent-primary text-white p-7 md:p-8">
              <div className="inline-flex items-center gap-2 bg-white/15 text-white text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success" /> One unified workflow
              </div>
              <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight leading-[1.15] mb-3">
                One place where everything agrees.
              </h3>
              <p className="text-[15px] leading-[1.6] text-white/80 mb-6">
                Supplier, purchase order, inspection, payment, shipping, and customs — same record, same timeline, same truth.
              </p>
              <div className="space-y-5">
                {unified.map((u) => (
                  <div key={u.step} className="flex gap-4">
                    <span className="font-mono text-[12px] font-bold text-white/60 mt-0.5">{u.step}</span>
                    <div>
                      <div className="text-[15px] font-semibold leading-tight">{u.title}</div>
                      <div className="text-[14px] leading-[1.5] text-white/75 mt-1">{u.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild variant="secondary" className="mt-7 bg-white text-[#0F172A] border-white hover:bg-white/90 gap-2">
                <Link to="/products">
                  See the workflow in action <HiArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <p className="text-[13px] text-foreground-muted mt-4 px-1">
              Created tension → resolution. Left is the problem your procurement team feels today. Right is what changes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// S3 — From supplier to warehouse — HORIZONTAL JOURNEY MAP (no accordion)
// ─────────────────────────────────────────────────────────────
const SupplierToWarehouse = () => {
  const journey = [
    {
      n: '01',
      label: 'Supplier',
      visual: 'Factory',
      icon: HiOfficeBuilding,
      docs: 'KYB Certificate · Trade License',
      timeline: 'Day 0',
      risk: 'Shell company, sanctions',
      automates: 'Registry + OFAC screen',
      desc: 'Verified factory, not a trading email.',
    },
    {
      n: '02',
      label: 'Inspection',
      visual: 'Lab Report',
      icon: HiEye,
      docs: 'SGS Report · Lab Grade',
      timeline: 'Day 1–2',
      risk: 'Wrong spec, hidden moisture',
      automates: 'Lab result attached to lot',
      desc: 'Moisture, grade, moisture — before you pay.',
    },
    {
      n: '03',
      label: 'Purchase Order',
      visual: 'PO Document',
      icon: HiDocumentText,
      docs: 'PO-849201 · Incoterms',
      timeline: 'Day 2 · 5 min',
      risk: 'Vague terms, no recourse',
      automates: 'Digital PO, stock locked',
      desc: 'Digital PO — stock allocated instantly.',
    },
    {
      n: '04',
      label: 'Escrow',
      visual: 'Vault',
      icon: HiLockClosed,
      docs: 'Escrow Receipt · Milestone',
      timeline: 'Day 2–3',
      risk: 'Advance payment lost',
      automates: 'Funds held, not wired',
      desc: 'Funds held — released on B/L only.',
    },
    {
      n: '05',
      label: 'Shipping',
      visual: 'Port + Ship',
      icon: HiTruck,
      docs: 'BL · Container MSCU',
      timeline: 'Day 4–18',
      risk: 'Forwarder black box',
      automates: 'Vessel + berth tracked',
      desc: 'Container booked from your PO.',
    },
    {
      n: '06',
      label: 'Customs',
      visual: 'Checkpoint',
      icon: HiClipboardCheck,
      docs: 'Customs EDi · Phyto Cert',
      timeline: 'Day 18–20',
      risk: 'Hold, demurrage $150/day',
      automates: 'Clearance in timeline',
      desc: 'Phyto + duties — one timeline.',
    },
    {
      n: '07',
      label: 'Delivery',
      visual: 'Warehouse',
      icon: HiGlobeAlt,
      docs: 'Landed Cost · POD',
      timeline: 'Day 20–22',
      risk: 'Lost at port',
      automates: 'Arrival + audit trail',
      desc: 'Arrived, landed, confirmed.',
    },
  ];

  const [active, setActive] = useState(2);

  return (
    <section className="py-16 md:py-20 bg-canvas border-b border-border-default overflow-hidden">
      <div className="container max-w-[1280px]">
        <div className="max-w-[720px] mb-8">
          <SectionLabel>What actually happens after you place an order</SectionLabel>
          <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-bold tracking-[-0.03em] text-foreground leading-[1.05] mb-3">
            From supplier to warehouse — every stage, visible.
          </h2>
          <p className="text-[16px] leading-[1.6] text-foreground-secondary">
            Not documentation. A trade route you can follow — factory to warehouse — one stage at a time.
          </p>
        </div>

        {/* Horizontal journey — trade route visualization */}
        <div className="relative rounded-2xl border border-border-default bg-surface overflow-hidden">
          {/* Route bar */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-0 min-w-[860px] lg:min-w-0 relative px-4 lg:px-6 py-6">
              {/* Continuous route line */}
              <div className="absolute left-10 right-10 top-[44px] h-0.5 bg-border-default hidden lg:block" />
              <div
                className="absolute left-10 top-[44px] h-0.5 bg-accent-primary hidden lg:block transition-all duration-500"
                style={{ width: `${(active / (journey.length - 1)) * 84}%` }}
              />
              {journey.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === active;
                const isPast = i < active;
                return (
                  <button
                    key={step.n}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="flex-1 flex flex-col items-center text-center px-2 relative group"
                  >
                    {/* Visual node — factory/container/port/ship etc */}
                    <div
                      className={`w-11 h-11 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                        isActive
                          ? 'bg-accent-primary border-accent-primary text-white shadow-md scale-110'
                          : isPast
                            ? 'bg-status-success border-status-success text-white'
                            : 'bg-surface border-border-default text-foreground-muted group-hover:border-accent-primary/30'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-foreground-muted mt-1">{step.visual}</span>
                    <span className={`text-[13px] font-semibold leading-tight mt-1 ${isActive ? 'text-foreground' : 'text-foreground-secondary'}`}>{step.label}</span>
                    <span className={`text-[11px] font-mono mt-0.5 ${isActive ? 'text-accent-primary' : 'text-foreground-muted'}`}>{step.n}</span>
                    {/* Active indicator */}
                    {isActive && <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focus panel — one stage at a time */}
          <div className="border-t border-border-default bg-canvas">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 p-5 md:p-6"
            >
              {/* Left — what you see */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center">
                    {(() => {
                      const Icon = journey[active].icon;
                      return <Icon className="w-4 h-4" />;
                    })()}
                  </span>
                  <div>
                    <div className="text-[15px] font-semibold text-foreground leading-none">
                      {journey[active].n} · {journey[active].label} — {journey[active].visual}
                    </div>
                    <div className="text-[12px] text-foreground-muted">{journey[active].desc}</div>
                  </div>
                  <span className="ml-auto hidden sm:inline-flex text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-status-success text-white">
                    {journey[active].timeline}
                  </span>
                </div>
                <p className="text-[14px] leading-[1.6] text-foreground-secondary">{journey[active].desc} Focus on this stage — the rest dims so you learn the route, not the docs.</p>
                <div className="mt-4 flex gap-2">
                  <Link to="/products" className="text-[13px] font-semibold text-accent-primary hover:underline inline-flex items-center gap-1">
                    View this stage in a real PO <HiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              {/* Right — what matters */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border-default bg-surface p-3">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-foreground-muted">Required documents</div>
                  <div className="text-[13px] font-medium text-foreground mt-1 leading-tight">{journey[active].docs}</div>
                </div>
                <div className="rounded-xl border border-border-default bg-surface p-3">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-foreground-muted">Expected timeline</div>
                  <div className="text-[13px] font-medium text-foreground mt-1">{journey[active].timeline}</div>
                </div>
                <div className="rounded-xl border border-status-danger/20 bg-status-danger-bg p-3">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-status-danger">Risk removed</div>
                  <div className="text-[13px] font-medium text-foreground mt-1 leading-tight">{journey[active].risk}</div>
                </div>
                <div className="rounded-xl border border-accent-primary/20 bg-accent-subtle p-3">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-accent-primary">Platform automates</div>
                  <div className="text-[13px] font-medium text-foreground mt-1 leading-tight">{journey[active].automates}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <p className="text-[12px] text-foreground-muted mt-3 text-center">Hover or tap a stage — factory, container, port, ship, customs, warehouse — one at a time. Not a FAQ.</p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// S4 — Global trade network (globalmap.jpg)
// ─────────────────────────────────────────────────────────────
const GlobalNetwork = () => {
  const stats = [
    { value: '42+', label: 'Countries', detail: 'Export origins with verified suppliers' },
    { value: '120+', label: 'Ports', detail: 'UN/LOCODE terminals with live telemetry' },
    { value: '2,500+', label: 'Verified suppliers', detail: 'KYB-audited, facility-accredited' },
    { value: '31', label: 'Active lots', detail: 'Lots ready for purchase order today' },
  ];
  const corridors = [
    { route: 'Santos → Rotterdam', lane: 'Latin America–Europe · Santos / Paranaguá → Felixstowe / Valencia', time: '18–22 days' },
    { route: 'Singapore → Hamburg', lane: 'Asia–North Europe · Singapore / Port Klang → Rotterdam / Hamburg', time: '26–32 days' },
    { route: 'Shanghai → Long Beach', lane: 'Trans-Pacific · Shanghai / Ningbo → LA / Long Beach', time: '14–18 days' },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border-default bg-[#0B0F1A] text-white">
      {/* Map as background */}
      <div className="absolute inset-0">
        <img src="/images/globalmap.jpg" alt="Global trade network map" className="w-full h-full object-cover opacity-40" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1A]/40 via-[#0B0F1A]/60 to-[#0B0F1A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F1A]/70 via-transparent to-[#0B0F1A]/50" />
      </div>

      <div className="container max-w-[1280px] relative py-20 md:py-28">
        <div className="max-w-[720px] mb-10">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase text-white/70 mb-4">
            <span className="w-6 h-px bg-white/40" /> How big is this network?
          </div>
          <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-bold tracking-[-0.03em] leading-[1.05] mb-4">
            A live trade network — not a directory.
          </h2>
          <p className="text-[18px] leading-[1.6] text-white/70">
            Every port, supplier, and corridor you see here is a place you can actually trade through. No dead listings, no broker forwarding.
          </p>
        </div>

        {/* Stats — not static cards, map-anchored */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-white/[0.07] backdrop-blur border border-white/10 p-5">
              <div className="text-[32px] md:text-[36px] font-bold tracking-tight leading-none">{s.value}</div>
              <div className="text-[13px] font-semibold tracking-wide uppercase text-white/90 mt-2">{s.label}</div>
              <div className="text-[13px] leading-[1.5] text-white/60 mt-1">{s.detail}</div>
            </div>
          ))}
        </div>

        {/* Corridors — editorial rows on map */}
        <div className="rounded-2xl bg-white/[0.06] backdrop-blur border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-[12px] font-bold tracking-widest uppercase text-white/70">Active trade corridors</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" /> AIS live
            </span>
          </div>
          <div className="divide-y divide-white/10">
            {corridors.map((c) => (
              <div key={c.route} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[15px] font-semibold leading-tight">{c.route}</div>
                  <div className="text-[13px] text-white/60 mt-0.5">{c.lane}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[13px] font-mono text-white/80">{c.time}</span>
                  <span className="hidden sm:inline-flex px-2 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold tracking-wide uppercase">Optimal</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-white/[0.04] flex flex-wrap gap-3">
            <Button size="sm" variant="secondary" asChild className="bg-white text-[#0B0F1A] hover:bg-white/90">
              <Link to="/products">Find suppliers by corridor</Link>
            </Button>
            <Button size="sm" variant="ghost" asChild className="text-white border-white/20 hover:bg-white/10">
              <Link to="/shipping">Open live map</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// S5 — What can I source? (category editorial, not ecommerce)
// ─────────────────────────────────────────────────────────────
const WhatCanISource = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get('/products').then(({ data }) => {
      const arr = Array.isArray(data) ? data : data?.products || [];
      setProducts(arr.slice(0, 6));
    }).catch(() => {});
  }, []);

  const categories = [
    { name: 'Agriculture', buyers: 'Food manufacturers, commodity traders', moq: '1–20 MT', lead: '7–14 days', origins: 'Brazil, Colombia, Sri Lanka', destinations: 'EU, US, Middle East', color: 'bg-emerald-500' },
    { name: 'Industrial Materials', buyers: 'Manufacturers, construction', moq: '5–25 MT', lead: '14–21 days', origins: 'Malaysia, Indonesia', destinations: 'Global', color: 'bg-slate-500' },
    { name: 'Food Ingredients', buyers: 'Beverage, bakery, spice trade', moq: '1–10 MT', lead: '7–10 days', origins: 'India, Vietnam', destinations: 'EU, North America', color: 'bg-amber-500' },
    { name: 'Textiles', buyers: 'Apparel, home goods', moq: '500–2,000 units', lead: '21–30 days', origins: 'Bangladesh, Turkey', destinations: 'EU, US', color: 'bg-violet-500' },
    { name: 'Metals', buyers: 'Fabrication, wholesale', moq: '10–50 MT', lead: '14–28 days', origins: 'South Africa, Chile', destinations: 'Asia, EU', color: 'bg-zinc-500' },
    { name: 'Energy', buyers: 'Distributors, industrial buyers', moq: '20–100 MT', lead: '14–21 days', origins: 'UAE, Brazil', destinations: 'Global', color: 'bg-orange-500' },
  ];

  return (
    <section className="py-20 md:py-28 bg-surface border-b border-border-default">
      <div className="container max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start mb-10">
          <div>
            <SectionLabel>What can I source?</SectionLabel>
            <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-bold tracking-[-0.03em] text-foreground leading-[1.05] mb-4">
              Find export-ready inventory — not a product catalog.
            </h2>
            <p className="text-[18px] leading-[1.6] text-foreground-secondary">
              Each category below is a sourcing lane: typical buyers, minimum order, lead time, and where it actually ships from and to. Built for procurement, not shopping.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild className="gap-2">
                <Link to="/products">See available inventory <HiArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button variant="outline" asChild className="bg-surface">
                <Link to="/categories">Browse all categories</Link>
              </Button>
            </div>
          </div>
          {/* Live proof — subtle, not hero */}
          <div className="rounded-2xl border border-border-default bg-canvas p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-bold tracking-widest uppercase text-foreground-muted">Live lots right now</span>
              <span className="text-[11px] font-mono text-foreground-muted">{products.length} verified · updated today</span>
            </div>
            {products.length ? (
              <div className="space-y-3">
                {products.map((p) => (
                  <Link key={p._id} to={`/products/${p._id}`} className="flex gap-3 p-3 rounded-xl border border-border-default bg-surface hover:border-accent-primary/30 transition-colors group">
                    <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover border border-border-subtle shrink-0" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold text-foreground leading-tight truncate group-hover:text-accent-primary transition-colors">{p.name}</div>
                      <div className="text-[12px] text-foreground-muted mt-0.5">{p.origin || 'Global'} · {p.category} · <span className="font-mono font-semibold text-foreground">${p.price?.toLocaleString()} FOB</span></div>
                    </div>
                    <HiArrowRight className="w-4 h-4 text-border-default group-hover:text-accent-primary shrink-0 mt-2" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-[14px] text-foreground-muted border border-dashed border-border-default rounded-xl">Loading live lots…</div>
            )}
            <Link to="/products" className="mt-4 inline-flex text-[13px] font-semibold text-accent-primary hover:underline items-center gap-1">
              View all 31 verified lots <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Editorial category rows — asymmetrical, not a uniform card grid */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name} className="grid grid-cols-1 lg:grid-cols-[220px_1fr_auto] gap-4 lg:gap-6 p-5 md:p-6 rounded-2xl border border-border-default bg-surface hover:border-border-hover hover:shadow-sm transition-all items-center">
              <div className="flex items-center gap-3">
                <span className={`w-1 h-10 rounded-full ${cat.color} shrink-0`} />
                <div>
                  <div className="text-[18px] font-semibold tracking-tight text-foreground leading-none">{cat.name}</div>
                  <div className="text-[12px] font-mono text-foreground-muted mt-1">{cat.buyers}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
                <div><div className="font-semibold tracking-wide uppercase text-[11px] text-foreground-muted">MOQ</div><div className="font-medium text-foreground mt-1">{cat.moq}</div></div>
                <div><div className="font-semibold tracking-wide uppercase text-[11px] text-foreground-muted">Lead time</div><div className="font-medium text-foreground mt-1">{cat.lead}</div></div>
                <div><div className="font-semibold tracking-wide uppercase text-[11px] text-foreground-muted">Export origins</div><div className="text-foreground-muted mt-1 leading-tight">{cat.origins}</div></div>
                <div><div className="font-semibold tracking-wide uppercase text-[11px] text-foreground-muted">Popular destinations</div><div className="text-foreground-muted mt-1 leading-tight">{cat.destinations}</div></div>
              </div>
              <Link to={`/products?category=${encodeURIComponent(cat.name)}`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-primary hover:underline shrink-0 lg:justify-end">
                Source {cat.name.toLowerCase()} <HiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// S6 — Why buyers trust — RISK SHIELD + Traditional vs Protected
// ─────────────────────────────────────────────────────────────
const TrustArchitecture = () => {
  const protections = [
    { label: 'Supplier Verification', risk: 'Unknown supplier → counterparty loss', protection: 'KYB + sanctions + facility audit', outcome: 'Trade with a real factory', pos: 'top' },
    { label: 'Inspection Reports', risk: 'Wrong spec on arrival', protection: 'SGS / BV attached to lot', outcome: 'Spec matches contract' },
    { label: 'Trade Documents', risk: 'Missing BOL → demurrage', protection: 'PO generates BOL correctly', outcome: 'Clearance first time' },
    { label: 'Escrow Protection', risk: 'Advance payment lost', protection: 'Held until B/L validated', outcome: 'Pay on proof, not promise' },
    { label: 'Shipment Tracking', risk: 'Black box for 18 days', protection: 'Vessel + berth in PO', outcome: 'Know before supplier does' },
    { label: 'Compliance', risk: 'HS code, duties wrong', protection: 'Incoterms® 2020 + SOLAS', outcome: 'No penalties' },
  ];

  return (
    <section className="py-20 md:py-28 bg-canvas border-b border-border-default overflow-hidden">
      <div className="container max-w-[1280px]">
        <div className="max-w-[720px] mb-10">
          <SectionLabel>What protects my money and shipment?</SectionLabel>
          <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-bold tracking-[-0.03em] text-foreground leading-[1.05] mb-4">
            Risk disappears layer by layer — until only delivery remains.
          </h2>
          <p className="text-[18px] leading-[1.6] text-foreground-secondary">
            Not a feature list. A protection system — each layer answers: what risk exists, what protection exists, what outcome improves.
          </p>
        </div>

        {/* Risk shield visualization — center Successful Delivery */}
        <div className="relative rounded-2xl border border-border-default bg-surface overflow-hidden mb-10">
          <div className="px-4 sm:px-6 py-3 bg-surface-subtle border-b border-border-default flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-foreground-muted">Protection shield — 6 layers around delivery</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-foreground-muted">
              <span className="w-2 h-2 rounded-full bg-accent-primary" /> Shield active
            </span>
          </div>

          {/* Shield diagram — desktop circular, mobile stacked */}
          <div className="relative p-6 md:p-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-subtle/40 via-transparent to-transparent">
            {/* Center */}
            <div className="flex justify-center">
              <div className="w-[200px] text-center">
                <div className="w-28 h-28 mx-auto rounded-full bg-accent-primary text-white flex flex-col items-center justify-center shadow-lg border-4 border-accent-subtle">
                  <HiCheckCircle className="w-7 h-7 mb-1" />
                  <span className="text-[11px] font-bold tracking-widest uppercase leading-none">Successful</span>
                  <span className="text-[14px] font-bold leading-none">Delivery</span>
                </div>
                <p className="text-[11px] font-mono text-foreground-muted mt-2">All layers hold → delivery confirmed</p>
              </div>
            </div>

            {/* Protection ring — 6 nodes around center */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8 max-w-[960px] mx-auto">
              {protections.map((p) => (
                <div key={p.label} className="relative rounded-xl border border-border-default bg-surface p-4 hover:border-accent-primary/30 hover:shadow-sm transition-all text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-surface-subtle border border-border-default flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                    </span>
                    <span className="text-[12px] font-semibold tracking-tight text-foreground">{p.label}</span>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <div className="flex gap-1.5 text-[11px] leading-tight">
                      <span className="font-bold tracking-widest uppercase text-status-danger shrink-0">Risk:</span>
                      <span className="text-foreground-muted">{p.risk}</span>
                    </div>
                    <div className="flex gap-1.5 text-[11px] leading-tight">
                      <span className="font-bold tracking-widest uppercase text-accent-primary shrink-0">Shield:</span>
                      <span className="text-foreground">{p.protection}</span>
                    </div>
                    <div className="flex gap-1.5 text-[11px] leading-tight">
                      <span className="font-bold tracking-widest uppercase text-status-success shrink-0">Outcome:</span>
                      <span className="text-foreground-muted">{p.outcome}</span>
                    </div>
                  </div>
                  {/* Connector dot */}
                  <span className="hidden lg:block absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-border-default" />
                </div>
              ))}
            </div>

            {/* Subtle connecting lines — desktop only */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[340px] pointer-events-none border border-dashed border-border-default/40 rounded-[40px]" />
          </div>
        </div>

        {/* Traditional vs Protected — flowchart comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traditional Trade — red */}
          <div className="rounded-2xl border border-status-danger/20 bg-status-danger-bg overflow-hidden">
            <div className="px-5 py-3 bg-status-danger text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Traditional Trade — email + wire</span>
            </div>
            <div className="p-5 space-y-0 bg-surface">
              {[
                { step: 'Unknown Supplier', note: 'No registry check' },
                { step: 'Advance Payment', note: 'Wire before documents' },
                { step: 'Missing Documents', note: 'BOL retyped, errors' },
                { step: 'Customs Delay', note: 'Hold 9 days, $150/day' },
                { step: 'Loss', note: 'Dispute, no audit trail', last: true },
              ].map((s, i) => (
                <div key={s.step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border ${s.last ? 'bg-status-danger text-white border-status-danger' : 'bg-surface border-status-danger/30 text-status-danger'}`}>
                      {i + 1}
                    </div>
                    {i < 4 && <div className="w-px flex-1 bg-status-danger/20 my-1" />}
                  </div>
                  <div className={`pb-4 ${i === 4 ? 'pb-0' : ''}`}>
                    <div className="text-[13px] font-semibold text-foreground leading-tight">{s.step}</div>
                    <div className="text-[12px] text-foreground-muted">{s.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Protected Trade — green/accent */}
          <div className="rounded-2xl border border-accent-primary/20 bg-accent-subtle overflow-hidden">
            <div className="px-5 py-3 bg-accent-primary text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Protected Trade — IEHUB</span>
            </div>
            <div className="p-5 space-y-0 bg-surface">
              {[
                { step: 'Verified Supplier', note: 'KYB + facility audit' },
                { step: 'Inspection', note: 'SGS passed, attached to lot' },
                { step: 'Escrow', note: 'Funds held until B/L validated' },
                { step: 'Tracking', note: 'Vessel + customs in timeline' },
                { step: 'Successful Delivery', note: 'Landed, documented, confirmed', last: true },
              ].map((s, i) => (
                <div key={s.step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border ${s.last ? 'bg-status-success text-white border-status-success' : 'bg-accent-subtle text-accent-primary border-accent-primary/20'}`}>
                      {s.last ? <HiCheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    {i < 4 && <div className="w-px flex-1 bg-accent-primary/20 my-1" />}
                  </div>
                  <div className={`pb-4 ${i === 4 ? 'pb-0' : ''}`}>
                    <div className="text-[13px] font-semibold text-foreground leading-tight">{s.step}</div>
                    <div className="text-[12px] text-foreground-muted">{s.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[11px] font-mono text-foreground-muted text-center mt-4">Left: what happens with email + wire. Right: what happens when the shield holds. Risk → Protection → Outcome — without reading a feature list.</p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// S7 — Real customer stories (timeline Problem → Action → Outcome)
// ─────────────────────────────────────────────────────────────
const CustomerStories = () => {
  const stories = [
    {
      persona: 'Importer',
      name: 'Thorne Logistics · UK',
      role: 'Director of Procurement',
      problem: 'Three weeks of bank-guarantee paperwork for every FOB container. One typo meant restarting the whole chain.',
      action: 'Moved to digital purchase orders with ICC Incoterms and escrow — same FOB terms, 5-minute issuance.',
      outcome: '60% faster sourcing cycle',
      metric: '-18 days',
      detail: 'From inquiry to PO now under 48 hours. Audit trail accepted by their bank without re-keying.',
    },
    {
      persona: 'Exporter',
      name: 'Ceylon Agri Exports · LK',
      role: 'Export Manager',
      problem: 'One lot, 12 forwarding emails to prove SGS grade. Buyers asked the same questions every time.',
      action: 'Listed the lot once with SGS report, facility audit, and FOB Colombo pricing attached.',
      outcome: '12 new destination countries in one quarter',
      metric: '+12 markets',
      detail: 'First quarter after listing. Average time to first PO: 6 days.',
    },
    {
      persona: 'Procurement team',
      name: 'Med Foods Consortium · EU',
      role: 'Supply Chain Lead',
      problem: 'Inspection, PO, and BOL lived in three inboxes. Customs rejected one manifest — container sat 9 days.',
      action: 'Moved inspection, PO, and bill of lading into one purchase-order timeline.',
      outcome: 'Zero customs rejections since migration',
      metric: '0 rejections',
      detail: 'Demurrage down to near-zero. Every document generated from the same PO record.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-surface border-b border-border-default">
      <div className="container max-w-[1280px]">
        <div className="max-w-[720px] mb-12">
          <SectionLabel>Real customers, measured outcomes</SectionLabel>
          <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-bold tracking-[-0.03em] text-foreground leading-[1.05] mb-4">
            What changed after they moved off spreadsheets.
          </h2>
          <p className="text-[18px] leading-[1.6] text-foreground-secondary">
            Not testimonials — operational results. Each story is a timeline: problem → action → outcome, with numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-border-default bg-canvas overflow-hidden flex flex-col"
            >
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="accent" size="sm" className="font-mono text-[10px]">{s.persona}</Badge>
                  <span className="text-[11px] text-foreground-muted">{s.role}</span>
                </div>
                <div className="text-[13px] font-semibold text-foreground leading-tight">{s.name}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[20px] font-bold tracking-tight text-accent-primary leading-none">{s.metric}</span>
                  <span className="text-[10px] font-semibold tracking-wide uppercase text-foreground-muted leading-tight">{s.outcome}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="px-5 pb-5 space-y-3 flex-1">
                {[
                  { label: 'Problem', text: s.problem, dot: 'bg-status-danger' },
                  { label: 'Action', text: s.action, dot: 'bg-accent-primary' },
                  { label: 'Outcome', text: s.detail, dot: 'bg-status-success' },
                ].map((row) => (
                  <div key={row.label} className="flex gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${row.dot} mt-2 shrink-0`} />
                    <div>
                      <div className="text-[10px] font-bold tracking-widest uppercase text-foreground-muted">{row.label}</div>
                      <div className="text-[12px] leading-[1.5] text-foreground-secondary mt-0.5">{row.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-2.5 bg-surface-subtle border-t border-border-subtle flex items-center justify-between">
                <span className="text-[11px] font-medium text-foreground-muted">Read full story</span>
                <Link to="/about" className="text-[12px] font-semibold text-accent-primary hover:underline inline-flex items-center gap-1">
                  Case study <HiArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// S8 — Trade Desk (human support)
// ─────────────────────────────────────────────────────────────
const TradeDeskSection = () => {
  const specialists = [
    { name: 'Aisha Khan', role: 'Trade Specialist', focus: 'Supplier verification & KYB', initials: 'AK', color: 'bg-violet-500' },
    { name: 'Marcus Thorne', role: 'Logistics Lead', focus: 'Vessel booking & port ops', initials: 'MT', color: 'bg-emerald-600' },
    { name: 'Elena Rossi', role: 'Documentation', focus: 'BOL, certificates & customs docs', initials: 'ER', color: 'bg-amber-600' },
    { name: 'Devin Chen', role: 'Compliance', focus: 'Incoterms, duties & HS codes', initials: 'DC', color: 'bg-slate-700' },
  ];

  return (
    <section className="py-20 md:py-28 bg-canvas border-b border-border-default">
      <div className="container max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.9fr] gap-10 lg:gap-12 items-start">
          <div>
            <SectionLabel>Who helps me if something goes wrong?</SectionLabel>
            <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-bold tracking-[-0.03em] text-foreground leading-[1.05] mb-4">
              Talk to a trade specialist — not a ticket queue.
            </h2>
            <p className="text-[18px] leading-[1.6] text-foreground-secondary mb-8">
              When a container is stuck, you need a person who knows ports, documents, and carriers — not a chatbot. Every account gets a trade desk with real responsibilities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specialists.map((s) => (
                <div key={s.name} className="flex gap-3 p-4 rounded-xl border border-border-default bg-surface">
                  <div className={`w-11 h-11 rounded-full ${s.color} text-white flex items-center justify-center font-bold text-[13px] shrink-0`}>
                    {s.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-foreground leading-tight">{s.name}</div>
                    <div className="text-[12px] font-medium text-accent-primary">{s.role}</div>
                    <div className="text-[12px] text-foreground-muted mt-0.5 leading-tight">{s.focus}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-surface border border-border-default p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div className="flex items-center gap-3 text-[14px] text-foreground-secondary">
                <HiPhone className="w-5 h-5 text-accent-primary" />
                <span>Live during port hours · Avg response &lt; 2 hours</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link to="/contact">Talk to a trade specialist</Link>
                </Button>
                <Button size="sm" variant="outline" asChild className="bg-surface">
                  <Link to="/contact">
                    <HiMail className="w-4 h-4" /> Email trade desk
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Support workflow — editorial, not a card grid — aligns with h2 */}
          <div className="rounded-2xl bg-[#0B1220] text-white border border-white/10 p-7 md:p-8 lg:mt-12 lg:sticky lg:top-24">
            <h3 className="text-[22px] font-bold tracking-tight leading-tight mb-2">How support actually works.</h3>
            <p className="text-[14px] leading-[1.6] text-white/70 mb-6">No deflect-to-help-center. Each step has a named owner.</p>
            <div className="space-y-5">
              {[
                { step: 'You message the trade desk', desc: 'From your purchase order — the context (PO, lot, vessel) is already attached. No re-explaining.' },
                { step: 'A specialist owns the case', desc: 'Trade, logistics, documentation, or compliance — routed to the person who can actually fix it.' },
                { step: 'They work the port, not the inbox', desc: 'Carrier, customs, and inspection — coordinated directly. You watch the timeline update.' },
                { step: 'Closure with a document', desc: 'Resolution is a document or milestone — not a “closed” ticket.' },
              ].map((item, idx) => (
                <div key={item.step} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-[14px] font-semibold leading-tight">{item.step}</div>
                    <div className="text-[13px] leading-[1.6] text-white/65 mt-1">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-[12px] text-white/60">
              <HiShieldCheck className="w-4 h-4 text-status-success" />
              Support is part of the platform — not an upsell.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// S9 — Final CTA (conversion-focused, human)
// ─────────────────────────────────────────────────────────────
const FinalCTA = () => (
  <section className="relative overflow-hidden bg-[#0B1220] text-white">
    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/15 via-transparent to-transparent pointer-events-none" />
    <div className="container max-w-[1280px] relative py-16 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center">
        <div>
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold tracking-[-0.03em] leading-[1.05] mb-4">
            Find verified suppliers. See available inventory. Talk to a trade specialist.
          </h2>
          <p className="text-[16px] md:text-[17px] leading-[1.6] text-white/70 max-w-[560px]">
            Stop managing trade across spreadsheets, emails, freight forwarders, and disconnected systems. Run sourcing, procurement, logistics, and customs from one platform.
          </p>
        </div>
        <div className="lg:text-right">
          <div className="inline-flex flex-col gap-3 w-full sm:w-auto">
            <Button size="lg" variant="secondary" asChild className="h-12 px-7 text-[15px] font-semibold gap-2 bg-white text-[#0F172A] border-white hover:bg-white/90 justify-center">
              <Link to="/products">
                Find verified suppliers <HiArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="h-12 px-7 text-[15px] font-medium text-white border border-white/20 hover:bg-white/10 justify-center">
              <Link to="/products">See available inventory</Link>
            </Button>
            <div className="flex gap-3">
              <Button variant="ghost" asChild className="flex-1 text-white border border-white/15 hover:bg-white/10">
                <Link to="/contact">Talk to a trade specialist</Link>
              </Button>
              <Button variant="ghost" asChild className="flex-1 text-white border border-white/15 hover:bg-white/10">
                <Link to="/contact">Book a sourcing consultation</Link>
              </Button>
            </div>
          </div>
          <p className="text-[12px] text-white/50 mt-4 lg:text-right">2,500+ exporters · 120+ ports · $450M+ escrow cleared</p>
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
const HomePage = () => {
  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://iehub-client.vercel.app/#organization',
        name: 'IEHUB Global Trade Network',
        url: 'https://iehub-client.vercel.app',
        logo: 'https://iehub-client.vercel.app/logo.png',
        description: 'Global B2B commodity marketplace and ocean trade logistics infrastructure.',
        knowsAbout: ['International Trade', 'Incoterms 2020', 'Commercial Escrow', 'Ocean Logistics'],
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
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="IEHUB | Global B2B Commodity Marketplace & Trade Infrastructure"
        description="Source verified international commodity suppliers, issue binding commercial purchase orders under ICC Incoterms 2020, and track ocean shipments to port arrival."
        canonicalUrl="https://iehub-client.vercel.app/"
        schemaData={homeSchema}
      />
      <Hero />
      <TradeBreaksSection />
      <SupplierToWarehouse />
      <GlobalNetwork />
      <WhatCanISource />
      <TrustArchitecture />
      <CustomerStories />
      <TradeDeskSection />
      <FinalCTA />
    </div>
  );
};

export default HomePage;
