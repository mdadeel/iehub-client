import { useNavigate } from 'react-router-dom';
import { HiStar, HiLocationMarker, HiInbox, HiChevronRight, HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12 }}
            className="premium-product-card"
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '32px',
                overflow: 'hidden',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(40px)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            {/* Category Badge - Luxury Style */}
            <div style={{
                position: 'absolute',
                top: '1.5rem',
                left: '1.5rem',
                zIndex: 10,
                background: 'var(--primary)',
                color: 'white',
                padding: '0.4rem 1rem',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 900,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)'
            }}>
                {product.category}
            </div>

            {/* Image Section with Depth */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden', margin: '8px', borderRadius: '18px' }}>
                <motion.img
                    src={product.image}
                    alt={product.name}
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.8 }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                    pointerEvents: 'none'
                }}></div>

                {/* Product Price Floating on Image */}
                <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', marginBottom: '-2px' }}>Unit Value</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>${product.price ? product.price.toLocaleString() : 'N/A'}</div>
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '1rem 1.25rem 1.5rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 900,
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.3px',
                        lineHeight: 1.2
                    }}>
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <HiStar key={i} style={{ color: i < Math.floor(product.rating || 0) ? 'var(--secondary)' : 'rgba(255,255,255,0.1)', fontSize: '0.85rem' }} />
                        ))}
                    </div>
                </div>

                {/* Technical Specs Inset */}
                <div style={{
                    background: 'var(--bg-inset)',
                    padding: '0.8rem',
                    borderRadius: '16px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.03)'
                }}>
                    <div className="flex flex-col">
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.4, textTransform: 'uppercase', marginBottom: '2px' }}>Origin Port</span>
                        <div className="flex items-center gap-1.5">
                            <HiLocationMarker style={{ color: 'var(--primary)', fontSize: '0.8rem' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{product.origin}</span>
                        </div>
                    </div>
                    <div className="flex flex-col border-l border-white/5 pl-3">
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.4, textTransform: 'uppercase', marginBottom: '2px' }}>Vol Available</span>
                        <div className="flex items-center gap-1.5">
                            <HiInbox style={{ color: 'var(--secondary)', fontSize: '0.8rem' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{product.quantity}</span>
                        </div>
                    </div>
                </div>

                {/* Interactive CTA */}
                <motion.button
                    onClick={() => navigate(`/products/${product._id}`)}
                    whileHover={{ x: 5 }}
                    style={{
                        marginTop: 'auto',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        padding: 0
                    }}
                >
                    VIEW SPECIFICATIONS <HiArrowRight />
                </motion.button>
            </div>

            <style>{`
                .premium-product-card:hover { 
                    border-color: var(--primary);
                    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.3);
                }
                .premium-product-card:after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, var(--primary) 0%, transparent 100%);
                    opacity: 0;
                    transition: 0.5s;
                    pointer-events: none;
                    z-index: -1;
                }
                .premium-product-card:hover:after { opacity: 0.05; }
            `}</style>
        </motion.div>
    );
};

export default ProductCard;
