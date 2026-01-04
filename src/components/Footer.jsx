import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--bg-dark)',
            color: 'white',
            padding: '6rem 0 3rem 0',
            marginTop: '8rem',
            borderTop: '1px solid var(--border-color)'
        }}>
            <div className="container grid" style={{
                gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
                gap: '4rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px' }}>
                        IE <span style={{ color: 'var(--primary)' }}>HUB</span>
                    </div>
                    <p style={{ opacity: 0.6, lineHeight: 1.7, fontSize: '0.95rem' }}>
                        The ultimate ecosystem for global business connectivity. We bridge the gap between international suppliers and local markets with verified security and real-time synchronization.
                    </p>
                    <div className="flex gap-4" style={{ marginTop: '0.5rem' }}>
                        {[FaFacebook, FaXTwitter, FaGithub, FaLinkedin].map((Icon, i) => (
                            <motion.a
                                key={i}
                                href="#"
                                whileHover={{ y: -3, color: 'var(--primary)' }}
                                style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }}
                            >
                                <Icon size={20} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Marketplace</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
                        <li><Link to="/products" className="hover-link">All Products</Link></li>
                        <li><Link to="/categories" className="hover-link">Browse Categories</Link></li>
                        <li><Link to="/trades" className="hover-link">Latest Trades</Link></li>
                        <li><Link to="/shipping" className="hover-link">Global Logistics</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Company</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
                        <li><Link to="/about" className="hover-link">Our Story</Link></li>
                        <li><Link to="/careers" className="hover-link">Trade Experts</Link></li>
                        <li><Link to="/news" className="hover-link">Market Insights</Link></li>
                        <li><Link to="/contact" className="hover-link">Contact Support</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Global HQ</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
                        <p>123 Trade Center Plaza<br />New York, NY 10001, USA</p>
                        <p>support@iehub.global</p>
                        <p>+1 (888) TRADE-HUB</p>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-link:hover { color: var(--primary); padding-left: 5px; }
                .hover-link { transition: all 0.3s ease; display: block; }
                @media (max-width: 768px) {
                    footer .grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
