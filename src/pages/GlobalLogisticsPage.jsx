import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';
import { HiTruck, HiShieldCheck } from 'react-icons/hi';

const GlobalLogisticsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container py-24"
        >
            <div className="text-center mb-20">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter mb-6"
                >
                    Global <span className="text-figma-blue">Logistics</span>
                </motion.h1>
                <div className="max-w-4xl mx-auto aspect-[21/9] rounded-[40px] bg-muted/30 border-4 border-dashed border-muted-foreground/20 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-figma-blue/5 blur-3xl rounded-full animate-pulse" />
                    <p className="text-xl font-black text-muted-foreground uppercase tracking-widest relative z-10 group-hover:scale-110 transition-transform">
                        Interactive Trade Map Coming Soon
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <Card className="border-2 p-10 hover:border-figma-blue/20 transition-all">
                    <CardContent className="p-0 space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-figma-blue/10 text-figma-blue flex items-center justify-center text-3xl">
                            <HiTruck />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Strategic Routing</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed italic border-l-4 border-figma-blue pl-6">
                            Our algorithmic routing engine ensures that your commodities reach their destination via the most efficient channels, bypassing geopolitical bottlenecks and optimizing for fuel and time.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 p-10 hover:border-figma-green/20 transition-all">
                    <CardContent className="p-0 space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-figma-green/10 text-figma-green flex items-center justify-center text-3xl">
                            <HiShieldCheck />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Security Protocol</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed italic border-l-4 border-figma-green pl-6">
                            Every shipment is monitored via end-to-end telemetry and blockchain-verified manifests, ensuring that what you send is exactly what arrives, with zero tampering risk.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default GlobalLogisticsPage;
