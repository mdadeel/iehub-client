import { motion } from 'framer-motion';

const TradeExpertsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ paddingTop: '160px', paddingBottom: '120px' }}
            className="container"
        >
            <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <h1 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-3px' }}>The <span style={{ color: 'var(--primary)' }}>Expertise</span></h1>
                <p style={{ opacity: 0.5, fontSize: '1.3rem', fontWeight: 600 }}>Meet the architects of global connectivity.</p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
                {[1, 2, 3].map((_, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        style={{
                            overflow: 'hidden',
                            borderRadius: '40px',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        <div style={{ height: '300px', background: 'var(--bg-inset)' }}></div>
                        <div style={{ padding: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Executive Consultant</h3>
                            <p style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '1.5rem', letterSpacing: '2px' }}>Strategic Market Entry</p>
                            <p style={{ opacity: 0.5, lineHeight: 1.6 }}>15+ years of experience in navigating international trade laws and cross-border logistics.</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default TradeExpertsPage;
