import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { HiArrowRight } from 'react-icons/hi';

import PageHeader from '../components/PageHeader';
const BrowseCategoriesPage = () => {
  const categories = [
    { name: 'Agricultural Commodities', count: '1,420 listings', image: '/images/ind-agriculture.jpg', desc: 'Spices, organic grains, tea, coffee, edible oils and pulses with assay on file.' },
    { name: 'Industrial & Heavy Equipment', count: '850 listings', image: '/images/svc-warehouse.jpg', desc: 'Machinery, CNC tooling, hydraulic units and factory spares.' },
    { name: 'Textiles, Fabrics & Apparel', count: '2,100 listings', image: '/images/ind-textiles.jpg', desc: 'Raw cotton, certified silk bolts, linen and industrial denim.' },
    { name: 'Chemicals, Polymers & Resins', count: '640 listings', image: '/images/com-rubber.jpg', desc: 'TSR rubber, synthetic polymers, fertilizers and raw compounds.' },
    { name: 'Electronics & Microcomponents', count: '1,280 listings', image: '/images/com-copper.jpg', desc: 'Photovoltaic cells, copper coils and semiconductor assemblies.' },
    { name: 'Automotive & Marine Spares', count: '430 listings', image: '/images/svc-road.jpg', desc: 'Marine engine assemblies, container fittings and OEM parts.' },
  ];

  return (
        <>
      <PageHeader
        eyebrow="Directory"
        title="Every sector we clear."
        description="Verified export-grade commodities classified under the Harmonized Tariff Schedule, with live supply counts."
        image="/images/ind-agriculture.jpg"
      />
      <div className="container py-12 md:py-16 max-w-6xl">
      <SEOHead
        title="Commodity Directory & Trade Sectors | IEHUB"
        description="Browse international trade sectors and export commodities classified under Harmonized Tariff Schedules (HTS)."
        canonicalUrl="https://iehub-client.vercel.app/categories"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group flex flex-col border border-border-default bg-surface transition-colors hover:border-border-hover"
          >
            <div className="media aspect-[16/10]">
              <img src={cat.image} alt="" loading="lazy" />
              <span className="absolute left-0 top-0 bg-surface/95 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground-secondary backdrop-blur">
                {cat.count}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-[16px] font-bold text-foreground transition-colors group-hover:text-accent-primary">
                {cat.name}
              </h3>
              <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-foreground-secondary">
                {cat.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 border-t border-border-subtle pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-primary">
                View sector <HiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
};

export default BrowseCategoriesPage;
