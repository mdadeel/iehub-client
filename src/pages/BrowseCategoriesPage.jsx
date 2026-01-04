import { motion } from 'framer-motion';

const BrowseCategoriesPage = () => {
    const categories = [
        { name: "Electronics", count: "1.2k Products", icon: "📱" },
        { name: "Industrial", count: "850 Products", icon: "🏗️" },
        { name: "Textiles", count: "2.1k Products", icon: "🧵" },
        { name: "Agriculture", count: "920 Products", icon: "🌾" },
        { name: "Automotive", count: "640 Products", icon: "🚗" },
        { name: "Chemicals", count: "430 Products", icon: "🧪" },
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
                    Browse <span style={{ color: 'var(--primary)' }}>Categories</span>
                </motion.h1>
                <p style={{ opacity: 0.5, fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Explore our global marketplace organized by sector and demand.</p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {categories.map((cat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10, scale: 1.02 }}
                        style={{
                            padding: '3rem',
                            background: 'var(--bg-glass)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '32px',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{cat.icon}</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{cat.name}</h3>
                        <p style={{ opacity: 0.6, fontWeight: 600 }}>{cat.count}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default BrowseCategoriesPage;
