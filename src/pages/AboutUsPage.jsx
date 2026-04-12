import { motion } from 'framer-motion';
import { HiGlobeAlt, HiShieldCheck, HiTrendingUp, HiUsers } from 'react-icons/hi';
import { Card, CardContent } from '../components/ui/Card';

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
            className="container py-24"
        >
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-24">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-6"
                    >
                        Our Digital <span className="text-figma-blue">Heritage</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        ExportHub is a professional ecosystem designed to empower global enterprises
                        to transcend borders through verified technology and decentralized trust.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-4xl font-black tracking-tight">The Central <span className="text-figma-blue">Mission</span></h2>
                        <div className="space-y-4 text-muted-foreground font-medium text-lg leading-relaxed">
                            <p>
                                Founded in 2024, ExportHub was architected to solve the multi-layered complexities of international logistics and sector verification.
                                We believe transparency is the fundamental currency of global commerce.
                            </p>
                            <p>
                                Our infrastructure bridges the gap between artisan exporters and international corporate buyers
                                through a highly automated, secure network that ensures every transaction is verified at the source.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-figma-blue/10 blur-[100px] rounded-full" />
                        <Card className="border-2 shadow-2xl relative z-10 bg-background/80 backdrop-blur-xl p-12 text-center rounded-[40px]">
                            <h3 className="text-2xl font-black mb-4">Global Vision</h3>
                            <p className="text-muted-foreground italic font-bold">
                                "Empowering every local entity to become a verified global leader through algorithmic trust."
                            </p>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full border-2 hover:border-figma-blue/20 transition-all group">
                                <CardContent className="p-8 text-center">
                                    <div className="text-figma-blue text-3xl mb-4 group-hover:scale-110 transition-transform flex justify-center">
                                        {s.icon}
                                    </div>
                                    <div className="text-3xl font-black mb-1 tracking-tighter">{s.value}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{s.label}</div>
                                    <p className="text-xs text-muted-foreground font-bold leading-relaxed">{s.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AboutUsPage;
