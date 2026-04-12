import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiLockClosed } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (email === 'admin121@gmail.com' && password === 'admin121') {
            localStorage.setItem('isAdmin', 'true');
            toast.success('Central command authorized. Welcome, Admin.');
            navigate('/admin/dashboard');
        } else {
            toast.error('Authorization failed. Access denied.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-figma-black p-6 relative overflow-hidden">
            {/* Security Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[440px] z-10"
            >
                <Card className="border-white/10 bg-figma-black/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <CardHeader className="text-center pb-8 border-b border-white/5">
                        <div className="w-16 h-16 bg-figma-blue/10 text-figma-blue rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-figma-blue/20">
                            <HiLockClosed className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tighter text-white">System <span className="text-figma-blue">Control</span></CardTitle>
                        <CardDescription className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">High-Security Restricted Zone</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-8 grid gap-8">
                        <form onSubmit={handleLogin} className="grid gap-6">
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Security Identifier</label>
                                <Input 
                                    type="email" 
                                    placeholder="admin@enterprise.com" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 bg-white/5 border-white/10 text-white focus-visible:ring-figma-blue placeholder:text-white/20"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Key</label>
                                <Input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-white/5 border-white/10 text-white focus-visible:ring-figma-blue placeholder:text-white/20"
                                />
                            </div>
                            <Button type="submit" className="h-14 font-black bg-figma-blue hover:bg-figma-blue/90 text-lg mt-2">
                                AUTHORIZE ACCESS
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                                <span className="bg-[#1E1E1E] px-2 text-muted-foreground">Override Protocol</span>
                            </div>
                        </div>

                        <Button 
                            variant="outline" 
                            className="h-12 font-black border-figma-green/30 text-figma-green hover:bg-figma-green/10 hover:text-figma-green"
                            onClick={() => {
                                localStorage.setItem('isAdmin', 'true');
                                toast.success('Demo admin access granted. Welcome to System Control.');
                                navigate('/admin/dashboard');
                            }}
                        >
                            INITIATE DEMO BYPASS
                        </Button>

                        <div className="text-center">
                            <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                                All sessions are logged and cryptographically signed. <br />
                                Unauthorized access attempts will be permanently flagged.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
