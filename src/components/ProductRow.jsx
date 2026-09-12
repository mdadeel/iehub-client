import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiLocationMarker, HiArrowRight, HiShieldCheck } from 'react-icons/hi';
import { TableRow, TableCell } from './ui/Table';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80' fill='%23F1F5F9'%3E%3Crect width='80' height='80' fill='%23F1F5F9'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%2364748B'%3EAsset%3C/text%3E%3C/svg%3E";

const ProductRow = ({ product, isCompared = false, onToggleCompare }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(product.image || FALLBACK_IMAGE);

  const handleViewDetails = () => {
    navigate(`/products/${product._id || product.id}`);
  };

  const isLowStock = (product.quantity || 0) < 20;
  const unit = product.unit || 'Unit';
  const incoterm = product.incoterm || 'FOB';
  const moq = product.moq || 1;
  const isVerified = product.verificationStatus === 'verified' || !product.verificationStatus;

  return (
    <TableRow className="cursor-pointer group" onClick={handleViewDetails}>
      {onToggleCompare && (
        <TableCell className="w-8 py-2 text-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isCompared}
            onChange={() => onToggleCompare(product)}
            className="w-3.5 h-3.5 rounded text-accent-primary focus:ring-0 cursor-pointer"
            aria-label={`Compare ${product.name}`}
          />
        </TableCell>
      )}

      <TableCell className="w-12 py-2">
        <div className="w-9 h-9 rounded-md overflow-hidden bg-surface-subtle border border-border-default shrink-0">
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
      </TableCell>

      <TableCell className="py-2 font-medium">
        <div className="font-semibold text-xs text-foreground group-hover:text-accent-primary transition-colors line-clamp-1">
          {product.name}
        </div>
        <div className="text-[10px] text-foreground-muted flex items-center gap-1.5">
          <span>SKU-{String(product._id || product.id).slice(-6).toUpperCase()}</span>
          {isVerified && (
            <span className="inline-flex items-center gap-0.5 text-status-success font-normal">
              <HiShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className="py-2 text-xs text-foreground-secondary">
        <div className="flex items-center gap-1">
          <HiLocationMarker className="w-3.5 h-3.5 text-foreground-subtle" />
          <span>{product.origin || 'Global'}</span>
        </div>
        <div className="text-[10px] text-foreground-muted mt-0.5">{product.category} · MOQ {moq.toLocaleString()} {unit}</div>
      </TableCell>

      <TableCell className="py-2 text-right">
        <Badge
          variant={isLowStock ? "warning" : "success"}
          hasDot
          size="sm"
        >
          {product.quantity > 0 ? `${product.quantity.toLocaleString()} ${unit}` : "Out of stock"}
        </Badge>
      </TableCell>

      <TableCell className="py-2 text-right font-mono font-medium text-xs text-foreground tabular-nums">
        ${product.price?.toLocaleString()}
        <span className="text-[10px] text-foreground-muted ml-0.5 font-sans">
          /{unit} <span className="font-mono text-[9px] uppercase text-foreground-muted">({incoterm})</span>
        </span>
      </TableCell>

      <TableCell className="py-2 text-right w-24">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-[11px] gap-1 group-hover:border-accent-primary group-hover:text-accent-primary"
        >
          Spec <HiArrowRight className="w-3 h-3" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ProductRow;
