import Hero from '../components/Hero';
import LatestProducts from '../components/LatestProducts';
import { HiLightningBolt, HiShieldCheck, HiGlobeAlt, HiChartBar } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const SectionHeader = ({ title, highlight, subtitle }) => (
    <div className="text-center mb-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                {title} <span className="text-figma-blue">{highlight}</span>
            </h2>
            {subtitle && (
                <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </motion.div>
    </div>
);

const Features = () => {
    const features = [
        { icon: <HiLightningBolt />, title: "Live Updates", desc: "Get instant information about your global supply chain.", color: "bg-figma-blue" },
        { icon: <HiShieldCheck />, title: "Trusted Sellers", desc: "Every exporter is checked through our trust network.", color: "bg-figma-green" },
        { icon: <HiGlobeAlt />, title: "Global Reach", desc: "Buy and sell in over 150+ countries worldwide.", color: "bg-figma-purple" },
        { icon: <HiChartBar />, title: "Business Data", desc: "Easy-to-read data to help grow your business.", color: "bg-figma-orange" },
    ];

    return (
        <section className="py-24">
            <div className="container">
                <SectionHeader title="Built for" highlight="Success" subtitle="We provide the tools you need for high-quality international trade." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="h-full border-2 hover:border-primary/20 transition-colors">
                                <CardContent className="p-8">
                                    <div className={`w-12 h-12 ${f.color} text-white rounded-xl flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                                        {f.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                                </CardContent>
                            </Card>
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
        <section className="py-20 bg-figma-black text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-50%] left-[-10%] w-[100%] h-[100%] bg-figma-blue blur-[150px] rounded-full" />
            </div>
            <div className="container relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="text-4xl md:text-5xl font-black text-figma-blue mb-2 tracking-tighter">{s.value}</div>
                            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const steps = [
        { num: "01", title: "Join Hub", desc: "Create your account and verify your business details." },
        { num: "02", title: "List Products", desc: "Add your items to the site with clear descriptions." },
        { num: "03", title: "Find Goods", desc: "Use our search to find top-quality international products." },
        { num: "04", title: "Order Safely", desc: "Start a secure purchase with easy order tracking." },
    ];

    return (
        <section className="py-24 bg-muted/20">
            <div className="container">
                <SectionHeader title="How it" highlight="Works" subtitle="Easily manage global trade with our simple four-step process." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {steps.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative"
                        >
                            <div className="text-8xl font-black text-primary/5 absolute -top-10 left-0 leading-none select-none">
                                {s.num}
                            </div>
                            <div className="relative pt-4">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary text-white text-xs flex items-center justify-center font-black">{s.num}</span>
                                    {s.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const reviews = [
        { name: "Marcus Thorne", role: "Director, Global Logistics", text: "IEHUB has changed how we handle international shipping. The accuracy is the best in the industry.", avatar: "MT" },
        { name: "Elena Rossi", role: "Supply Chain Architect", text: "Finding reliable top-level suppliers used to take months. With IEHUB, we can do it in hours. A real game-changer.", avatar: "ER" },
        { name: "David Chen", role: "Export Specialist", text: "The most easy-to-use trade site I've tried. It connects local products with global buyers perfectly.", avatar: "DC" },
    ];

    return (
        <section className="py-24">
            <div className="container">
                <SectionHeader title="Trusted by" highlight="Business Leaders" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((r, i) => (
                        <Card key={i} className="bg-muted/30 border-none shadow-none">
                            <CardContent className="p-8">
                                <div className="text-figma-blue text-4xl font-serif mb-4">"</div>
                                <p className="text-lg font-medium italic mb-8 leading-relaxed">
                                    {r.text}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-figma-blue/20 text-figma-blue flex items-center justify-center font-black">
                                        {r.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{r.name}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{r.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTA = () => (
    <section className="py-24 bg-figma-blue">
        <div className="container">
            <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[0.9]">
                    Ready to start trading with <br /> the world?
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" asChild className="h-14 px-10 rounded-full text-base font-bold bg-white text-figma-blue hover:bg-white/90">
                        <Link to="/register">Create Account</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="h-14 px-10 rounded-full text-base font-bold border-white/30 text-white hover:bg-white/10">
                        <Link to="/about">Learn More</Link>
                    </Button>
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
            className="flex flex-col"
        >
            <Hero />
            <LatestProducts />
            <Stats />
            <HowItWorks />
            <Features />
            <Testimonials />
            <CTA />
        </motion.div>
    );
};

export default HomePage;
