import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiMail, HiBriefcase, HiCheckCircle, HiMap, HiGlobeAlt } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const ProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const isGuestUser = user?.isGuest;

    const [formData, setFormData] = useState({
        displayName: user?.displayName || (isGuestUser ? 'Demo User' : 'Trade Merchant'),
        email: user?.email || (isGuestUser ? 'demo@importexport.com' : ''),
        role: isGuestUser ? 'Demo Account' : 'Verified Exporter',
        company: isGuestUser ? 'Demo Company' : 'Global Trade Ltd.',
        location: isGuestUser ? 'Demo Location' : 'Colombo, Sri Lanka'
    });

    const handleSave = (e) => {
        e.preventDefault();
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: 'Synchronizing profile...',
                success: 'System updated successfully!',
                error: 'Update failed.',
            }
        );
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Corporate <span className="text-figma-blue">Settings</span></h1>
                    <p className="text-muted-foreground font-medium">Manage your corporate identity and trade parameters.</p>
                </div>
                {isGuestUser && (
                    <div className="bg-figma-orange/10 text-figma-orange text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-figma-orange/20">
                        Sandboxed Entity Profile
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-2 shadow-xl overflow-hidden">
                        <div className="h-24 bg-figma-blue/10 relative">
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                <div className="w-24 h-24 rounded-[32px] bg-background border-4 border-background shadow-xl overflow-hidden flex items-center justify-center relative">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-figma-blue text-white flex items-center justify-center text-3xl font-black">
                                            {formData.displayName.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 bg-figma-green text-white p-1 rounded-full border-2 border-background">
                                        <HiCheckCircle className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-16 pb-8 text-center">
                            <h2 className="text-2xl font-black tracking-tight">{formData.displayName}</h2>
                            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-1">{formData.role}</p>
                            
                            <div className="mt-8 space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border">
                                    <HiMail className="text-figma-blue w-5 h-5 shrink-0" />
                                    <div className="text-left overflow-hidden">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Secure Channel</div>
                                        <div className="text-xs font-bold truncate">{formData.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border">
                                    <HiBriefcase className="text-figma-purple w-5 h-5 shrink-0" />
                                    <div className="text-left overflow-hidden">
                                        <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Entity Name</div>
                                        <div className="text-xs font-bold truncate">{formData.company}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-dashed bg-muted/20">
                        <CardContent className="p-6">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Security Protocol</h3>
                            <Button variant="outline" className="w-full font-bold border-2 h-11">
                                ROTATE ACCESS KEY
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-8">
                    <Card className="border-2 shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-6">
                            <div>
                                <CardTitle className="text-xl font-black tracking-tight">Identity Parameters</CardTitle>
                                <CardDescription className="font-bold text-xs uppercase tracking-widest mt-1">H-Fidelity Specification</CardDescription>
                            </div>
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                variant={isEditing ? "outline" : "default"}
                                className={isEditing ? "border-2 font-black" : "bg-figma-blue font-black"}
                            >
                                {isEditing ? 'ABORT EDIT' : 'MODIFY SPECS'}
                            </Button>
                        </CardHeader>

                        <CardContent className="p-8">
                            <form onSubmit={handleSave} className="grid gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Legal Representative</label>
                                        <Input
                                            disabled={!isEditing}
                                            value={formData.displayName}
                                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                            className="h-12 border-2 focus-visible:ring-figma-blue disabled:opacity-70 disabled:bg-muted/30 font-bold"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Trade Designation</label>
                                        <Input
                                            disabled={!isEditing}
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="h-12 border-2 focus-visible:ring-figma-blue disabled:opacity-70 disabled:bg-muted/30 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Corporate Entity</label>
                                        <Input
                                            disabled={!isEditing}
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="h-12 border-2 focus-visible:ring-figma-blue disabled:opacity-70 disabled:bg-muted/30 font-bold"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Geographic Node</label>
                                        <div className="relative">
                                            <HiMap className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                            <Input
                                                disabled={!isEditing}
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="pl-10 h-12 border-2 focus-visible:ring-figma-blue disabled:opacity-70 disabled:bg-muted/30 font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">System Identifier (Email)</label>
                                    <Input
                                        disabled={true}
                                        value={formData.email}
                                        className="h-12 border-2 opacity-50 bg-muted/30 cursor-not-allowed font-bold"
                                    />
                                    <p className="text-[9px] text-muted-foreground font-medium ml-1">Primary identifier cannot be modified without re-verification.</p>
                                </div>

                                {isEditing && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t">
                                        <Button type="submit" className="h-14 px-10 rounded-2xl font-black bg-figma-blue hover:bg-figma-blue/90 shadow-xl shadow-figma-blue/20">
                                            COMMIT UPDATES
                                        </Button>
                                    </motion.div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfilePage;
