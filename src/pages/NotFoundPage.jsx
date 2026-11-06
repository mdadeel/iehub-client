import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineSearch, HiOutlineTruck, HiOutlineSupport } from 'react-icons/hi';
import SEOHead from '../components/SEOHead';

const SUGGESTIONS = [
  {
    to: '/products',
    icon: HiOutlineSearch,
    title: 'Source commodities',
    copy: 'Browse every verified export lot currently on the board.',
  },
  {
    to: '/shipping',
    icon: HiOutlineTruck,
    title: 'Track a shipment',
    copy: 'Check vessel, container and clearance milestones on a live PO.',
  },
  {
    to: '/contact',
    icon: HiOutlineSupport,
    title: 'Ask the trade desk',
    copy: 'A named officer replies within four working hours.',
  },
];

const NotFoundPage = () => {
  return (
    <div className="flex flex-col">
      <SEOHead
        title="Page not found | IEHUB"
        description="That page has moved or no longer exists. Jump back to the marketplace, shipments or the trade desk."
      />

      <section className="relative isolate overflow-hidden bg-[#0A0D10] text-white">
        <img
          src="/images/cta-port-night.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090B] via-[#07090B]/92 to-[#07090B]/50" />

        <div className="relative container py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="eyebrow eyebrow-light mb-5">Error 404</div>
            <div className="font-mono text-[13px] uppercase tracking-[0.22em] text-white/40">
              Document not on file
            </div>
            <h1 className="display mt-3 text-[2.4rem] leading-[1.03] sm:text-6xl">
              This page never cleared customs.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65">
              The link is broken, the lot was de-listed, or the address was typed with one letter
              too many. Everything below is still open for business.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-accent-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Back to the marketplace <HiArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5"
              >
                Return home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-14">
        <div className="container">
          <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
            Try one of these instead
          </div>
          <div className="grid grid-cols-1 gap-px bg-border-default md:grid-cols-3">
            {SUGGESTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex flex-col bg-surface p-6 transition-colors hover:bg-surface-subtle"
                >
                  <span className="flex h-9 w-9 items-center justify-center bg-accent-primary text-white">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="mt-4 text-[14px] font-bold text-foreground">{item.title}</span>
                  <span className="mt-1.5 flex-1 text-[14px] leading-relaxed text-foreground-secondary">
                    {item.copy}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-accent-primary">
                    Open <HiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;
