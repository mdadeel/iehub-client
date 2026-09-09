import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border-default pt-12 pb-8 text-foreground-secondary">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-accent-primary text-accent-contrast flex items-center justify-center font-black text-xs">
                IE
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">
                IEHUB <span className="font-normal text-xs text-foreground-muted font-mono">v2.0</span>
              </span>
            </Link>
            <p className="text-xs text-foreground-muted leading-relaxed max-w-sm">
              The modern operating system for international trade. Verified commodity sourcing, digital purchase orders, and maritime customs telemetry.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-status-success">
              <span className="w-2 h-2 rounded-full bg-status-success inline-block" />
              <span>All Systems Operational (99.99% Uptime)</span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Source
            </div>
            <ul className="space-y-1.5 text-xs text-foreground-muted">
              <li>
                <Link to="/products" className="hover:text-foreground transition-colors">
                  Source Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-foreground transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/trades" className="hover:text-foreground transition-colors">
                  Recent Trades
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-foreground transition-colors">
                  Track Shipments
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Workspace
            </div>
            <ul className="space-y-1.5 text-xs text-foreground-muted">
              <li>
                <Link to="/dashboard" className="hover:text-foreground transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-exports" className="hover:text-foreground transition-colors">
                  My Inventory
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-imports" className="hover:text-foreground transition-colors">
                  Purchase Orders
                </Link>
              </li>
              <li>
                <Link to="/dashboard/profile" className="hover:text-foreground transition-colors">
                  Company Settings
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Company
            </div>
            <ul className="space-y-1.5 text-xs text-foreground-muted">
              <li>
                <Link to="/about" className="hover:text-foreground transition-colors">
                  Why IEHUB
                </Link>
              </li>
              <li>
                <Link to="/trades" className="hover:text-foreground transition-colors">
                  Recent Trades
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-foreground transition-colors">
                  Global Logistics
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Trade Desk Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Network
            </div>
            <div className="flex items-center gap-3 text-foreground-muted">
              <a href="#" className="hover:text-foreground transition-colors" aria-label="X Twitter">
                <FaXTwitter size={15} />
              </a>
              <a href="#" className="hover:text-foreground transition-colors" aria-label="LinkedIn">
                <FaLinkedin size={15} />
              </a>
              <a href="#" className="hover:text-foreground transition-colors" aria-label="GitHub">
                <FaGithub size={15} />
              </a>
            </div>
            <div className="text-[11px] text-foreground-muted pt-1">
              ICC Incoterms 2020 Compliant
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-foreground-muted font-mono">
          <div>
            &copy; {new Date().getFullYear()} IEHUB Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Trade</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
            <a href="#" className="hover:text-foreground transition-colors">Escrow Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
