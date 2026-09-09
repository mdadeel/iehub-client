import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HiMail, HiOutlineGlobeAlt } from 'react-icons/hi';

const TradeExpertsPage = () => {
  const experts = [
    {
      name: 'Marcus Thorne',
      role: 'Director of Trade Compliance',
      corridor: 'London & European Corridors',
      bio: '18+ years structuring customs compliance, VAT exemptions, and Incoterms 2020 legal risk mitigation for transatlantic commodity shipments.',
      initials: 'MT',
    },
    {
      name: 'Elena Rossi',
      role: 'Head of Agricultural Commodities',
      corridor: 'Mediterranean & Latin America',
      bio: 'Specialist in phytosanitary origin documentation, cold chain maritime logistics, and FOB contract pricing across raw grains and perishables.',
      initials: 'ER',
    },
    {
      name: 'Chen Wei',
      role: 'Chief Freight & Customs Architect',
      corridor: 'Asia-Pacific Deep-Water Hubs',
      bio: 'Former terminal manager at Ningbo-Zhoushan with deep experience integrating digital bills of lading and container telemetry into carrier EDI networks.',
      initials: 'CW',
    },
  ];

  return (
    <div className="container py-12 md:py-16 max-w-5xl">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="neutral" size="sm" className="mb-2">
          Advisory Team
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
          Trade Desk Specialists
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted">
          Our certified customs brokers, freight forwarders, and trade finance legal advisors assist your team on high-value cross-border transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experts.map((expert, i) => (
          <Card key={i} className="border border-border-default bg-surface flex flex-col justify-between">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-accent-subtle text-accent-primary border border-accent-primary/20 flex items-center justify-center font-bold text-sm mb-4">
                {expert.initials}
              </div>
              <h2 className="text-sm font-semibold text-foreground">
                {expert.name}
              </h2>
              <div className="text-xs text-accent-primary font-medium mt-0.5 mb-1">
                {expert.role}
              </div>
              <div className="text-[11px] text-foreground-muted font-mono mb-3">
                {expert.corridor}
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                {expert.bio}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TradeExpertsPage;
