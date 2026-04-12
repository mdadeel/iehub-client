import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HiArrowRight } from 'react-icons/hi';

const MarketInsightsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container py-24"
        >
            <div className="mb-20">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                    Market <span className="text-figma-blue">Insights</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                    In-depth analysis of global trade patterns, logistics innovation, and macroeconomic signals.
                </p>
            </div>

            <div className="grid gap-12">
                {[
                    { date: "JAN 2026", title: "Predictive Logistics: AI Impact on Shipping", desc: "How machine learning is revolutionizing port congestion calculations and optimizing trans-pacific trade lanes." },
                    { date: "DEC 2025", title: "The Decoupling Debate: Supply Chain Resilience", desc: "Analyzing the shift from global efficiency to regional reliability in the wake of geopolitical volatility." },
                    { date: "NOV 2025", title: "Blockchain Manifests: Zero-Trust Trading", desc: "The technical implementation of smart contracts in high-value commodity verification protocols." }
                ].map((post, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-2 overflow-hidden hover:border-figma-blue/20 transition-all group">
                            <CardContent className="p-0 flex flex-col md:flex-row">
                                <div className="md:w-1/3 aspect-video md:aspect-auto bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-figma-blue/5 group-hover:bg-transparent transition-colors" />
                                    <div className="absolute top-6 left-6 bg-figma-black text-white text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-widest">
                                        Analysis
                                    </div>
                                </div>
                                <div className="md:w-2/3 p-8 md:p-12 space-y-6">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                        Trade Intelligence • {post.date}
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tight group-hover:text-figma-blue transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                        {post.desc}
                                    </p>
                                    <Button variant="ghost" className="p-0 hover:bg-transparent text-figma-blue font-black uppercase tracking-widest text-xs group/btn">
                                        READ ANALYSIS <HiArrowRight className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default MarketInsightsPage;
