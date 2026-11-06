import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight, HiLocationMarker, HiShieldCheck, HiScale } from 'react-icons/hi';
import { Badge } from './ui/Badge';
import { cn } from '@/lib/utils';

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23F1EDE8'%3E%3Crect width='400' height='300' fill='%23F1EDE8'/%3E%3Cpath d='M150 170l35-38 45 48 24-24 46 52H150z' fill='%239AA0A4' opacity='0.35'/%3E%3Ccircle cx='180' cy='106' r='16' fill='%239AA0A4' opacity='0.35'/%3E%3Ctext x='50%25' y='82%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='11' letter-spacing='2' fill='%236C7378'%3ECARGO LOT%3C/text%3E%3C/svg%3E";

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
  const isVerified = product.verificationStatus === 'verified' || !product.verificationStatus;

  return (
    <div
      onClick={handleViewDetails}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleViewDetails();
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden border border-border-default bg-surface transition-all duration-200 hover:border-foreground/25 hover:shadow-[0_18px_40px_-32px_rgba(16,20,23,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
    >
      {/* Visual asset */}
      <div className="media aspect-[4/3]">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {/* Category chip */}
        <span className="absolute left-0 top-0 bg-surface/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-secondary backdrop-blur">
          {product.category}
        </span>

        {/* Verification stamp */}
        {isVerified && (
          <span className="absolute bottom-0 left-0 inline-flex items-center gap-1 bg-[#0B7A52] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
            <HiShieldCheck className="h-3 w-3" />
            Lab verified
          </span>
        )}

        {onToggleCompare && (
          <div className="absolute right-2 top-2 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product);
              }}
              className={cn(
                'flex select-none items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition-all',
                isCompared
                  ? 'bg-accent-primary text-white'
                  : 'bg-surface/92 text-foreground-secondary hover:bg-surface hover:text-foreground'
              )}
              title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
              aria-pressed={isCompared}
            >
              <HiScale className="h-3.5 w-3.5" />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>
        )}

        {isOutOfStock && !onToggleCompare && (
          <div className="absolute right-2 top-2">
            <Badge variant="danger" size="sm" hasDot className="bg-surface/95 text-[10px] backdrop-blur">
              Allocated
            </Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-foreground-muted">
          <HiLocationMarker className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" />
          <span className="truncate">{origin}</span>
        </div>

        <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-foreground transition-colors group-hover:text-accent-primary">
          {product.name}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-foreground-muted">
          {product.hsCode && (
            <span className="border border-border-subtle bg-surface-subtle px-1.5 py-0.5 font-mono text-[10px] text-foreground-secondary">
              HS {product.hsCode}
            </span>
          )}
          <span>
            MOQ{' '}
            <strong className="font-semibold text-foreground">
              {moq.toLocaleString()} {unit}
            </strong>
          </span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between border-t border-border-subtle pt-3">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground-subtle">
                {incoterm} unit price
              </div>
              <div className="mt-0.5 font-display text-[17px] font-bold tabular-nums text-foreground">
                ${product.price?.toLocaleString()}
                <span className="ml-0.5 text-[11px] font-medium text-foreground-muted">
                  /{unit}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-[10px] text-foreground-muted">
                {availableQty.toLocaleString()} {unit} avail.
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-accent-primary">
                View lot <HiArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
