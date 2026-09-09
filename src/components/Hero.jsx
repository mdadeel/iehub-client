import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import {
  HiArrowRight,
  HiOfficeBuilding,
  HiEye,
  HiDocumentText,
  HiLockClosed,
  HiTruck,
  HiClipboardCheck,
  HiGlobeAlt,
} from 'react-icons/hi';

const journey = [
  { label: 'Supplier', status: 'Verified', icon: HiOfficeBuilding, doc: 'KYB · Colombo', progress: 'Done' },
  { label: 'Inspection', status: 'Passed', icon: HiEye, doc: 'SGS 99.2%', progress: 'Done' },
  { label: 'Purchase Order', status: 'Active', icon: HiDocumentText, doc: 'PO-849201', progress: 'Live' },
  { label: 'Escrow', status: 'Secured', icon: HiLockClosed, doc: '$450M+ held', progress: 'Held' },
  { label: 'Ocean Freight', status: 'In Transit', icon: HiTruck, doc: 'BL · MSCU 882194', progress: 'At sea' },
  { label: 'Customs', status: 'Cleared', icon: HiClipboardCheck, doc: 'EDi · NLRTM', progress: 'Cleared' },
  { label: 'Delivery', status: 'Arrived', icon: HiGlobeAlt, doc: 'POD · Rotterdam', progress: 'Done' },
];

const metrics = [
  { value: '2,500+', label: 'Verified Suppliers' },
  { value: '120+', label: 'Active Ports' },
  { value: '42', label: 'Countries' },
  { value: '$450M+', label: 'Trade Volume' },
];

const liveProof = [
  { k: 'Recent Supplier Activity', v: 'Ceylon Agri · SGS passed', t: '2h ago' },
  { k: 'Recent Shipments', v: 'MSCU 882194 · At sea → Rotterdam', t: '11m ago' },
  { k: 'Recent Purchase Orders', v: 'PO-849201 · FOB Colombo · $14.5k', t: '37m ago' },
  { k: 'Recent Port Arrivals', v: 'NLRTM · Berth 14 · Customs cleared', t: '1h ago' },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-canvas border-b border-border-default">
      <div className="container max-w-[1280px] relative pt-10 md:pt-14 pb-10 md:pb-12">
        {/* 1 — Trust Bar above headline */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-5 md:gap-8 text-[13px] md:text-[16px] text-foreground-muted mb-8 md:mb-10"
        >
          {metrics.map((m) => (
            <span key={m.label} className="flex items-baseline gap-1.5">
              <span className="text-[18px] md:text-[20px] font-bold tracking-tight text-foreground leading-none">{m.value}</span>
              <span className="text-[13px] md:text-[14px] font-medium text-foreground-muted">{m.label}</span>
            </span>
          ))}
        </motion.div>

        {/* 2 — Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="text-center max-w-[880px] mx-auto"
        >
          <h1 className="font-bold tracking-[-0.045em] text-foreground leading-[0.88] text-[44px] sm:text-[56px] md:text-[72px] lg:text-[84px] mb-5">
            Find verified suppliers.
            <br />
            Manage every shipment.
            <br />
            <span className="text-accent-primary">Control trade from one place.</span>
          </h1>

          {/* 3 — Supporting copy */}
          <p className="text-[18px] md:text-[20px] leading-[1.6] text-foreground-secondary max-w-[680px] mx-auto mb-7">
            Find export-ready suppliers, issue purchase orders, monitor cargo movement, manage customs paperwork, and track deliveries across global trade routes.
          </p>

          {/* 4 — CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 md:mb-12">
            <Button size="lg" asChild className="h-[52px] px-8 text-[16px] md:text-[17px] font-semibold gap-2 w-full sm:w-auto">
              <Link to="/products">
                Find Suppliers <HiArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-[52px] px-8 text-[16px] md:text-[17px] font-medium bg-surface w-full sm:w-auto">
              <a href="#trade-breaks">See How Trade Works</a>
            </Button>
          </div>
        </motion.div>

        {/* 5 — Centerpiece visual: horizontal trade journey */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="rounded-2xl border border-border-default bg-surface shadow-sm overflow-hidden">
            {/* Journey header */}
            <div className="px-4 sm:px-6 py-3 bg-surface-subtle border-b border-border-default flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-foreground-muted">Trade journey — live progress</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-foreground-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" /> Purchase order → Delivery
              </span>
            </div>

            {/* Horizontal steps — desktop */}
            <div className="hidden lg:flex items-stretch gap-0 px-3 py-5 relative">
              {/* Progress track */}
              <div className="absolute left-10 right-10 top-[34px] h-0.5 bg-border-default" />
              <div className="absolute left-10 top-[34px] h-0.5 bg-accent-primary w-[72%] opacity-80" />
              {journey.map((step, i) => {
                const Icon = step.icon;
                const isLive = step.progress === 'Live' || step.progress === 'At sea';
                const isDone = step.progress === 'Done' || step.progress === 'Cleared' || step.progress === 'Passed';
                return (
                  <div key={step.label} className="flex-1 flex flex-col items-center text-center px-2 relative">
                    <div
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center z-10 shrink-0 ${
                        isLive
                          ? 'bg-accent-primary border-accent-primary text-white shadow-sm'
                          : isDone
                            ? 'bg-status-success border-status-success text-white'
                            : 'bg-surface border-border-default text-foreground-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-bold tracking-wide uppercase text-foreground mt-2.5 leading-none whitespace-nowrap">{step.label}</div>
                    <div className={`text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded-full border whitespace-nowrap ${isLive ? 'bg-accent-subtle border-accent-primary/20 text-accent-primary' : isDone ? 'bg-status-success-bg border-status-success/20 text-status-success' : 'bg-surface-subtle border-border-subtle text-foreground-muted'}`}>
                      {step.status}
                    </div>
                    <div className="mt-2 w-full rounded-lg border border-border-subtle bg-canvas px-2 py-1.5 text-left">
                      <div className="text-[10px] font-mono text-foreground-muted leading-none">{step.doc}</div>
                      <div className="text-[11px] font-medium text-foreground leading-none mt-1">{step.progress}</div>
                    </div>
                    {i < journey.length - 1 && <span className="hidden xl:block absolute -right-2 top-[16px] text-border-default">→</span>}
                  </div>
                );
              })}
            </div>

            {/* Mobile — vertical stack */}
            <div className="lg:hidden divide-y divide-border-subtle">
              {journey.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="w-8 h-8 rounded-full bg-surface border border-border-default flex items-center justify-center text-foreground-muted shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-foreground leading-none">{step.label}</div>
                      <div className="text-[11px] font-mono text-foreground-muted mt-0.5">{step.doc} · {step.progress}</div>
                    </div>
                    <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded-full border bg-surface-subtle border-border-subtle text-foreground-muted shrink-0">{step.status}</span>
                  </div>
                );
              })}
            </div>

            {/* Footer helper */}
            <div className="px-4 sm:px-6 py-2.5 bg-surface-subtle/60 border-t border-border-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-foreground-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" /> Every stage has an icon, status, progress, and document preview.
              </span>
              <Link to="/products" className="text-accent-primary font-semibold hover:underline">Find suppliers for this journey →</Link>
            </div>
          </div>
        </motion.div>

        {/* 6 — Real trade proof under hero visual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mt-5 md:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {liveProof.map((item) => (
            <div key={item.k} className="flex items-center gap-3 p-3 rounded-xl border border-border-default bg-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold tracking-widest uppercase text-foreground-muted leading-none">{item.k}</div>
                <div className="text-[13px] font-medium text-foreground leading-tight mt-1 truncate">{item.v}</div>
              </div>
              <span className="text-[11px] font-mono text-foreground-muted shrink-0">{item.t}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
