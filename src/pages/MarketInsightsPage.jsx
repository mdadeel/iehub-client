import { motion } from 'framer-motion';

const MarketInsightsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ paddingTop: '160px', paddingBottom: '120px' }}
            className="container"
        >
            <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-2.5px' }}>Market <span style={{ color: 'var(--primary)' }}>Insights</span></h1>

            <div className="flex flex-col gap-12">
                {[1, 2, 3].map((_, i) => (
                    <motion.div
                        key={i}
                        className="flex gap-12 items-center"
                        style={{ padding: '3rem', background: 'var(--bg-glass)', borderRadius: '40px', border: '1px solid var(--border-color)' }}
                    >
                        <div style={{ width: '400px', height: '240px', background: 'var(--bg-inset)', borderRadius: '24px' }}></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ opacity: 0.4, fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Trade Analysis • Jan 2026</div>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.2 }}>Predictive Logistics: The Impact of AI on Global Shipping Fees</h2>
                            <p style={{ opacity: 0.6, fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>How machine learning is revolutionizing the way we calculate port congestion surcharges and optimizing international trade lanes.</p>
                            <button style={{ color: 'var(--primary)', fontWeight: 900, background: 'transparent', border: 'none', fontSize: '1rem', cursor: 'pointer' }}>READ ANALYSIS →</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default MarketInsightsPage;
