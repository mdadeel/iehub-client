import { motion } from 'framer-motion';
import { HiGlobeAlt, HiTrendingUp } from 'react-icons/hi';
import { Card, CardContent } from '../components/ui/Card';

const LatestTradesPage = () => {
    const trades = [
        { id: "TRD-8821", item: "Solar Panel Array", from: "China", to: "Germany", status: "In Transit", color: "text-figma-blue" },
        { id: "TRD-7652", item: "Industrial Lathe", from: "Japan", to: "USA", status: "Cleared", color: "text-figma-green" },
        { id: "TRD-9011", item: "Premium Coffee Beans", from: "Brazil", to: "UK", status: "Processing", color: "text-figma-orange" },
        { id: "TRD-4432", item: "Raw Silk Bolts", from: "India", to: "France", status: "Delivered", color: "text-figma-purple" },
    ];

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
                    Live <span className="text-figma-blue">Telemetry</span>
                </motion.h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                    Real-time visualization of global commodity movement and transaction fulfillment.
                </p>
            </div>

            <div className="grid gap-6">
                {trades.map((trade, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-2 hover:border-figma-blue/20 transition-all group overflow-hidden">
                            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-8 w-full md:w-auto">
                                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                        <HiGlobeAlt className="text-figma-blue" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Asset Designation</div>
                                        <h3 className="text-2xl font-black tracking-tight">{trade.item}</h3>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Registry ID: {trade.id}</div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 text-center md:text-right w-full">Transfer Protocol</div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm font-black">{trade.from}</div>
                                            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Origin</div>
                                        </div>
                                        <div className="w-12 h-px bg-border relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-figma-blue rounded-full" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-black">{trade.to}</div>
                                            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Destination</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Sync Status</div>
                                    <div className={`px-4 py-1.5 rounded-full bg-muted border-2 border-transparent font-black text-xs uppercase tracking-widest flex items-center gap-2 ${trade.color}`}>
                                        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                        {trade.status}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default LatestTradesPage;
