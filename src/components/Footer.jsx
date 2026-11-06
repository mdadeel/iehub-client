import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiArrowRight, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const Footer = () => {
  const columns = [
    {
      title: 'Source',
      links: [
        { to: '/products', label: 'Marketplace' },
        { to: '/categories', label: 'Categories' },
        { to: '/trades', label: 'Recent trades' },
        { to: '/shipping', label: 'Track shipments' },
      ],
    },
    {
      title: 'Workspace',
      links: [
        { to: '/dashboard', label: 'Overview' },
        { to: '/dashboard/my-exports', label: 'My inventory' },
        { to: '/dashboard/my-imports', label: 'Purchase orders' },
        { to: '/dashboard/profile', label: 'Company settings' },
      ],
    },
    {
      title: 'Company',
      links: [
        { to: '/about', label: 'Why IEHUB' },
        { to: '/news', label: 'Market insights' },
        { to: '/careers', label: 'Trade experts' },
        { to: '/contact', label: 'Contact desk' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0B0F12] text-white">
      <div className="container">
        {/* Top */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-b border-white/10 py-14 sm:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="IEHUB Home">
              <span className="flex h-9 w-9 items-center justify-center bg-accent-primary font-display text-sm font-extrabold leading-none text-white">
                IE
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-base font-extrabold tracking-tight text-white">
                  IEHUB
                </span>
                <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Trade network
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-white/55">
              Verified commodity sourcing, escrow-protected settlement and maritime logistics
              telemetry — run from one desk.
            </p>

            <div className="mt-6 space-y-2.5 text-[12.5px] text-white/55">
              <a
                href="tel:+880312345678"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <HiOutlinePhone className="h-4 w-4 shrink-0 text-white/35" />
                +880 31 234 5678
              </a>
              <a
                href="mailto:tradedesk@iehub.com"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <HiOutlineMail className="h-4 w-4 shrink-0 text-white/35" />
                tradedesk@iehub.com
              </a>
              <div className="flex items-start gap-2.5">
                <HiOutlineLocationMarker className="mt-0.5 h-4 w-4 shrink-0 text-white/35" />
                Agrabad C/A, Chattogram 4100, Bangladesh
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-status-success">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-success" />
              All systems operational
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Trade brief
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-white/55">
              Weekly freight rates and commodity positions. No noise.
            </p>
            <form
              className="mt-4 flex border border-white/15 bg-white/5 focus-within:border-white/40"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="you@company.com"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[12.5px] text-white placeholder:text-white/35 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex w-10 shrink-0 items-center justify-center bg-accent-primary text-white transition-colors hover:bg-accent-hover"
              >
                <HiArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 flex items-center gap-3 text-white/45">
              <a href="#" className="transition-colors hover:text-white" aria-label="X Twitter">
                <FaXTwitter size={14} />
              </a>
              <a href="#" className="transition-colors hover:text-white" aria-label="LinkedIn">
                <FaLinkedin size={14} />
              </a>
              <a href="#" className="transition-colors hover:text-white" aria-label="GitHub">
                <FaGithub size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-start justify-between gap-4 py-6 text-[11px] text-white/40 sm:flex-row sm:items-center">
          <div>
            &copy; {new Date().getFullYear()} IEHUB Inc. · ICC Incoterms 2020 compliant
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/legal#privacy" className="transition-colors hover:text-white/80">Privacy</Link>
            <Link to="/legal#terms" className="transition-colors hover:text-white/80">Terms of trade</Link>
            <Link to="/legal#security" className="transition-colors hover:text-white/80">Security</Link>
            <Link to="/legal#escrow" className="transition-colors hover:text-white/80">Escrow disclosures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
