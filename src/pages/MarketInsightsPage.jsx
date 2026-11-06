import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import SEOHead from '../components/SEOHead';
const MarketInsightsPage = () => {
  const articles = [
    {
      date: 'Feb 18, 2026',
      readTime: '6 min read',
      tag: 'Maritime Logistics',
      title: 'Decarbonization Mandates and Trans-Pacific Dwell Times in 2026',
      summary: 'Analysis of IMO carbon intensity indicators (CII) and their direct impact on vessel slow-steaming and container turnaround at major West Coast ports.',
    },
    {
      date: 'Jan 29, 2026',
      readTime: '5 min read',
      tag: 'Trade Finance',
      title: 'Digital Bills of Lading: Why Banks are Finally Retiring Paper L/Cs',
      summary: 'How MLETR-aligned jurisdictions and smart contract escrow facilities are compressing credit verification windows from 14 business days down to 45 minutes.',
    },
    {
      date: 'Jan 12, 2026',
      readTime: '8 min read',
      tag: 'Agricultural Commodities',
      title: 'Global Arabica and Robusta Harvest Dynamics: 2026 Sourcing Outlook',
      summary: 'Evaluating South American export quotas, climate resilience benchmarks, and direct-from-origin purchasing strategies for institutional roasters.',
    },
  ];

  return (
        <>
      <SEOHead
        title="Global Trade Insights & Market Research | IEHUB"
        description="Macro research, regulatory updates and supply chain telemetry from the IEHUB trade desk."
        canonicalUrl="https://iehub-client.vercel.app/news"
      />

      <PageHeader
        eyebrow="Intelligence"
        title="Global trade insights."
        description="Macro research, regulatory updates and supply-chain telemetry, written by the desk that clears the cargo."
        image="/images/com-coffee.jpg"
      />
      <div className="container py-12 md:py-16 max-w-4xl">
      <div className="space-y-4">
        {articles.map((article, i) => (
          <Card key={i} className="border border-border-default bg-surface hover:border-border-hover transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2 text-[13px] text-foreground-muted font-mono">
                <Badge variant="neutral" size="sm">
                  {article.tag}
                </Badge>
                <span>&bull;</span>
                <span>{article.date}</span>
                <span>&bull;</span>
                <span>{article.readTime}</span>
              </div>

              <h2 className="text-base font-semibold text-foreground mb-2 hover:text-accent-primary transition-colors cursor-pointer">
                {article.title}
              </h2>

              <p className="text-xs text-foreground-muted leading-relaxed mb-4">
                {article.summary}
              </p>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-primary hover:underline cursor-pointer">
                <span>Read Full Research Note</span>
                <HiArrowRight className="w-3.5 h-3.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </>
  );
};

export default MarketInsightsPage;
