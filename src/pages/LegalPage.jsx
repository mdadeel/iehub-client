import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import PageHeader from '../components/PageHeader';

const SECTIONS = [
  {
    id: 'privacy',
    title: 'Privacy notice',
    updated: 'Last updated 1 November 2026',
    body: [
      'We collect the minimum needed to run a trade file: your company identity, the named officers on the account, contact details, and the documents you upload (invoices, certificates of origin, bills of lading).',
      'Trade documents are stored with access limited to your organisation and the assigned IEHUB desk officer. We do not sell contact data, and we do not share lot pricing with other buyers.',
      'You can request an export of your account data, or deletion of an unused account, by writing to privacy@iehub.com. Records tied to a completed settlement are retained for seven years, as required by customs and banking counterparties.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms of trade',
    updated: 'Last updated 1 November 2026',
    body: [
      'IEHUB is a marketplace and documentation layer. The contract of sale is bilateral between the buyer and the exporter; IEHUB is not the seller of record.',
      'Listings must quote a real Incoterm (FOB, CIF, EXW or DDP) and a named port. Prices shown are indicative until a purchase order is countersigned.',
      'Platform fees are charged on execution, never on listing. Fee schedules are quoted in the purchase order before signature and are never deducted from escrow without written approval from both parties.',
    ],
  },
  {
    id: 'escrow',
    title: 'Escrow disclosures',
    updated: 'Last updated 1 November 2026',
    body: [
      'Buyer funds are held in a segregated custody account in the buyer’s own name, referenced to the purchase order number. Funds are not commingled with IEHUB operating capital.',
      'Release is triggered by verification of the carrier bill of lading plus consignee delivery sign-off at the discharge terminal. Partial releases follow the milestone schedule printed on the purchase order.',
      'If a letter of credit is used instead of escrow, UCP 600 governs the documentary examination and IEHUB acts only as document presenter.',
    ],
  },
  {
    id: 'security',
    title: 'Security',
    updated: 'Last updated 1 November 2026',
    body: [
      'Authentication is handled by Firebase Authentication; we never store plain-text passwords. Sessions expire on sign-out across all devices.',
      'Document uploads are scanned for type and size before storage, and download links are scoped per organisation. API traffic is authenticated per organisation with scoped keys.',
      'To report a vulnerability, email security@iehub.com. We acknowledge reports within one working day and will credit researchers who ask to be named.',
    ],
  },
];

const LegalPage = () => {
  return (
    <>
      <SEOHead
        title="Privacy, Terms, Escrow & Security | IEHUB"
        description="How IEHUB handles trade documents, escrow custody, platform fees and account security."
        canonicalUrl="https://iehub-client.vercel.app/legal"
      />

      <PageHeader
        eyebrow="Policies"
        title="The fine print, in plain language."
        description="Four documents govern every trade on IEHUB: what we store, what we charge, when escrow moves, and how we secure it."
        image="/images/desk-operations.jpg"
      />

      <div className="container max-w-5xl py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <nav className="lg:col-span-3" aria-label="Policy sections">
            <div className="sticky top-24 space-y-1">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                On this page
              </div>
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block border-l-2 border-transparent px-3 py-1.5 text-[13px] text-foreground-secondary transition-colors hover:border-accent-primary hover:text-foreground"
                >
                  {s.title}
                </a>
              ))}
              <Link
                to="/contact"
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-accent-primary hover:underline"
              >
                Ask a question
              </Link>
            </div>
          </nav>

          <div className="space-y-12 lg:col-span-9">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border-default pb-3">
                  <h2 className="display text-2xl">{s.title}</h2>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground-muted">
                    {s.updated}
                  </span>
                </div>
                <div className="mt-4 space-y-4">
                  {s.body.map((para, i) => (
                    <p key={i} className="max-w-2xl text-[14px] leading-relaxed text-foreground-secondary">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalPage;
