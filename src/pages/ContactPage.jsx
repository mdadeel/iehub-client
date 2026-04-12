import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

const ContactPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Inquiry Transmitted. A trade analyst will contact you within 24 hours.");
        e.target.reset();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container py-24"
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-6"
                    >
                        Establish <span className="text-figma-blue">Contact</span>
                    </motion.h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        Our global support network is operational 24/7 to assist with your international trade requirements.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <Card className="border-2 shadow-2xl p-8 md:p-12">
                            <h2 className="text-3xl font-black tracking-tight mb-8">Initialize Trade <span className="text-figma-blue">Inquiry</span></h2>
                            <form onSubmit={handleSubmit} className="grid gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Authorized Representative</label>
                                        <Input required placeholder="John Doe" className="h-12 border-2 focus-visible:ring-figma-blue font-bold" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Secure Email</label>
                                        <Input type="email" required placeholder="john@enterprise.com" className="h-12 border-2 focus-visible:ring-figma-blue font-bold" />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sector Classification</label>
                                    <select className="flex h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:border-figma-blue transition-colors appearance-none cursor-pointer">
                                        <option>General Sourcing Inquiry</option>
                                        <option>Export Compliance Support</option>
                                        <option>Logistics & Shipping Telemetry</option>
                                        <option>Bulk Order Verification Protocol</option>
                                    </select>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Telemetry Description</label>
                                    <textarea
                                        required rows="6"
                                        placeholder="Describe your trade requirements in detail for our analysts..."
                                        className="flex min-h-[150px] w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:border-figma-blue transition-colors resize-none"
                                    ></textarea>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="h-14 text-lg font-black bg-figma-blue hover:bg-figma-blue/90 shadow-xl shadow-figma-blue/20 rounded-2xl mt-4"
                                >
                                    TRANSMIT INQUIRY
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="border-2 p-8 hover:border-figma-blue/20 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-figma-blue/10 text-figma-blue flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    <HiMail />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Direct Channel</div>
                                    <div className="text-lg font-black">concierge@iehub.global</div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-2 p-8 hover:border-figma-green/20 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-figma-green/10 text-figma-green flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    <HiPhone />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Priority Support</div>
                                    <div className="text-lg font-black">+1 (888) TRADE-INTL</div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-2 p-8 hover:border-figma-purple/20 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-figma-purple/10 text-figma-purple flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    <HiLocationMarker />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Global HQ</div>
                                    <div className="text-lg font-black truncate">123 Gateway Plaza, NY 10001</div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-2 bg-muted/20 p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <HiClock className="text-figma-blue w-6 h-6" />
                                <h3 className="text-lg font-black uppercase tracking-widest">Operational Windows</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-dashed pb-4">
                                    <span className="text-xs font-bold text-muted-foreground">Mon - Fri (Global Trade)</span>
                                    <span className="text-sm font-black text-figma-blue">24 HOURS</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-dashed pb-4">
                                    <span className="text-xs font-bold text-muted-foreground">Sat - Sun (Consultations)</span>
                                    <span className="text-sm font-black text-figma-blue">10 AM - 4 PM</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactPage;
