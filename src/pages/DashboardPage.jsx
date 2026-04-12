import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { HiArchive, HiTrendingUp, HiCurrencyDollar, HiUserGroup, HiArrowRight, HiStatusOnline } from 'react-icons/hi';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        exports: 0,
        imports: 0,
        value: 0,
        rating: 4.9
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.email || user.isGuest) {
                setLoading(false);
                return;
            }

            try {
                const [productsRes, importsRes] = await Promise.all([
                    api.get(`/products`),
                    api.get(`/imports/${user.email}`)
                ]);

                const myExports = productsRes.data.filter(p => p.exporterEmail === user.email);
                const myImports = importsRes.data;

                const exportValue = myExports.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

                setStats({
                    exports: myExports.length,
                    imports: myImports.length,
                    value: exportValue,
                    rating: 4.9
                });
            } catch (error) {
                console.error("Dashboard sync failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const statCards = user?.isGuest ? [
        { title: "Demo Exports", value: "12", icon: <HiTrendingUp />, color: "text-figma-purple" },
        { title: "Demo Imports", value: "8", icon: <HiArchive />, color: "text-figma-blue" },
        { title: "Asset Value", value: "$45,670", icon: <HiCurrencyDollar />, color: "text-figma-orange" },
        { title: "Hub Rating", value: "4.8", icon: <HiUserGroup />, color: "text-figma-green" },
    ] : [
        { title: "My Exports", value: stats.exports, icon: <HiTrendingUp />, color: "text-figma-purple" },
        { title: "Active Imports", value: stats.imports, icon: <HiArchive />, color: "text-figma-blue" },
        { title: "Asset Value", value: `$${stats.value.toLocaleString()}`, icon: <HiCurrencyDollar />, color: "text-figma-orange" },
        { title: "Trust Rating", value: stats.rating, icon: <HiUserGroup />, color: "text-figma-green" },
    ];

    if (loading) return (
        <div className="py-40 text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-figma-blue rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Synchronizing Telemetry...</p>
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
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Overview</h1>
                    <p className="text-muted-foreground font-medium">
                        Welcome back, <span className="text-foreground font-bold">{user?.displayName}</span>. System is fully operational.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-figma-green/10 text-figma-green rounded-full border border-figma-green/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-figma-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-figma-green"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Channel Online</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((s, i) => (
                    <Card key={i} className="border-2 shadow-lg hover:border-primary/20 transition-all group">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl group-hover:scale-110 transition-transform", s.color)}>
                                {s.icon}
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{s.title}</div>
                                <div className="text-2xl font-black tracking-tighter">{s.value}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Chart Placeholder */}
                <Card className="lg:col-span-2 border-2 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight">Trade Velocity</CardTitle>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">7-Day Transaction Telemetry</div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <div className="w-2 h-2 rounded-full bg-figma-blue" /> Imports
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <div className="w-2 h-2 rounded-full bg-figma-purple" /> Exports
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex items-end justify-between h-48 gap-2">
                            {[60, 45, 80, 55, 95, 40, 70].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col gap-1 h-full justify-end group/bar">
                                    <div 
                                        style={{ height: `${h}%` }} 
                                        className="bg-figma-blue/80 rounded-t-sm group-hover/bar:bg-figma-blue transition-colors relative"
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                            {h}
                                        </div>
                                    </div>
                                    <div 
                                        style={{ height: `${h * 0.6}%` }} 
                                        className="bg-figma-purple/80 rounded-b-sm group-hover/bar:bg-figma-purple transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 px-1">
                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                                <div key={d} className="text-[9px] font-black text-muted-foreground">{d}</div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-2 shadow-xl bg-figma-blue text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-500" />
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-black tracking-tighter">Terminal Actions</CardTitle>
                        <CardDescription className="text-white/70 font-bold text-xs uppercase tracking-widest">Execute Operations</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {user?.isGuest ? (
                            <>
                                <Button asChild variant="secondary" className="h-12 justify-between font-black rounded-xl">
                                    <Link to="/products">BROWSE ASSETS <HiArrowRight /></Link>
                                </Button>
                                <Button asChild variant="outline" className="h-12 justify-between font-black border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl">
                                    <Link to="/register">CREATE CORPORATE ID <HiArrowRight /></Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="secondary" className="h-12 justify-between font-black rounded-xl">
                                    <Link to="/dashboard/add-export">NEW EXPORT LISTING <HiArrowRight /></Link>
                                </Button>
                                <Button asChild variant="outline" className="h-12 justify-between font-black border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl">
                                    <Link to="/products">MARKETPLACE INDEX <HiArrowRight /></Link>
                                </Button>
                                <Button asChild variant="outline" className="h-12 justify-between font-black border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-xl">
                                    <Link to="/dashboard/my-exports">MANAGE INVENTORY <HiArrowRight /></Link>
                                </Button>
                            </>
                        )}
                    </CardContent>
                    <div className="p-6 mt-auto">
                        <div className="p-4 bg-black/20 rounded-xl border border-white/10">
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Network Status</div>
                            <div className="text-xs font-bold">Synchronized with 124 Global Nodes</div>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

export default DashboardPage;
