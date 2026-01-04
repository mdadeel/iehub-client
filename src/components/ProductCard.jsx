import { useNavigate } from 'react-router-dom';
import { HiStar, HiLocationMarker, HiInbox } from 'react-icons/hi';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{product.name}</h3>
                    <span style={{
                        background: 'var(--bg-subtle-light)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--primary)'
                    }}>
                        {product.category}
                    </span>
                </div>

                <div className="flex items-center gap-1" style={{ marginBottom: '1rem', color: '#ffc107' }}>
                    <HiStar />
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>{product.rating}</span>
                </div>

                <div className="flex flex-col gap-2" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    <div className="flex items-center gap-2 text-muted">
                        <HiLocationMarker style={{ color: 'var(--secondary)' }} />
                        <span>Origin: {product.origin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                        <HiInbox style={{ color: 'var(--accent)' }} />
                        <span>Quantity: {product.quantity} units</span>
                    </div>
                </div>

                <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        ${product.price.toFixed(2)}
                    </span>
                    <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                        See Details
                    </button>
                </div>
            </div>

            <style>{`
        .text-muted { color: var(--text-muted-light); }
        .dark .text-muted { color: var(--text-muted-dark); }
        .dark .card h3 { color: var(--secondary-light); }
        .dark .card span[style*="background: var(--bg-subtle-light)"] { 
          background: var(--bg-subtle-dark); 
          color: var(--secondary);
        }
      `}</style>
        </div>
    );
};

export default ProductCard;
