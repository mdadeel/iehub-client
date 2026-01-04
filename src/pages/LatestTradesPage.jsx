import { motion } from 'framer-motion';
import { HiTrendingUp, HiGlobeAlt, HiClock } from 'react-icons/hi';

const LatestTradesPage = () => {
    const trades = [
        { id: "TRD-8821", item: "Solar Panel Array", from: "China", to: "Germany", status: "In Transit" },
        { id: "TRD-7652", item: "Industrial Lathe", from: "Japan", to: "USA", status: "Cleared" },
        { id: "TRD-9011", item: "Premium Coffee Beans", from: "Brazil", to: "UK", status: "Processing" },
        { id: "TRD-4432", item: "Raw Silk Bolts", from: "India", to: "France", status: "Delivered" },
    ];

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
                    style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '1rem' }}
                >
                    Latest <span style={{ color: 'var(--primary)' }}>Trades</span>
                </motion.h1>
                <p style={{ opacity: 0.5, fontSize: '1.2rem' }}>Real-time telemetry of global commodity movement.</p>
            </div>

            <div className="flex flex-col gap-6">
                {trades.map((trade, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            padding: '2.5rem',
                            background: 'var(--bg-glass)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div className="flex items-center gap-6">
                            <div style={{ background: 'var(--primary)', color: 'white', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                <HiGlobeAlt />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{trade.item}</h3>
                                <p style={{ opacity: 0.4, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>ID: {trade.id}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{trade.from} → {trade.to}</div>
                            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>{trade.status}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default LatestTradesPage;
