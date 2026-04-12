import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiEye, HiSearch, HiGlobeAlt, HiCube, HiTrendingUp } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const MyImportsPage = () => {
    const { user } = useAuth();

    if (user?.isGuest) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center">
                <div className="w-20 h-20 bg-figma-blue/10 text-figma-blue rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <HiGlobeAlt className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter mb-4">Demo <span className="text-figma-blue">Environment</span></h1>
                <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
                    Import tracking and acquisition history are not available in the demo sandbox. 
                    Please establish a verified corporate identity to access global trade records.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button asChild size="lg" className="rounded-full font-black bg-figma-blue hover:bg-figma-blue/90 h-14 px-8">
                        <Link to="/register">Create Account</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full font-black border-2 h-14 px-8">
                        <Link to="/dashboard">Back to Overview</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const [imports, setImports] = useState([]);
    const [filteredImports, setFilteredImports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchImports = useCallback(async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const { data } = await api.get('/products');
            const otherProducts = data.filter(p => p.exporterEmail !== user.email);
            setImports(otherProducts);
            setFilteredImports(otherProducts);
        } catch (error) {
            console.error("Failed to fetch imports", error);
            toast.error("Telemetry failure: Could not retrieve acquisition logs.");
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchImports();
    }, [fetchImports]);

    useEffect(() => {
        const results = imports.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.origin.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredImports(results);
    }, [searchTerm, imports]);

    if (loading) return (
        <div className="py-40 text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-figma-blue rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Retrieving Acquisition Logs...</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">My <span className="text-figma-blue">Imports</span></h1>
                    <p className="text-muted-foreground font-medium">Track incoming shipments and verify global acquisitions.</p>
                </div>
                
                <div className="relative w-full md:w-80">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                        placeholder="Search acquisition records..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 border-2 focus-visible:ring-figma-blue"
                    />
                </div>
            </div>

            {imports.length === 0 ? (
                <div className="py-32 text-center border-4 border-dashed rounded-[32px] bg-muted/20">
                    <HiGlobeAlt className="w-16 h-16 text-muted mx-auto mb-6" />
                    <h3 className="text-2xl font-black tracking-tight mb-2">Zero Active Imports</h3>
                    <p className="text-muted-foreground font-medium mb-8">You haven't initiated any acquisition protocols yet.</p>
                    <Button asChild size="lg" className="rounded-full font-black bg-figma-blue h-14 px-8">
                        <Link to="/products">EXPLORE MARKETPLACE</Link>
                    </Button>
                </div>
            ) : filteredImports.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground font-bold">No matching records detected.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredImports.map((item, index) => (
                            <motion.div
                                layout
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="overflow-hidden border-2 hover:border-figma-blue transition-all group flex flex-col h-full shadow-lg">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img 
                                            src={item.image || 'https://via.placeholder.com/300'} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-figma-blue text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-[0.1em] shadow-lg">
                                            {item.status || 'IN_TRANSIT'}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                                                <HiGlobeAlt className="text-figma-blue" />
                                                {item.origin}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <CardContent className="p-6 flex-1">
                                        <h3 className="text-xl font-black leading-tight mb-4 group-hover:text-figma-blue transition-colors truncate">{item.name}</h3>
                                        
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="p-3 bg-muted/50 rounded-xl border">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Volume</div>
                                                <div className="text-sm font-black flex items-center gap-1.5">
                                                    <HiCube className="text-figma-blue w-3 h-3" /> {item.quantity} U
                                                </div>
                                            </div>
                                            <div className="p-3 bg-muted/50 rounded-xl border">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Value</div>
                                                <div className="text-sm font-black flex items-center gap-1">
                                                    <span className="text-figma-blue">$</span>{item.price.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed">
                                            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Est. Synchronization</div>
                                            <div className="text-[10px] font-black text-figma-green uppercase tracking-widest flex items-center gap-1">
                                                <HiTrendingUp className="w-3 h-3" /> 14 DAYS
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-6 pt-0">
                                        <Button asChild variant="outline" className="w-full font-black border-2 hover:bg-figma-blue hover:text-white hover:border-figma-blue group/btn">
                                            <Link to={`/products/${item._id}`} className="flex items-center justify-center gap-2">
                                                <HiEye className="w-4 h-4" /> TRACK CHANNEL
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default MyImportsPage;
