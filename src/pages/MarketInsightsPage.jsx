import { motion } from 'framer-motion';

const MarketInsightsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ paddingBottom: '160px', paddingTop: 'var(--hero-padding-top)' }}
            className="container"
        >
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-2.5px' }}>Market <span style={{ color: 'var(--primary)' }}>Insights</span></h1>

            <div className="flex flex-col gap-12">
                {[1, 2, 3].map((_, i) => (
                    <motion.div
                        key={i}
                        className="flex-stack"
                        style={{ padding: '2rem', background: 'var(--bg-glass)', borderRadius: '32px', border: '1px solid var(--border-color)' }}
                    >
                        <div style={{ width: '100%', maxWidth: '400px', height: '240px', background: 'var(--bg-inset)', borderRadius: '24px', flexShrink: 0 }}></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ opacity: 0.4, fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Trade Analysis • Jan 2026</div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2 }}>Predictive Logistics: The Impact of AI on Global Shipping Fees</h2>
                            <p style={{ opacity: 0.6, fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>How machine learning is revolutionizing the way we calculate port congestion surcharges and optimizing international trade lanes.</p>
                            <button style={{ color: 'var(--primary)', fontWeight: 900, background: 'transparent', border: 'none', fontSize: '1rem', cursor: 'pointer' }}>READ ANALYSIS →</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default MarketInsightsPage;
