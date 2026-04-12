import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';
import { HiArrowRight } from 'react-icons/hi';
import { Button } from '../components/ui/Button';

const BrowseCategoriesPage = () => {
    const categories = [
        { name: "Electronics", count: "1.2k Products", icon: "📱", color: "text-figma-blue" },
        { name: "Industrial", count: "850 Products", icon: "🏗️", color: "text-figma-orange" },
        { name: "Textiles", count: "2.1k Products", icon: "🧵", color: "text-figma-purple" },
        { name: "Agriculture", count: "920 Products", icon: "🌾", color: "text-figma-green" },
        { name: "Automotive", count: "640 Products", icon: "🚗", color: "text-figma-blue" },
        { name: "Chemicals", count: "430 Products", icon: "🧪", color: "text-figma-pink" },
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
                    Market <span className="text-figma-blue">Sectors</span>
                </motion.h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                    Explore our global marketplace organized by industrial sector and international demand.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-2 hover:border-figma-blue/20 transition-all group overflow-hidden">
                            <CardContent className="p-10 text-center">
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                                    {cat.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight">{cat.name}</h3>
                                <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest mb-8">{cat.count}</p>
                                
                                <Button variant="outline" className="rounded-full font-black border-2 group-hover:bg-figma-blue group-hover:text-white group-hover:border-figma-blue transition-all">
                                    EXPLORE SECTOR <HiArrowRight className="ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default BrowseCategoriesPage;
