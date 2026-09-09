import { useNavigate } from 'react-router-dom';
import { HiArrowRight, HiLocationMarker } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Badge } from './ui/Badge';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/products/${product._id || product.id}`);
  };

  const incoterm = product.incoterm || 'FOB';
  const unit = product.unit || 'MT';
  const origin = product.origin || product.portOfOrigin || 'Global';
  const availableQty = product.quantity || 0;
  const isOutOfStock = availableQty < 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleViewDetails}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleViewDetails();
        }
      }}
      className="group cursor-pointer flex flex-col h-full rounded-xl border border-border-default bg-surface hover:border-accent-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-all duration-200 overflow-hidden"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-subtle">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Minimalist Top Tag (incoterm lives in the price row) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface/90 backdrop-blur-md text-foreground-secondary border border-border-subtle shadow-2xs">
            {product.category}
          </span>
        </div>

        {isOutOfStock && (
          <div className="absolute top-2.5 right-2.5">
            <Badge variant="danger" size="sm" hasDot className="bg-surface/95 backdrop-blur-md text-[10px]">
              Allocated
            </Badge>
          </div>
        )}
      </div>

      {/* Card Body — Clean, Focused & Breathable */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Origin & Sector Location */}
          <div className="flex items-center gap-1 text-[11px] text-foreground-muted mb-1 truncate">
            <HiLocationMarker className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
            <span className="truncate">{origin}</span>
          </div>

          {/* Commodity Name */}
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-1 group-hover:text-accent-primary transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing & Supply Row */}
        <div className="pt-3 border-t border-border-subtle flex items-end justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-foreground-muted">
              Unit Price ({incoterm})
            </div>
            <div className="text-sm font-bold text-foreground tabular-nums font-mono">
              ${product.price?.toLocaleString()}
              <span className="text-[11px] font-normal text-foreground-muted ml-0.5">
                /{unit}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-mono text-foreground-muted">
              {availableQty.toLocaleString()} {unit} avail.
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-accent-primary group-hover:translate-x-0.5 transition-transform mt-0.5">
              <span>View</span>
              <HiArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
