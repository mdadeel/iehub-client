import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HiGlobeAlt } from 'react-icons/hi';

const LatestTradesPage = () => {
  const trades = [
    {
      id: 'FOB-2026-8821',
      item: 'Bifacial Solar Photovoltaic Modules 550W',
      sector: 'Renewable Energy',
      volume: '12,000 units (24 TEU)',
      from: 'Ningbo-Zhoushan, China',
      to: 'Hamburg, Germany',
      status: 'Customs Manifest Filed',
      statusType: 'accent',
      terms: 'FOB Ningbo',
      settlement: '$312,000 USD',
    },
    {
      id: 'CIF-2026-7652',
      item: 'Precision 5-Axis CNC Milling Center',
      sector: 'Industrial Machinery',
      volume: '4 units',
      from: 'Yokohama, Japan',
      to: 'Long Beach, USA',
      status: 'Escrow Released',
      statusType: 'success',
      terms: 'CIF Los Angeles',
      settlement: '$480,000 USD',
    },
    {
      id: 'FOB-2026-9011',
      item: 'Specialty Arabica Green Coffee Grade 1',
      sector: 'Agriculture',
      volume: '19,200 kg (Jute Bags)',
      from: 'Santos Port, Brazil',
      to: 'Felixstowe, United Kingdom',
      status: 'Under Phytosanitary Inspection',
      statusType: 'warning',
      terms: 'FOB Santos',
      settlement: '$92,160 USD',
    },
    {
      id: 'DDP-2026-4432',
      item: '100% Mulberry Raw Silk 20/22D',
      sector: 'Textiles',
      volume: '3,500 kg',
      from: 'Mundra Port, India',
      to: 'Le Havre, France',
      status: 'Bill of Lading Verified',
      statusType: 'success',
      terms: 'DDP Paris',
      settlement: '$157,500 USD',
    },
  ];

  return (
    <div className="container py-12 md:py-16 max-w-5xl">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="neutral" size="sm" className="mb-2">
          Examples
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
          Recent Trades
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted">
          Sample contracts showing how purchase orders, bills of lading, and settlement values are structured on IEHUB.
        </p>
      </div>

      <div className="space-y-4">
        {trades.map((trade, i) => (
          <Card key={i} className="border border-border-default bg-surface hover:border-border-hover transition-colors">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {trade.id}
                  </span>
                  <Badge variant="neutral" size="sm">
                    {trade.terms}
                  </Badge>
                </div>

                <Badge
                  variant={
                    trade.statusType === 'success'
                      ? 'success'
                      : trade.statusType === 'warning'
                      ? 'warning'
                      : 'accent'
                  }
                  size="sm"
                  hasDot
                >
                  {trade.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-6 space-y-1">
                  <h2 className="text-sm font-semibold text-foreground">
                    {trade.item}
                  </h2>
                  <div className="text-xs text-foreground-muted">
                    {trade.sector} &bull; <span className="font-mono text-foreground">{trade.volume}</span>
                  </div>
                </div>

                <div className="md:col-span-4 text-xs space-y-0.5">
                  <div className="text-foreground-secondary flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-border-strong" />
                    <span>Origin: <strong>{trade.from}</strong></span>
                  </div>
                  <div className="text-foreground-secondary flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                    <span>Destination: <strong>{trade.to}</strong></span>
                  </div>
                </div>

                <div className="md:col-span-2 text-left md:text-right">
                  <div className="text-[10px] text-foreground-muted uppercase font-mono">
                    Settlement
                  </div>
                  <div className="font-mono text-sm font-bold text-foreground">
                    {trade.settlement}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LatestTradesPage;
