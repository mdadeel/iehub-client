import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HiUsers, HiCube, HiBriefcase, HiCheckCircle, HiLogout, HiDownload } from 'react-icons/hi';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const AdminDashboardPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/admin/login');
    };

    const stats = [
        { label: "Verified Entities", value: "1,245", icon: <HiUsers />, color: "text-figma-blue" },
        { label: "Active Assets", value: "8,500", icon: <HiCube />, color: "text-figma-purple" },
        { label: "Pending Validation", value: "42", icon: <HiBriefcase />, color: "text-figma-orange" },
        { label: "Trade Throughput", value: "3.2M", icon: <HiCheckCircle />, color: "text-figma-green" },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Admin Header */}
            <header className="h-20 bg-background/80 backdrop-blur-md border-b flex items-center justify-between px-8 sticky top-0 z-[50]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-figma-blue rounded flex items-center justify-center p-1.5 shadow-lg shadow-figma-blue/20">
                        <img src="/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <div className="font-black text-lg tracking-tighter uppercase">
                        IE HUB <span className="text-figma-blue">Command Center</span>
                    </div>
                </div>
                
                <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive font-black text-xs h-10 px-6 rounded-full"
                >
                    <HiLogout className="mr-2 w-4 h-4" /> TERMINATE SESSION
                </Button>
            </header>

            <main className="flex-1 container py-12 space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Global <span className="text-figma-blue">Telemetry</span></h1>
                        <p className="text-muted-foreground font-medium">Real-time infrastructure monitoring across the global trade network.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-figma-blue/10 text-figma-blue rounded-full border border-figma-blue/20">
                        <span className="text-[10px] font-black uppercase tracking-widest">Master Node v4.2.0</span>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <Card key={i} className="border-2 shadow-lg hover:border-figma-blue/20 transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-muted/50 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150" />
                            <CardContent className="p-6 flex items-center gap-4 relative z-10">
                                <div className={`w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl group-hover:bg-background transition-colors ${s.color}`}>
                                    {s.icon}
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{s.label}</div>
                                    <div className="text-3xl font-black tracking-tighter">{s.value}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* User Management */}
                <Card className="border-2 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b p-8 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight">Infrastructure Registry</CardTitle>
                            <CardDescription className="font-bold text-xs uppercase tracking-widest mt-1">Comprehensive node management protocol</CardDescription>
                        </div>
                        <Button className="font-black bg-figma-black hover:bg-figma-black/90 h-11 px-6 rounded-xl">
                            <HiDownload className="mr-2 w-4 h-4" /> EXPORT LOGS
                        </Button>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-muted/50 text-[10px] uppercase font-black tracking-widest text-muted-foreground text-left">
                                        <th className="px-8 py-4">Entity Identifier</th>
                                        <th className="px-8 py-4">Sector Protocol</th>
                                        <th className="px-8 py-4">Sync Status</th>
                                        <th className="px-8 py-4 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                                        <tr key={i} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-black text-[10px] text-figma-blue">
                                                        GL
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold">Global_Logistics_Node_{400 + i}</div>
                                                        <div className="text-[10px] text-muted-foreground font-medium">UID: 8829-XQ-{i}21</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-2 py-1 bg-muted rounded font-black text-[9px] uppercase tracking-widest text-muted-foreground">
                                                    EXPORTER_PREMIUM
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-figma-green shadow-[0_0_8px_rgba(10,207,131,0.5)]" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-figma-green">Synchronized</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Button variant="ghost" className="text-[10px] font-black text-figma-blue hover:text-figma-blue hover:bg-figma-blue/10">
                                                    EXECUTE OVERRIDE
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    <div className="bg-muted/30 border-t p-4 px-8 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <div>Displaying 7 of 1,245 Registry Entries</div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled className="h-8 border-2 font-black">PREV</Button>
                            <Button variant="outline" size="sm" className="h-8 border-2 font-black">NEXT</Button>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
