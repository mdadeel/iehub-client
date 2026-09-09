import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HiArrowRight } from 'react-icons/hi';

const BrowseCategoriesPage = () => {
  const categories = [
    { name: 'Agricultural Commodities', count: '1,420 Listings', icon: '🌾', desc: 'Spices, organic grains, tea, coffee, edible oils, and pulses.' },
    { name: 'Industrial & Heavy Equipment', count: '850 Listings', icon: '🏗️', desc: 'Machinery, CNC tooling, hydraulic units, and factory spares.' },
    { name: 'Textiles, Fabrics & Apparel', count: '2,100 Listings', icon: '🧵', desc: 'Raw cotton, certified silk bolts, linen, and industrial denim.' },
    { name: 'Chemicals, Polymers & Resins', count: '640 Listings', icon: '🧪', desc: 'TSR rubber, synthetic polymers, fertilizers, and raw compounds.' },
    { name: 'Electronics & Microcomponents', count: '1,280 Listings', icon: '⚡', desc: 'Photovoltaic cells, copper coils, semiconductor assemblies.' },
    { name: 'Automotive & Marine Spares', count: '430 Listings', icon: '🚢', desc: 'Marine engine assemblies, container fittings, and OEM parts.' },
  ];

  return (
    <div className="container py-12 md:py-16 max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="neutral" size="sm" className="mb-2">
          Commodity Directory
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
          International Trade Sectors
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted">
          Browse verified export-grade commodities classified according to the Harmonized Tariff Schedule (HTS).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <Card
            key={i}
            className="border border-border-default bg-surface hover:border-border-hover transition-colors flex flex-col justify-between"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{cat.icon}</span>
                <Badge variant="neutral" size="sm" className="font-mono">
                  {cat.count}
                </Badge>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1.5">
                {cat.name}
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed mb-6">
                {cat.desc}
              </p>
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-primary hover:underline"
              >
                <span>View Sector Inventory</span>
                <HiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrowseCategoriesPage;
