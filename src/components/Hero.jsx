import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiCheckCircle } from 'react-icons/hi';

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [incoterm, setIncoterm] = useState('ALL');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (incoterm !== 'ALL') params.set('incoterm', incoterm);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-canvas border-b border-border-default pt-14 pb-20 sm:pt-20 sm:pb-28">
      <div className="container max-w-[1280px]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-7">
          {/* Institutional Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span>Institutional B2B Commodity Infrastructure</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] text-foreground leading-[1.06] text-balance"
          >
            The Operating System for International Trade
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-lg sm:text-xl text-foreground-secondary leading-relaxed max-w-2xl text-balance"
          >
            Direct bilateral contracts with SGS-Inspected suppliers. Live ocean carrier milestone telemetry and fiduciary escrow release upon port delivery.
          </motion.p>

          {/* Sourcing Search Box with Incoterm Toggles */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="w-full max-w-2xl bg-surface border-2 border-border-default focus-within:border-[#2563EB] rounded-2xl p-2 sm:p-2.5 shadow-lg flex flex-col sm:flex-row items-center gap-3 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 px-3 w-full">
              <HiSearch className="w-5 h-5 text-foreground-muted shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search coffee, rice, rubber, metals, or HS code..."
                className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-foreground-muted focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
              {/* Incoterm Pills */}
              <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-lg border border-border-subtle text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setIncoterm('ALL')}
                  className={`px-2 py-1 rounded-md transition-colors ${incoterm === 'ALL' ? 'bg-surface text-foreground shadow-xs' : 'text-foreground-muted hover:text-foreground'}`}
                >
                  ALL
                </button>
                <button
                  type="button"
                  onClick={() => setIncoterm('FOB')}
                  className={`px-2 py-1 rounded-md transition-colors ${incoterm === 'FOB' ? 'bg-surface text-[#2563EB] shadow-xs' : 'text-foreground-muted hover:text-foreground'}`}
                >
                  FOB
                </button>
                <button
                  type="button"
                  onClick={() => setIncoterm('CIF')}
                  className={`px-2 py-1 rounded-md transition-colors ${incoterm === 'CIF' ? 'bg-surface text-[#2563EB] shadow-xs' : 'text-foreground-muted hover:text-foreground'}`}
                >
                  CIF
                </button>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
              >
                Explore 180+ Lots
              </button>
            </div>
          </motion.form>

          {/* Micro Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-3 text-xs text-foreground-secondary font-medium"
          >
            <div className="flex items-center gap-1.5">
              <HiCheckCircle className="w-4 h-4 text-[#059669]" />
              <span>ICC UCP 600 Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiCheckCircle className="w-4 h-4 text-[#059669]" />
              <span>Verified KYB Level 3</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiCheckCircle className="w-4 h-4 text-[#059669]" />
              <span>100% Escrow Custody</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiCheckCircle className="w-4 h-4 text-[#059669]" />
              <span>120+ Ports Connected</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
