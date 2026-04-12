import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';

const TradeExpertsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container py-24"
        >
            <div className="text-center mb-24">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter mb-6"
                >
                    The <span className="text-figma-blue">Expertise</span>
                </motion.h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                    Meet the architects of global connectivity and international trade legislation.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                {[
                    { name: "Marcus Thorne", role: "Strategic Market Entry", bio: "15+ years navigating complex international trade laws and cross-border regulatory frameworks." },
                    { name: "Sarah Jenkins", role: "Logistics Optimization", bio: "Former supply chain director for tier-1 automotive, specializing in algorithmic routing." },
                    { name: "Chen Wei", role: "Compliance Protocol", bio: "Expert in blockchain-verified manifests and end-to-end telemetry for high-value commodities." }
                ].map((expert, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-2 overflow-hidden shadow-xl hover:border-figma-blue/20 transition-all">
                            <div className="aspect-square bg-muted relative group">
                                <div className="absolute inset-0 bg-figma-blue/5 group-hover:bg-transparent transition-colors" />
                                <div className="absolute bottom-0 left-0 w-full p-6 text-center">
                                    <div className="w-12 h-1 bg-figma-blue mx-auto rounded-full mb-4" />
                                </div>
                            </div>
                            <CardContent className="p-8 text-center">
                                <h3 className="text-2xl font-black tracking-tight mb-2">{expert.name}</h3>
                                <p className="text-figma-blue font-black text-[10px] uppercase tracking-[0.2em] mb-6">{expert.role}</p>
                                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                                    {expert.bio}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default TradeExpertsPage;
