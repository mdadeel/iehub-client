const AboutUsPage = () => {
    return (
        <div className="container" style={{ padding: '6rem 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="section-title">Our <span style={{ color: 'var(--primary)' }}>Story</span></h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.8, textAlign: 'center', marginBottom: '4rem' }}>
                    Empowering global businesses to transcend borders through a seamless trade ecosystem.
                </p>

                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '6rem' }}>
                    <div>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>The Mission</h2>
                        <p style={{ opacity: 0.8 }}>
                            ExportHub was founded with a single goal: to simplify the complexities of international trade.
                            We believe that every business, regardless of size, deserves access to global markets.
                            Our platform bridges the gap between local exporters and international importers through
                            advanced technology and a verified network.
                        </p>
                    </div>
                    <div>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Our Vision</h2>
                        <p style={{ opacity: 0.8 }}>
                            We envision a world where global trade is as effortless as local commerce.
                            By fostering transparency, security, and efficiency, we aim to become the
                            backbone of the digital global supply chain.
                        </p>
                    </div>
                </div>

                <div className="card" style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-subtle-light)' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Global Reach in Numbers</h2>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>150+</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>Countries</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>10K+</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>Products</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>2.5K+</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>Exporters</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>$45M</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>Trade Vol</div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .dark .card { background: var(--bg-subtle-dark); }
            `}</style>
        </div>
    );
};

export default AboutUsPage;
