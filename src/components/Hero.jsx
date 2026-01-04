import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div style={{
            position: 'relative',
            height: '75vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '4rem',
            boxShadow: 'var(--shadow-lg)'
        }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ maxWidth: '700px' }}
                >
                    <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1', fontWeight: 800 }}>
                        Elevate Your <span style={{ color: 'var(--secondary)' }}>Global Trade</span> Reach
                    </h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9, fontWeight: 400, maxWidth: '600px' }}>
                        The ultimate hub for seamless export management and global product imports.
                        Connect with international markets through our premium trade network.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/products" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem' }}>
                            Explore Products
                        </Link>
                        <Link to="/register" className="btn btn-secondary" style={{ padding: '1.2rem 2.5rem' }}>
                            Get Started
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
