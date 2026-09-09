import { useNavigate } from 'react-router-dom';
import { HiLocationMarker, HiArrowRight } from 'react-icons/hi';
import { TableRow, TableCell } from './ui/Table';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

const ProductRow = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/products/${product._id || product.id}`);
  };

  const isLowStock = (product.quantity || 0) < 20;

  return (
    <TableRow className="cursor-pointer group" onClick={handleViewDetails}>
      <TableCell className="w-12 py-2">
        <div className="w-9 h-9 rounded-md overflow-hidden bg-surface-subtle border border-border-default shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
      </TableCell>

      <TableCell className="py-2 font-medium">
        <div className="font-semibold text-xs text-foreground group-hover:text-accent-primary transition-colors line-clamp-1">
          {product.name}
        </div>
        <div className="text-[10px] text-foreground-muted">
          SKU-{String(product._id || product.id).slice(-6).toUpperCase()}
        </div>
      </TableCell>

      <TableCell className="py-2 text-xs text-foreground-secondary">
        <div className="flex items-center gap-1">
          <HiLocationMarker className="w-3.5 h-3.5 text-foreground-subtle" />
          <span>{product.origin || 'Global'}</span>
        </div>
        <div className="text-[10px] text-foreground-muted mt-0.5">{product.category}</div>
      </TableCell>

      <TableCell className="py-2 text-right">
        <Badge
          variant={isLowStock ? "warning" : "success"}
          hasDot
          size="sm"
        >
          {product.quantity > 0 ? `${product.quantity.toLocaleString()} units` : "Out of stock"}
        </Badge>
      </TableCell>

      <TableCell className="py-2 text-right font-mono font-medium text-xs text-foreground tabular-nums">
        ${product.price?.toLocaleString()}
        <span className="text-[10px] text-foreground-muted ml-0.5">/ea</span>
      </TableCell>

      <TableCell className="py-2 text-right w-28">
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
