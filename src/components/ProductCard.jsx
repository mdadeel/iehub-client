import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight, HiLocationMarker, HiShieldCheck, HiScale } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Badge } from './ui/Badge';
import { cn } from '@/lib/utils';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250' fill='%23F1F5F9'%3E%3Crect width='400' height='250' fill='%23F1F5F9'/%3E%3Cpath d='M160 140l30-30 40 40 20-20 30 30H160z' fill='%2394A3B8' opacity='0.4'/%3E%3Ccircle cx='180' cy='90' r='15' fill='%2394A3B8' opacity='0.4'/%3E%3Ctext x='50%25' y='80%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2364748B'%3ETrade Commodity Asset%3C/text%3E%3C/svg%3E";

const ProductCard = ({ product, isCompared = false, onToggleCompare }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(product.image || FALLBACK_IMAGE);

  const handleViewDetails = () => {
    navigate(`/products/${product._id || product.id}`);
  };

  const incoterm = product.incoterm || 'FOB';
  const unit = product.unit || 'Unit';
  const origin = product.origin || product.portOfOrigin || 'Global';
  const availableQty = product.quantity || 0;
  const isOutOfStock = availableQty < 1;
  const moq = product.moq || 1;
  const isVerified = product.verificationStatus === 'verified' || !product.verificationStatus; // existing verified seed items

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
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Tag: Category & Compare Checkbox */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface/90 backdrop-blur-md text-foreground-secondary border border-border-subtle shadow-2xs">
            {product.category}
          </span>
        </div>

        {onToggleCompare && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product);
              }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all shadow-xs backdrop-blur-md select-none",
                isCompared
                  ? "bg-accent-primary text-white border border-accent-primary shadow-sm ring-2 ring-accent-primary/25"
                  : "bg-surface/90 hover:bg-surface text-foreground border border-border-default/80 hover:border-border-hover"
              )}
              title={isCompared ? "Remove from comparison" : "Add to comparison"}
              aria-pressed={isCompared}
            >
              <HiScale className={cn("w-3.5 h-3.5 transition-transform", isCompared && "scale-110")} />
              <span>{isCompared ? "Comparing" : "Compare"}</span>
            </button>
          </div>
        )}

        {isOutOfStock && !onToggleCompare && (
          <div className="absolute top-2.5 right-2.5">
            <Badge variant="danger" size="sm" hasDot className="bg-surface/95 backdrop-blur-md text-[10px]">
              Allocated
            </Badge>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Origin & Verification Details */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-foreground-muted mb-1 truncate">
            <div className="flex items-center gap-1 truncate">
              <HiLocationMarker className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
              <span className="truncate">{origin}</span>
            </div>
            {isVerified && (
              <span className="inline-flex items-center gap-0.5 text-status-success text-[10px] font-medium shrink-0">
                <HiShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Commodity Name */}
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-1 group-hover:text-accent-primary transition-colors">
            {product.name}
          </h3>

          {/* MOQ / Lead time indicator */}
          <div className="text-[11px] text-foreground-muted mt-1">
            MOQ: <span className="font-medium text-foreground">{moq.toLocaleString()} {unit}</span>
          </div>
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
