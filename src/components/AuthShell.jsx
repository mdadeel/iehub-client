import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const STATS = [
  { k: '120+', v: 'Ports' },
  { k: '2,840', v: 'Exporters' },
  { k: '99.6%', v: 'On-time' },
];

const AuthShell = ({
  title,
  subtitle,
  asideTitle = 'Every consignment, one accountable desk.',
  asideCopy = 'From origin inspection to the discharge port, IEHUB keeps the paperwork, the cargo and the money in the same ledger.',
  image = '/images/desk-operations.jpg',
  children,
}) => {
  return (
    <div className="bg-canvas">
      <div className="container py-10 lg:py-14">
        <div className="grid grid-cols-1 overflow-hidden border border-border-default bg-surface lg:grid-cols-2">
          {/* Photographic panel */}
          <div className="relative hidden min-h-[620px] overflow-hidden bg-[#0A0D10] lg:block">
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090B] via-[#07090B]/70 to-[#07090B]/25" />

            <div className="relative flex h-full flex-col justify-between p-10 text-white">
              <Link to="/" className="inline-flex items-center gap-2.5" aria-label="IEHUB Home">
                <span className="flex h-8 w-8 items-center justify-center bg-accent-primary font-display text-[13px] font-extrabold leading-none text-white">
                  IE
                </span>
                <span className="flex flex-col leading-none">
                  <span className="font-display text-[15px] font-extrabold tracking-tight">IEHUB</span>
                  <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-white/50">
                    Trade network
                  </span>
                </span>
              </Link>

              <div>
                <div className="eyebrow eyebrow-light mb-5">Trade desk</div>
                <h2 className="display max-w-sm text-3xl leading-tight">{asideTitle}</h2>
                <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/60">
                  {asideCopy}
                </p>

                <dl className="mt-10 grid max-w-sm grid-cols-3 gap-4 border-t border-white/15 pt-6">
                  {STATS.map((s) => (
                    <div key={s.v}>
                      <dt className="font-mono text-lg font-semibold text-white">{s.k}</dt>
                      <dd className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/45">
                        {s.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="p-6 sm:p-10">
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2.5 lg:hidden">
                <span className="flex h-8 w-8 items-center justify-center bg-accent-primary font-display text-[13px] font-extrabold leading-none text-white">
                  IE
                </span>
                <span className="font-display text-[15px] font-extrabold tracking-tight text-foreground">
                  IEHUB
                </span>
              </div>
              <div className="eyebrow mb-3">Secure access</div>
              <h1 className="display text-2xl sm:text-[2rem]">{title}</h1>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">{subtitle}</p>
            </div>

            {children}

            <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4 text-[11px] text-foreground-muted">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
                Back to site <HiArrowRight className="h-3 w-3" />
              </Link>
              <span className="font-mono uppercase tracking-[0.14em] text-foreground-subtle">
                ICC · UCP 600
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
