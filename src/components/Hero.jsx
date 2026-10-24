import { useState } from 'react';
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
    <section className="bg-canvas border-b border-border-default pt-12 pb-16 sm:pt-16 sm:pb-20">
      <div className="container max-w-7xl">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Institutional Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono font-semibold tracking-wider uppercase bg-surface-subtle text-foreground-secondary border border-border-default mb-6">
            <span>IEHUB Global Trade Network</span>
            <span className="text-border-default">|</span>
            <span className="text-[#2563EB]">ICC Incoterms® 2020 Standard</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-5">
            The Institutional Operating System for Global Trade
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mb-8">
            Execute direct bilateral purchase orders with lab-verified exporters. Pre-shipment assay audits, milestone-based fiduciary escrow, and real-time ocean cargo telemetry.
          </p>

          {/* Professional Sourcing Search Form */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl bg-surface border border-border-default focus-within:border-[#2563EB] rounded-lg p-2 flex flex-col sm:flex-row items-center gap-2 transition-colors"
          >
            <div className="flex items-center gap-2.5 flex-1 px-3 w-full">
              <HiSearch className="w-5 h-5 text-foreground-muted shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commodities, origins, or HS codes (e.g., 0901, 1006, 1201)..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-muted focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
              {/* Incoterm Selectors */}
              <div className="flex items-center gap-0.5 bg-surface-subtle p-0.5 rounded border border-border-subtle text-xs font-medium font-mono">
                {['ALL', 'FOB', 'CIF', 'EXW'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setIncoterm(term)}
                    className={`px-2 py-1 rounded transition-colors ${
                      incoterm === term
                        ? 'bg-surface text-foreground font-semibold shadow-2xs border border-border-subtle'
                        : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
              >
                Search Marketplace
              </button>
            </div>
          </form>

          {/* Institutional Compliance Standards Strip */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 sm:gap-x-8 mt-8 text-xs text-foreground-muted font-medium">
            <div className="flex items-center gap-1.5">
              <HiCheckCircle className="w-4 h-4 text-status-success shrink-0" />
              <span>ICC UCP 600 Harmonized</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiCheckCircle className="w-4 h-4 text-status-success shrink-0" />
              <span>KYB Level 3 Verified Exporters</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiCheckCircle className="w-4 h-4 text-status-success shrink-0" />
              <span>100% Solvency Escrow Custody</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiCheckCircle className="w-4 h-4 text-status-success shrink-0" />
              <span>120+ International UN/LOCODE Ports</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
