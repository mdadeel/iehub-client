import { motion } from 'framer-motion';
import { HiGlobeAlt, HiShieldCheck, HiTrendingUp, HiUsers } from 'react-icons/hi';

const AboutUsPage = () => {
    const stats = [
        { label: "Global Reach", value: "150+", icon: <HiGlobeAlt />, desc: "Trading across borders seamlessly." },
        { label: "Verified Supply", value: "10K+", icon: <HiShieldCheck />, desc: "Premium product catalog." },
        { label: "Trusted Partners", value: "2.5K+", icon: <HiUsers />, desc: "Elite network of exporters." },
        { label: "Trade Volume", value: "$45M+", icon: <HiTrendingUp />, desc: "Year-to-date transaction value." },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ padding: '2.4rem 0 8rem 0' }}
        >
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.2rem', letterSpacing: '-2px' }}
                    >
                        Our Digital <span style={{ color: 'var(--primary)' }}>Heritage</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '1.1rem', opacity: 0.5, maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, fontWeight: 600 }}
                    >
                        ExportHub is a sophisticated ecosystem designed to empower enterprises
                        to transcend borders through verified technology and global trust.
                    </motion.p>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '8rem', marginBottom: '10rem', alignItems: 'center' }}>
                    <motion.div
                        initial={{ x: -40, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 900, letterSpacing: '-1px' }}>The Central <span style={{ color: 'var(--primary)' }}>Mission</span></h2>
                        <p style={{ opacity: 0.6, fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 500 }}>
                            Founded in 2024, ExportHub was architected to solve the multi-layered complexities of international logistics and sector verification.
                            We believe transparency is the fundamental currency of global commerce.
                        </p>
                        <p style={{ opacity: 0.6, fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 }}>
                            Our infrastructure bridges the gap between artisan exporters and international corporate buyers
                            through a highly automated, secure network that ensures every transaction is verified at the source.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ position: 'relative' }}
                    >
                        <div style={{
                            width: '100%',
                            aspectRatio: '1',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                            opacity: 0.15,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: -1,
                            filter: 'blur(40px)'
                        }}></div>
                        <div style={{
                            padding: '3rem',
                            background: 'var(--bg-glass)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '32px',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 900 }}>Global Vision</h3>
                            <p style={{ opacity: 0.5, fontSize: '0.95rem', fontWeight: 600 }}>"Empowering every local entity to become a verified global leader."</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem' }}>
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="card"
                            style={{
                                padding: '2.5rem',
                                textAlign: 'center',
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '28px',
                                boxShadow: 'var(--shadow)'
                            }}
                        >
                            <div style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1.25rem' }}>{s.icon}</div>
                            <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>{s.value}</div>
                            <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', opacity: 0.4 }}>{s.label}</div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.5, fontWeight: 600, lineHeight: 1.5 }}>{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AboutUsPage;
