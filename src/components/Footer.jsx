import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-figma-black text-white pt-20 pb-10">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="flex flex-col gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-figma-blue rounded-lg flex items-center justify-center p-1.5 shadow-lg shadow-figma-blue/20">
                                <img src="/logo.png" alt="IEHUB" className="w-full h-full object-contain brightness-0 invert" />
                            </div>
                            <span className="font-black text-xl tracking-tighter">
                                IE<span className="text-figma-blue">HUB</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            The ultimate ecosystem for global business connectivity. We bridge the gap between international suppliers and local markets with verified security.
                        </p>
                        <div className="flex gap-4">
                            {[FaFacebook, FaXTwitter, FaGithub, FaLinkedin].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ y: -3, color: '#0D99FF' }}
                                    className="text-muted-foreground hover:text-white transition-colors"
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-6">Marketplace</h4>
                        <ul className="flex flex-col gap-4 text-sm text-muted-foreground font-medium">
                            <li><Link to="/products" className="hover:text-figma-blue transition-colors">All Products</Link></li>
                            <li><Link to="/categories" className="hover:text-figma-blue transition-colors">Browse Categories</Link></li>
                            <li><Link to="/trades" className="hover:text-figma-blue transition-colors">Latest Trades</Link></li>
                            <li><Link to="/shipping" className="hover:text-figma-blue transition-colors">Global Logistics</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-6">Company</h4>
                        <ul className="flex flex-col gap-4 text-sm text-muted-foreground font-medium">
                            <li><Link to="/about" className="hover:text-figma-blue transition-colors">Our Story</Link></li>
                            <li><Link to="/careers" className="hover:text-figma-blue transition-colors">Trade Experts</Link></li>
                            <li><Link to="/news" className="hover:text-figma-blue transition-colors">Market Insights</Link></li>
                            <li><Link to="/contact" className="hover:text-figma-blue transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-6">Global HQ</h4>
                        <div className="flex flex-col gap-4 text-sm text-muted-foreground font-medium">
                            <p>123 Trade Center Plaza<br />New York, NY 10001, USA</p>
                            <p>support@iehub.global</p>
                            <p>+1 (888) TRADE-HUB</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-muted-foreground tracking-widest uppercase">
                    <div>© 2026 IEHUB GLOBAL NETWORK. ALL RIGHTS RESERVED.</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Compliance</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
