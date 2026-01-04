import Hero from '../components/Hero';
import LatestProducts from '../components/LatestProducts';
import { HiLightningBolt, HiShieldCheck, HiGlobeAlt, HiChartBar } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SectionHeader = ({ title, highlight, subtitle }) => (
    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.8rem', letterSpacing: '-1.5px' }}
        >
            {title} <span style={{ color: 'var(--primary)' }}>{highlight}</span>
        </motion.h2>
        {subtitle && (
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ opacity: 0.5, maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.6 }}
            >
                {subtitle}
            </motion.p>
        )}
    </div>
);

const Features = () => {
    const features = [
        { icon: <HiLightningBolt />, title: "Fast Sync", desc: "Real-time updates on your global trade activities." },
        { icon: <HiShieldCheck />, title: "Secure Trade", desc: "Verified exporters and secure payment gateways." },
        { icon: <HiGlobeAlt />, title: "Global Network", desc: "Access markets in over 150+ countries worldwide." },
        { icon: <HiChartBar />, title: "Advanced Analytics", desc: "Insightful data to help you grow your export business." },
    ];

    return (
        <section style={{ background: 'var(--bg-surface)' }}>
            <div className="container">
                <SectionHeader title="Why Choose" highlight="ExportHub?" subtitle="We provide the tools you need to succeed in the international marketplace." />
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="card"
                            style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
                        >
                            <div style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem', opacity: 0.8 }}>{f.icon}</div>
                            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>{f.title}</h3>
                            <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Stats = () => {
    const stats = [
        { label: "Active Exporters", value: "2.5K+" },
        { label: "Global Products", value: "10K+" },
        { label: "Trade Volume", value: "$45M+" },
        { label: "Countries Served", value: "120+" },
    ];

    return (
        <section style={{ background: 'var(--bg-dark)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, var(--primary-dark), transparent)', opacity: 0.3 }}></div>
            <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.5rem' }}>{s.value}</div>
                        <div style={{ fontSize: '1rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>{s.label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const steps = [
        { num: "01", title: "Join Hub", desc: "Create your account and define your trade role." },
        { num: "02", title: "List Products", desc: "Add your exports with detailed specs and media." },
        { num: "03", title: "Global Search", desc: "Browse international goods for your local market." },
        { num: "04", title: "One-Click Import", desc: "Import any product into your personal dashboard." },
    ];

    return (
        <section>
            <div className="container">
                <SectionHeader title="Streamlined" highlight="Workflow" subtitle="Getting started with global trade has never been easier." />
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
                    {steps.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            style={{ textAlign: 'center', position: 'relative' }}
                        >
                            <div style={{
                                fontSize: '6rem',
                                fontWeight: 900,
                                background: 'linear-gradient(to bottom, var(--primary), transparent)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                opacity: 0.1,
                                position: 'absolute',
                                top: '-40px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: -1
                            }}>{s.num}</div>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-body)', fontWeight: 700 }}>{s.title}</h3>
                            <p style={{ opacity: 0.7, lineHeight: 1.6 }}>{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const reviews = [
        { name: "John Doe", role: "CEO, TradeCo", text: "ExportHub transformed how we handle international shipping. Exceptional platform!" },
        { name: "Sarah Lee", role: "Global Importer", text: "Finding reliable products from abroad has never been this easy and transparent." },
        { name: "Ahmed Khan", role: "Artisan Exporter", text: "Finally a platform that respects local craftsmanship while providing global visibility." },
    ];

    return (
        <section style={{ background: 'var(--bg-surface)' }}>
            <div className="container">
                <SectionHeader title="Trusted by" highlight="Global Leaders" />
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {reviews.map((r, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="card"
                            style={{ padding: '2.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
                        >
                            <div style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1rem' }}>"</div>
                            <p style={{ marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.7, opacity: 0.9 }}>{r.text}</p>
                            <div className="flex items-center gap-3">
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{r.name[0]}</div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{r.name}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{r.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Newsletter = () => (
    <section>
        <div className="container">
            <div className="card" style={{
                background: 'var(--bg-dark)', color: 'white', padding: '4rem 2rem', textAlign: 'center',
                borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--primary) 0%, transparent 100%)', opacity: 0.2 }}></div>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Stay Informed</h2>
                    <p style={{ opacity: 0.7, marginBottom: '2.5rem' }}>Subscribe to get the latest trade opportunities and market insights.</p>
                    <div className="flex" style={{ gap: '1rem' }}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                        <button className="btn btn-primary" style={{ padding: '0 2.5rem' }}>Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const HomePage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container" style={{ paddingBottom: '8rem', paddingTop: '1rem' }}>
                <Hero />
            </div>
            <LatestProducts />
            <Stats />
            <HowItWorks />
            <Features />
            <Testimonials />
            <Newsletter />

            <section style={{ background: 'var(--bg-surface)' }}>
                <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1.5px' }}>Start Your Trade <span style={{ color: 'var(--primary)' }}>Journey</span></h2>
                    <p style={{ opacity: 0.5, marginBottom: '3rem', fontSize: '1.1rem', fontWeight: 600 }}>Connect with a worldwide network of trusted business partners.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="btn btn-primary" style={{ padding: '1.2rem 3rem' }}>Create Account</Link>
                        <Link to="/about" className="btn" style={{ border: '1px solid var(--border-color)', padding: '1.2rem 3rem' }}>Learn More</Link>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default HomePage;
