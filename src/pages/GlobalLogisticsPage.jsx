import { motion } from 'framer-motion';

const GlobalLogisticsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ paddingTop: '160px', paddingBottom: '120px' }}
            className="container"
        >
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '1.5rem' }}
                >
                    Global <span style={{ color: 'var(--primary)' }}>Logistics</span>
                </motion.h1>
                <div style={{ height: '300px', borderRadius: '40px', background: 'var(--bg-inset)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                    <p style={{ opacity: 0.3, fontWeight: 700, fontSize: '1.5rem' }}>Interactive Trade Map Coming Soon</p>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                <div style={{ padding: '3rem', background: 'var(--bg-glass)', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem' }}>Strategic Routing</h2>
                    <p style={{ opacity: 0.6, lineHeight: 1.8 }}>Our algorithmic routing engine ensures that your commodities reach their destination via the most efficient channels, bypassing geopolitical bottlenecks and optimizing for fuel and time.</p>
                </div>
                <div style={{ padding: '3rem', background: 'var(--bg-glass)', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem' }}>Security Protocol</h2>
                    <p style={{ opacity: 0.6, lineHeight: 1.8 }}>Every shipment is monitored via end-to-end telemetry and blockchain-verified manifests, ensuring that what you send is exactly what arrives, with zero tampering risk.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default GlobalLogisticsPage;
