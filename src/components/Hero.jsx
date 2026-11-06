import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiSearch,
  HiArrowRight,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineSupport,
  HiOutlineDocumentText,
} from 'react-icons/hi';

const INCOTERMS = ['ALL', 'FOB', 'CIF', 'EXW', 'DDP'];

const QUICK_ACTIONS = [
  {
    to: '/products',
    icon: HiOutlineShoppingBag,
    label: 'Source commodities',
    hint: '2,800+ verified lots',
  },
  {
    to: '/shipping',
    icon: HiOutlineTruck,
    label: 'Track a shipment',
    hint: 'Live container status',
  },
  {
    to: '/about',
    icon: HiOutlineShieldCheck,
    label: 'How escrow works',
    hint: 'Funds released on B/L',
  },
  {
    to: '/contact',
    icon: HiOutlineSupport,
    label: 'Talk to the trade desk',
    hint: 'Reply within 4 hours',
  },
];

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
      <section className="relative isolate overflow-hidden bg-[#0A0D10] text-white">
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

        <div className="relative container pt-28 pb-24 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
            {/* Copy column */}
            <div className="lg:col-span-7">
              <div className="eyebrow eyebrow-light mb-6">
                Global trade infrastructure · Chattogram to 120 ports
              </div>

              <h1 className="display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem]">
                Confidence in every
                <br />
                cross-border
                <span className="relative ml-3 inline-block text-[#F0433F]">
                  trade.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/72 sm:text-base">
                Source lab-verified commodities, lock Incoterms pricing, and release payment only
                when your cargo clears. One desk covers origin inspection, ocean carriage and
                final-mile delivery.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-2 bg-[#C2181F] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#9C1016]"
                >
                  Source verified lots
                  <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5"
                >
                  Talk to the trade desk
                </Link>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-6">
                {[
                  { k: '120+', v: 'Discharge ports' },
                  { k: '2,840', v: 'Vetted exporters' },
                  { k: '99.6%', v: 'On-time clearance' },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="font-mono text-xl font-semibold text-white sm:text-2xl">{s.k}</dt>
                    <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/50">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Sourcing console */}
            <div className="lg:col-span-5 lg:pl-4">
              <form
                onSubmit={handleSearch}
                className="border border-white/15 bg-white p-5 text-[#14181B] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6C7378]">
                    Sourcing console
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#0B7A52]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0B7A52]" />
                    Live book
                  </span>
                </div>

                <h2 className="mt-3 font-display text-xl font-bold tracking-tight">
                  Find a lot that ships this month
                </h2>

                <div className="mt-4 flex items-center gap-2 border border-[#E1DBD3] bg-[#F6F4F1] px-3 py-2.5 focus-within:border-[#C2181F]">
                  <HiSearch className="h-4 w-4 shrink-0 text-[#9AA0A4]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Commodity, origin or HS code…"
                    aria-label="Search commodities"
                    className="w-full bg-transparent text-sm text-[#14181B] placeholder:text-[#9AA0A4] focus:outline-none"
                  />
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9AA0A4]">
                    Delivery term
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {INCOTERMS.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setIncoterm(term)}
                        className={`border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
                          incoterm === term
                            ? 'border-[#14181B] bg-[#14181B] text-white'
                            : 'border-[#E1DBD3] text-[#494F53] hover:border-[#C9C1B7] hover:bg-[#F1EDE8]'
                        }`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-5 flex w-full items-center justify-center gap-2 bg-[#C2181F] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9C1016]"
                >
                  Search the marketplace
                  <HiArrowRight className="h-4 w-4" />
                </button>

                <div className="mt-4 flex items-center justify-between border-t border-[#EDE8E2] pt-3 text-[11px]">
                  <Link to="/shipping" className="inline-flex items-center gap-1.5 font-medium text-[#494F53] hover:text-[#C2181F]">
                    <HiOutlineTruck className="h-3.5 w-3.5" /> Track a shipment
                  </Link>
                  <Link to="/trades" className="inline-flex items-center gap-1.5 font-medium text-[#494F53] hover:text-[#C2181F]">
                    <HiOutlineDocumentText className="h-3.5 w-3.5" /> Recent trades
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quick action bar — sits across the hero fold */}
      <div className="relative z-20 -mt-12 mb-10 container sm:-mt-14">
        <div className="grid grid-cols-1 border border-border-default bg-surface shadow-[0_24px_60px_-40px_rgba(16,20,23,0.55)] sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className={`group flex items-center gap-4 border-border-subtle px-5 py-4 transition-colors hover:bg-surface-subtle ${
                  [
                    '',
                    'border-t sm:border-t-0 sm:border-l',
                    'border-t lg:border-t-0 lg:border-l',
                    'border-t sm:border-l lg:border-t-0',
                  ][i]
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent-primary text-white">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-foreground">
                    {action.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-foreground-muted">
                    {action.hint}
                  </span>
                </span>
                <HiArrowRight className="h-4 w-4 shrink-0 text-foreground-subtle transition-all group-hover:translate-x-0.5 group-hover:text-accent-primary" />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Hero;
