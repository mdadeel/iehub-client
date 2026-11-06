import { HiGlobeAlt, HiShieldCheck, HiTrendingUp, HiUsers, HiOutlineCheckCircle } from 'react-icons/hi';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import PageHeader from '../components/PageHeader';
const AboutUsPage = () => {
  const stats = [
    { label: "Trading Jurisdictions", value: "120+", icon: <HiGlobeAlt />, desc: "Regulatory compliance across 120+ ports." },
    { label: "Verified Supply SKUs", value: "10K+", icon: <HiShieldCheck />, desc: "Inspected agricultural, textile & tech commodities." },
    { label: "Institutional Exporters", value: "2.5K+", icon: <HiUsers />, desc: "Vetted origin producers and suppliers." },
    { label: "Executed Trade Flow", value: "$450M+", icon: <HiTrendingUp />, desc: "Cumulative FOB & CIF settlement value." },
  ];

  return (
        <>
      <PageHeader
        eyebrow="Company"
        title="Trade infrastructure built by operators."
        description="IEHUB exists because too many consignments still stall in a WhatsApp thread. We put the inspection, the paperwork and the money in one auditable place."
        image="/images/desk-operations.jpg"
      />
      <div className="container py-12 md:py-16 max-w-5xl">
      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
        <div className="space-y-4 text-xs sm:text-sm text-foreground-secondary leading-relaxed">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Bridging the Cross-Border Trust Deficit
          </h2>
          <p>
            International commerce is traditionally plagued by fraudulent bills of lading, delayed letters of credit, and opaque broker markups. Buyers risk advance deposits while origin farmers and manufacturers struggle to prove harvest veracity.
          </p>
          <p>
            IEHUB replaces fragmented paper workflows with automated trade verification. Every commodity listing contains auditable origin documentation, phytosanitary certifications, and binding FOB price agreements.
          </p>
        </div>

        <Card className="p-6 border border-border-default bg-surface-subtle/40 space-y-3">
          <div className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
            Core Operating Principles
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2 text-foreground-secondary">
              <HiOutlineCheckCircle className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
              <span><strong>Radical Traceability:</strong> Zero tolerance for unverified origin documents or uninspected lots.</span>
            </div>
            <div className="flex items-start gap-2 text-foreground-secondary">
              <HiOutlineCheckCircle className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
              <span><strong>Incoterms Standardization:</strong> Automated adherence to ICC Incoterms 2020 international standards.</span>
            </div>
            <div className="flex items-start gap-2 text-foreground-secondary">
              <HiOutlineCheckCircle className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
              <span><strong>Custodial Protection:</strong> Escrow commitments released strictly upon maritime bill of lading verification.</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="p-5 border border-border-default bg-surface hover:border-border-hover transition-colors">
            <div className="text-accent-primary mb-3 text-xl">
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-foreground font-mono tabular-nums mb-0.5">
              {s.value}
            </div>
            <div className="text-xs font-semibold text-foreground mb-1">
              {s.label}
            </div>
            <p className="text-[11px] text-foreground-muted leading-relaxed">
              {s.desc}
            </p>
          </Card>
        ))}
      </div>
    </div>
    </>
  );
};

export default AboutUsPage;
