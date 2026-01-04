import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div style={{
            position: 'relative',
            height: '85vh',
            minHeight: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-dark)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '4rem',
            boxShadow: 'var(--shadow-lg)',
            width: '100%'
        }}>
            {/* Animated Background Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'url("https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat',
                opacity: 0.6
            }}></div>
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.4) 100%)',
                zIndex: 1
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ maxWidth: '750px', textAlign: 'center' }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.2)',
                            padding: '0.5rem 1rem', borderRadius: '30px', color: 'var(--primary-light)',
                            fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px'
                        }}
                    >
                        <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></span>
                        Global Trade Hub v2.0
                    </motion.div>

                    <h1 style={{ fontSize: '3.2rem', marginBottom: '1.25rem', lineHeight: '1.1', fontWeight: 800, color: 'white' }}>
                        Connect the World <br />
                        <span style={{
                            background: 'linear-gradient(to right, var(--secondary), #fff)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>Seamlessly.</span>
                    </h1>

                    <p style={{ fontSize: '1rem', marginBottom: '2.5rem', opacity: 0.8, fontWeight: 400, maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6, color: '#f8fafc' }}>
                        The most sophisticated ecosystem for global exporters and importers.
                        List your inventory or source premium goods with a single click.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/products" className="btn btn-primary" style={{ padding: '0.8rem 2.2rem', fontSize: '1rem', borderRadius: '14px' }}>
                                Start Trading
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/register" className="btn" style={{
                                padding: '0.8rem 2.2rem', fontSize: '1rem', borderRadius: '14px',
                                border: '1px solid rgba(255,255,255,0.2)', color: 'white', background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                Join Network
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
