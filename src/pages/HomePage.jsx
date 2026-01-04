import Hero from '../components/Hero';
import LatestProducts from '../components/LatestProducts';
import { HiLightningBolt, HiShieldCheck, HiGlobeAlt, HiChartBar, HiChevronDown } from 'react-icons/hi';
import { useState } from 'react';

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
                <h2 className="section-title">Why Choose <span style={{ color: 'var(--primary)' }}>ExportHub?</span></h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                    {features.map((f, i) => (
                        <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: '1rem' }}>{f.icon}</div>
                            <h3 style={{ marginBottom: '1rem' }}>{f.title}</h3>
                            <p style={{ opacity: 0.8 }}>{f.desc}</p>
                        </div>
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
        <section style={{ background: 'var(--primary)', color: 'white' }}>
            <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                {stats.map((s, i) => (
                    <div key={i}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--secondary)' }}>{s.value}</div>
                        <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>{s.label}</div>
                    </div>
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
                <h2 className="section-title">How It <span style={{ color: 'var(--secondary)' }}>Works</span></h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                    {steps.map((s, i) => (
                        <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                            <div style={{
                                fontSize: '4rem',
                                fontWeight: 900,
                                opacity: 0.1,
                                position: 'absolute',
                                top: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: -1
                            }}>{s.num}</div>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{s.title}</h3>
                            <p style={{ opacity: 0.8 }}>{s.desc}</p>
                        </div>
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
                <h2 className="section-title">What Our <span style={{ color: 'var(--primary)' }}>Partners Say</span></h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {reviews.map((r, i) => (
                        <div key={i} className="card" style={{ padding: '2rem', fontStyle: 'italic' }}>
                            <p style={{ marginBottom: '1.5rem' }}>"{r.text}"</p>
                            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.name}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{r.role}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Newsletter = () => {
    return (
        <section style={{ background: 'var(--bg-subtle-dark)', color: 'white' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <h2 className="section-title" style={{ color: 'white' }}>Stay <span style={{ color: 'var(--secondary)' }}>Updated</span></h2>
                <p style={{ marginBottom: '2rem' }}>Subscribe for global trade insights and latest product alerts.</p>
                <div className="flex justify-center" style={{ maxWidth: '500px', margin: '0 auto', gap: 0 }}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                            border: 'none',
                            outline: 'none'
                        }}
                    />
                    <button className="btn btn-secondary" style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0', padding: '0 2rem' }}>
                        Subscribe
                    </button>
                </div>
            </div>
        </section>
    );
};

const FAQ = () => {
    const [active, setActive] = useState(0);
    const faqs = [
        { q: "How do I start exporting?", a: "Register as an exporter, complete your profile, and start adding your products to our global catalog." },
        { q: "What are the import limits?", a: "Import quantity cannot exceed the available exported quantity listed on the product details page." },
        { q: "Is ExportHub secure?", a: "Yes, we use industry-standard encryption and verified user roles to ensure safe global trading." },
    ];

    return (
        <section>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 className="section-title">Frequently Asked <span style={{ color: 'var(--primary)' }}>Questions</span></h2>
                <div className="flex flex-col gap-4">
                    {faqs.map((f, i) => (
                        <div key={i} className="card" style={{ padding: '1rem' }} onClick={() => setActive(i)}>
                            <div className="flex justify-between items-center" style={{ cursor: 'pointer', fontWeight: 600 }}>
                                {f.q} <HiChevronDown style={{ transform: active === i ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                            </div>
                            {active === i && <p style={{ marginTop: '1rem', opacity: 0.8 }}>{f.a}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CategoriesList = () => {
    const cats = ["Electronics", "Textiles", "Spices", "Fashion", "Handicrafts", "Automotive"];
    return (
        <section style={{ background: 'var(--bg-surface)' }}>
            <div className="container">
                <h2 className="section-title">Top <span style={{ color: 'var(--primary)' }}>Categories</span></h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    {cats.map((c, i) => (
                        <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                            {c}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HomePage = () => {
    return (
        <div>
            <div className="container" style={{ paddingTop: '120px' }}>
                <Hero />
            </div>
            <LatestProducts />
            <HowItWorks />
            <CategoriesList />
            <Features />
            <Stats />
            <FAQ />
            <Testimonials />
            <Newsletter />
            <section>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 className="section-title">Ready to Start Exporting?</h2>
                    <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>Join thousands of businesses expanding their reach today.</p>
                    <button className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Create Free Account</button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
