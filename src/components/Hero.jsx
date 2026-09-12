import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { HiArrowRight, HiArrowDown, HiCheckCircle, HiDocumentText, HiUserGroup } from 'react-icons/hi';

const Hero = () => {
  const scrollToChapterOne = (e) => {
    e.preventDefault();
    const el = document.getElementById('story-chapter-1');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-canvas border-b border-border-default pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      <div className="container max-w-[1280px]">
        {/* Top Editorial Header & Intro */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Editorial Label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center gap-2 font-mono text-[11px] font-semibold tracking-widest uppercase text-accent-primary"
          >
            <span className="w-6 h-px bg-accent-primary" />
            <span>A SHIPMENT STORY / IEHUB</span>
            <span className="w-6 h-px bg-accent-primary" />
          </motion.div>

          {/* Single Ink Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08] text-balance"
          >
            Someone is counting
            <br />
            on this shipment.
          </motion.h1>

          {/* Human Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto"
          >
            A buyer needs stock. A supplier has it ready. IEHUB connects the people, paperwork, and progress in between.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          >
            <Button
              size="lg"
              asChild
              className="h-11 px-6 text-xs sm:text-sm font-semibold bg-accent-primary hover:bg-accent-hover text-accent-contrast shadow-sm gap-2"
            >
              <Link to="/products">
                Start sourcing <HiArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToChapterOne}
              className="h-11 px-6 text-xs sm:text-sm font-medium border-border-default bg-surface hover:bg-surface-hover text-foreground shadow-2xs gap-2"
            >
              <span>Follow one shipment</span>
              <HiArrowDown className="w-3.5 h-3.5 text-foreground-muted" />
            </Button>
          </motion.div>
        </div>

        {/* Wide Visual Story Scene: Ceylon Cinnamon Journey */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-12 sm:mt-16"
        >
          {/* Scene Border Frame */}
          <div className="rounded-2xl border border-border-default bg-surface p-4 sm:p-6 lg:p-8 shadow-sm relative overflow-hidden">
            {/* Top Scene Label */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border-subtle mb-6">
              <div className="flex items-center gap-2 font-mono text-[11px] text-foreground-muted uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-accent-primary" />
                <span className="font-semibold text-foreground">Illustrative shipment journey</span>
                <span>·</span>
                <span>Ref: SHP-882194</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-foreground-secondary">
                <span className="px-2 py-0.5 rounded border border-border-subtle bg-surface-subtle">
                  Origin: Colombo (LKCMB)
                </span>
                <span className="text-foreground-muted">&rarr;</span>
                <span className="px-2 py-0.5 rounded border border-border-subtle bg-surface-subtle">
                  Destination: Rotterdam (NLRTM)
                </span>
              </div>
            </div>

            {/* Main Visual Composition Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* Left Column: Buyer Procurement Brief Note */}
              <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-xl border border-border-subtle bg-surface-subtle/60 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-foreground-muted">
                    <span className="uppercase tracking-wider">01 / Procurement Request</span>
                    <span className="text-accent-primary font-semibold">Buyer Brief</span>
                  </div>
                  <div className="p-3.5 rounded-lg border border-border-subtle bg-surface text-xs text-foreground space-y-2">
                    <div className="font-semibold text-foreground-secondary text-[11px] uppercase tracking-wider font-mono">
                      Role: Importer · Food & Beverage Desk
                    </div>
                    <p className="italic text-foreground leading-relaxed">
                      &ldquo;Can you source 24 MT of Ceylon organic C5 cinnamon for delivery to Rotterdam Berth 14 with SGS inspection certification?&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle space-y-2 text-xs text-foreground-secondary">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">Requested Quantity:</span>
                    <span className="font-mono font-medium text-foreground">24 MT (1x40ft HC)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">Target Incoterm:</span>
                    <span className="font-mono font-medium text-foreground">FOB Colombo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-muted">Document Mandate:</span>
                    <span className="font-mono font-medium text-status-success">SGS Purity &gt;99%</span>
                  </div>
                </div>
              </div>

              {/* Center & Right Column: Real Documentary Photograph & Editorial Annotations */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-border-subtle bg-surface-subtle aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/8]">
                  <img
                    src="/images/cinnamon_inspection.jpg"
                    alt="Workers in Sri Lanka sorting and inspecting organic Ceylon cinnamon for export"
                    className="w-full h-full object-cover object-center filter saturate-[0.95]"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Photo Editorial Caption Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-status-success" />
                      <span className="font-medium text-white/90 drop-shadow-xs">
                        Stage 01: Supplier lot preparation &amp; quality sorting in Sri Lanka
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-white/75 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded border border-white/20">
                      Lanka Spices Ltd. · Export Lot #882
                    </span>
                  </div>
                </div>

                {/* Editorial Annotations Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg border border-border-subtle bg-surface-subtle/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
                      <HiUserGroup className="w-3.5 h-3.5 text-accent-primary" />
                      <span>Role: Buyer</span>
                    </div>
                    <p className="text-foreground-muted text-[11px] leading-tight">
                      Confirms specification requirements and issues purchase order.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-border-subtle bg-surface-subtle/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
                      <HiCheckCircle className="w-3.5 h-3.5 text-status-success" />
                      <span>Role: Supplier</span>
                    </div>
                    <p className="text-foreground-muted text-[11px] leading-tight">
                      Prepares audited stock and submits SGS pre-shipment dossier.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-border-subtle bg-surface-subtle/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
                      <HiDocumentText className="w-3.5 h-3.5 text-accent-primary" />
                      <span>Role: Trade Team</span>
                    </div>
                    <p className="text-foreground-muted text-[11px] leading-tight">
                      Validates bill of lading and secures fiduciary escrow custody.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continuous Route Line Motif Connector */}
            <div className="mt-8 pt-6 border-t border-border-subtle flex items-center justify-between text-xs text-foreground-muted">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-foreground-secondary">
                  Continuous Trade Lifecycle
                </span>
                <span className="hidden sm:inline text-foreground-muted">·</span>
                <span className="hidden sm:inline text-[11px]">Scroll down to follow the shipment journey</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-accent-primary font-medium">
                <span>Chapter 01 &rarr; 04</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
