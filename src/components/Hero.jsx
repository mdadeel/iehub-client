import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiSearch, HiArrowRight, HiOutlineTruck, HiOutlineDocumentText } from 'react-icons/hi';

const INCOTERMS = ['ALL', 'FOB', 'CIF', 'EXW', 'DDP'];

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
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        {/* Photographic base */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-port.jpg"
            alt="Container terminal at dusk with gantry cranes loading an ocean vessel"
            className="h-full w-full object-cover object-[58%_center]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090B] via-[#07090B]/88 to-[#07090B]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090B] via-transparent to-[#07090B]/45" />
        </div>

        <div className="relative container pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
            {/* Copy column */}
            <div className="lg:col-span-7">
              <div className="eyebrow eyebrow-light mb-6 whitespace-nowrap text-[11px] sm:text-[13px]">
                Global trade network · Chattogram
              </div>

              <h1 className="display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem]">
                Confidence in every cross-border
                <span className="relative ml-3 inline-block text-[#E23A40]">
                  trade.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                Source lab-verified commodities, lock Incoterms pricing, and release payment only
                when your cargo clears. One desk covers origin inspection, ocean carriage and
                final-mile delivery.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap bg-accent-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  Source verified lots
                  <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5"
                >
                  Talk to the trade desk
                </Link>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6 sm:gap-6">
                {[
                  { k: '120+', v: 'Discharge ports' },
                  { k: '2,840', v: 'Vetted exporters' },
                  { k: '99.6%', v: 'On-time clearance' },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="font-mono text-lg font-semibold text-white sm:text-2xl">{s.k}</dt>
                    <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/50 sm:text-[13px]">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Sourcing console — sits over the photographic hero, so it stays light in both themes */}
            <div className="lg:col-span-5 lg:pl-4">
              <form
                onSubmit={handleSearch}
                className="border border-white/15 bg-white p-5 text-[#10161C] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#59636C]">
                    Sourcing console
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#0E7A50]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0E7A50]" />
                    Live book
                  </span>
                </div>

                <h2 className="mt-3 font-display text-xl font-bold tracking-tight">
                  Find a lot that ships this month
                </h2>

                <div className="mt-4 flex items-center gap-2 border border-[#E4E8EC] bg-[#F5F6F8] px-3 py-2.5 focus-within:border-accent-primary">
                  <HiSearch className="h-4 w-4 shrink-0 text-[#767F88]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Commodity, origin or HS code…"
                    aria-label="Search commodities"
                    className="w-full bg-transparent text-sm text-[#10161C] placeholder:text-[#767F88] focus:outline-none"
                  />
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767F88]">
                    Delivery term
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {INCOTERMS.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setIncoterm(term)}
                        className={`border px-2.5 py-1 font-mono text-[13px] font-semibold transition-colors ${
                          incoterm === term
                            ? 'border-[#10161C] bg-[#10161C] text-white'
                            : 'border-[#E4E8EC] text-[#434E58] hover:border-[#C7CED5] hover:bg-[#EEF0F3]'
                        }`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-5 flex w-full items-center justify-center gap-2 bg-accent-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  Search the marketplace
                  <HiArrowRight className="h-4 w-4" />
                </button>

                <div className="mt-4 flex items-center justify-between border-t border-[#EDF0F3] pt-3 text-[13px]">
                  <Link to="/shipping" className="inline-flex items-center gap-1.5 font-medium text-[#434E58] hover:text-[#10161C]">
                    <HiOutlineTruck className="h-3.5 w-3.5" /> Track a shipment
                  </Link>
                  <Link to="/trades" className="inline-flex items-center gap-1.5 font-medium text-[#434E58] hover:text-[#10161C]">
                    <HiOutlineDocumentText className="h-3.5 w-3.5" /> Recent trades
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
